const net = require('net');
const images = require('images');
const path = require('path');
const parser = require('./parser');
const render = require('./render');
class Request {
  constructor(options) {
    const contentType = 'Content-Type';
    const urlencoded = 'application/x-www-form-urlencoded';
    const {
      method = 'GET',
      host,
      port = 80,
      path = '/',
      body = {},
      headers = {},
    } = options;
    this.method = method;
    this.host = host;
    this.port = port;
    this.path = path;
    this.body = body;
    this.headers = headers;
    if (!this.headers[contentType]) {
      this.headers[contentType] = urlencoded;
    }
    if (this.headers[contentType] === 'application/json') {
      this.bodyText = JSON.stringify(this.body);
    } else if (this.headers[contentType] === urlencoded) {
      this.bodyText = Object.keys(this.body)
        .map((key) => `${key}=${encodeURIComponent(this.body[key])}`)
        .join('&');
    }
    this.headers['Content-Length'] = this.bodyText.length;
  }

  send(connection) {
    return new Promise((res, rej) => {
      const parser = new ResponseParser();
      if (connection) {
        connection.write(this.toString());
      } else {
        connection = new net.createConnection(
          { host: this.host, port: this.port },
          () => {
            connection.write(this.toString());
          }
        );
      }
      connection.on('data', (chunk) => {
        parser.receive(chunk.toString());
        if (parser.isFinished) {
          res(parser.response);
          connection.end();
        }
      });
    });
  }

  toString() {
    const requestLine = `${this.method} ${this.path} HTTP/1.1\r`;
    const headers = `${Object.keys(this.headers)
      .map((key) => `${key}: ${this.headers[key]}`)
      .join('\r\n')}\r`;
    const body = this.bodyText;
    return `${requestLine}
${headers}
\r
${body}`;
  }
}

class ResponseParser {
  constructor() {
    this.WAITING_STATUS_LINE = 0;
    this.WAITING_STATUS_LINE_END = 1;
    this.WAITING_HEADER_NAME = 2;
    this.WAITING_HEADER_SPACE = 3;
    this.WAITING_HEADER_VALUE = 4;
    this.WAITING_HEADER_LINE_END = 5;
    this.WAITING_HEADER_BLOCK_END = 6;
    this.WAITING_BODY = 7;

    this.current = this.WAITING_STATUS_LINE;
    this.statusLine = '';
    this.headers = {};
    this.headerName = '';
    this.headerValue = '';
    this.bodyParser = null;
    this.state = this.start;
  }
  get isFinished() {
    // return this.state === this.end;
    return this.bodyParser && this.bodyParser.isFinished;
  }
  get response() {
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join(''),
    };
  }

  receive(string) {
    for (const char of string) {
      this.state = this.state(char);
    }
    // this.isFinished = state === this.end;
    // for (const char of string) {
    //   this.receiveChar(char);
    // }
  }

  start(c) {
    return this.addStatusLine(c);
  }
  end(c) {
    return this.end;
  }
  addStatusLine(c) {
    if (c === '\r') {
      return this.parseHeaders;
    } else {
      this.statusLine += c;
      return this.addStatusLine;
    }
  }
  parseHeaders(c) {
    if (c === '\n') {
      return this.addHeaderKey;
    }
  }
  addHeaderKey(c) {
    if (c === ':') {
      return this.parseHeadervalue;
    } else if (c === '\r') {
      if (this.headers['Transfer-Encoding'] === 'chunked') {
        this.bodyParser = new ChunkedBodyParser();
      }
      return this.endHeaders;
    } else {
      this.headerName += c;
      return this.addHeaderKey;
    }
  }
  parseHeadervalue(c) {
    if (c === ' ') {
      return this.addHeaderValue;
    }
  }
  addHeaderValue(c) {
    if (c === '\r') {
      this.headers[this.headerName] = this.headerValue;
      this.headerName = '';
      this.headerValue = '';
      return this.parseHeaders;
    } else {
      this.headerValue += c;
      return this.addHeaderValue;
    }
  }
  endHeaders(c) {
    if (c === '\n') {
      return this.parseBody;
    }
  }
  parseBody(c) {
    this.bodyParser.receiveChar(c);
    return this.parseBody;
  }
  receiveChar(char) {
    if (this.current === this.WAITING_STATUS_LINE) {
      if (char === '\r') {
        this.current = this.WAITING_STATUS_LINE_END;
      } else {
        this.statusLine += char;
      }
    } else if (this.current === this.WAITING_STATUS_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITING_HEADER_NAME;
      }
    } else if (this.current === this.WAITING_HEADER_NAME) {
      if (char === ':') {
        this.current = this.WAITING_HEADER_SPACE;
      } else if (char === '\r') {
        this.current = this.WAITING_HEADER_BLOCK_END;
        if (this.headers['Transfer-Encoding'] === 'chunked') {
          this.bodyParser = new ChunkedBodyParser();
        }
      } else {
        this.headerName += char;
      }
    } else if (this.current === this.WAITING_HEADER_SPACE) {
      if (char === ' ') {
        this.current = this.WAITING_HEADER_VALUE;
      }
    } else if (this.current === this.WAITING_HEADER_VALUE) {
      if (char === '\r') {
        this.current = this.WAITING_HEADER_LINE_END;
        this.headers[this.headerName] = this.headerValue;
        this.headerName = '';
        this.headerValue = '';
      } else {
        this.headerValue += char;
      }
    } else if (this.current === this.WAITING_HEADER_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITING_HEADER_NAME;
      }
    } else if (this.current === this.WAITING_HEADER_BLOCK_END) {
      if (char === '\n') {
        this.current = this.WAITING_BODY;
      }
    } else if (this.current === this.WAITING_BODY) {
      this.bodyParser.receiveChar(char);
    }
  }
}

class ChunkedBodyParser {
  constructor() {
    this.WAITING_LENGTH = 0;
    this.WAITING_LENGTH_LINE_END = 1;
    this.READING_TRUNK = 2;
    this.WAITING_NEW_LINE = 3;
    this.WAITING_NEW_LINE_END = 4;
    this.length = 0;
    this.content = [];
    this._isFinished = false;
    this.current = this.WAITING_LENGTH;
  }

  get isFinished() {
    return this._isFinished;
  }
  receiveChar(char) {
    if (this.current === this.WAITING_LENGTH) {
      if (char === '\r') {
        if (this.length === 0) {
          this._isFinished = true;
        }
        this.current = this.WAITING_LENGTH_LINE_END;
      } else {
        this.length *= 16;
        this.length += parseInt(char, 16);
      }
    } else if (this.current === this.WAITING_LENGTH_LINE_END) {
      if (char === '\n' && !this._isFinished) {
        this.current = this.READING_TRUNK;
      }
    } else if (this.current === this.READING_TRUNK) {
      this.content.push(char);
      this.length--;
      if (this.length === 0) {
        this.current = this.WAITING_NEW_LINE;
      }
    } else if (this.current === this.WAITING_NEW_LINE) {
      if (char === '\r') {
        this.current = this.WAITING_NEW_LINE_END;
      }
    } else if (this.current === this.WAITING_NEW_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITING_LENGTH;
      }
    }
  }
}

void (async function () {
  const request = new Request({
    method: 'GET',
    host: '127.0.0.1',
    port: '8088',
    path: '/',
    headers: {
      ['X-Foo2']: 'customed',
    },
  });
  const response = await request.send();
  const dom = parser.parseHTML(response.body);

  let viewport = images(1000, 600);
  render(viewport, dom);
  viewport.save(path.resolve(__dirname, 'viewpoet.jpg'));
})();
