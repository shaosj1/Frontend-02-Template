const http = require('http');

function startServer() {
  http
    .createServer((req, res) => {
      let body = [];
      req
        .on('error', (err) => {
          console.error(err);
        })
        .on('data', (chunk) => {
          body.push(chunk.toString());
        })
        .on('end', () => {
          console.log('end');
          body = Buffer.concat(body).toString();
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`<html> <head><title>toy brower</title>
          <style>
          #container{display: flex; width:500px; height:500px;background-color:rgb(125,125,125);}
          .block{width:200px;height:200px;background-color:rgb(255,255,0);}
          .block1{flex:1;background-color:rgb(255,0,0);}
          </style>
          </head>
          <body>
          <div id="container">
          <div class="block"></div>
          <div class="block1"></div>
          </div>
          </body>   
          </html>`);
        });
    })
    .listen(8088);

  console.log('server start');
}

startServer();
