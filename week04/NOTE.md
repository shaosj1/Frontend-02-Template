学习笔记

# 状态机 有限状态机

```
有限状态机
每一个状态都是一个机器
    每个机器里都剋一计算存储输出
    所有机器接受的输入是一致的
    状态机的每一个机器本身没有状态，有函数表示--纯函数、无副作用
每一个机器知道下一个状态
    每个机器都有确定的下一个状态--Moore
    每个机器格局输入决定下一个状态--Mealy
```

```js
// JS中的有限状态机--Mealy
// 每个函数是一个状态
function state(input) { // 参数为输入
    return next; // 返回值作为下一个状态--根据输入进行处理后返回
}

// 使用
while(input) {
    state = state(input) // 调用函数获取状态返回值
}
```

```js
// 使用纯函数--状态机匹配abcdef
function match(string) {
  let state = start;
  for (let c of string) {
    state = state(c)
  }
  return state === end;
}

function start(c) {
  if (c === 'a') {
    return foundA;
  }
  return start;
}

function end(c) {
  return end;
}

function foundA(c) {
  if (c === 'b') {
    return foundB;
  }
  return start;
}

function foundB(c) {
  if (c === 'c') {
    return foundC;
  }
  return start;
}

function foundC(c) {
  if (c === 'd') {
    return foundD;
  }
  return start;
}

function foundD(c) {
  if (c === 'e') {
    return foundE;
  }
  return start;
}

function foundE(c) {
  if (c === 'f') {
    return end;
  }
  return start;
}

console.log(match('1ab11abcdef22'))
console.log(match('1111'))
```

```js
// *** 解决ababcdef a丢失

// 使用纯函数--状态机匹配abcdef
function match(string) {
  let state = start;
  for (let c of string) {
    state = state(c)
  }
  return state === end;
}

function start(c) {
  if (c === 'a') {
    return foundA;
  }
  return start;
}

function end(c) {
  return end;
}

function foundA(c) {
  if (c === 'b') {
    return foundB;
  }
  return start(c);
}

function foundB(c) {
  if (c === 'c') {
    return foundC;
  }
  return start(c);
}

function foundC(c) {
  if (c === 'd') {
    return foundD;
  }
  return start(c);
}

function foundD(c) {
  if (c === 'e') {
    return foundE;
  }
  return start(c);
}

function foundE(c) {
  if (c === 'f') {
    return end;
  }
  return start(c);
}

console.log(match('ababcdef'))
console.log(match('1111'))

// 未使用状态机
const findTargetStr = (str) => {
  const targetStr = 'abcdef';
  let compareStr = '';
  for (let i = 0; i <= str.length; i++) {
    const ele = str[i];
    const cLen = compareStr.length;
    if (cLen === targetStr.length && compareStr === targetStr) {
      return true;
    } else if (ele === targetStr[cLen]) {
      compareStr += ele;
    } else {
      compareStr = ele;
    }
  }
  return false;
}
console.log(findTargetStr('ababcdef'));
console.log(findTargetStr('11bcdef22'));
```

# 浏览器

    1、ISO-OSI七层网络模型

        应用层         
        表示层     HTTP require('http')
        会话层
        
        传输层     TCP/UDP require('net)
        
        网络层     Internet--IP协议
        
        数据链路层   4G/5GWifi
        物理层
    
    2、TCP/IP基础知识
        流               包
        端口              IP地址
        require('net')   libnet/libpcap

## HTTP

Request

Response

```
第一步：HTTP请求
1、设计一个http请求类
2、content-type设置默认值
3、body--key=value格式
4、不同的content-type对应的body格式不同

第二步：send函数实现
1、在Request的构造器中收集必要的信息
2、设计send函数将真实请求发送到服务器
3、send函数异步--返回Promise

备注：了解response格式--对response进行parse

第三步：发送请求
1、支持已有的connection 或 新建的connection
2、收到数据穿个parser
3、根据parser状态 resolve Promise

第四步： response解析
1、response 需分段构造--ResponseParser装配
2、ResponseParser分段处理ResponseText--使用状态机解析文本结构处理

第五步：BodyParser
1、Response body根据content-type不同会有不同结构--子parser结构解决
2、通过状态机处理body格式--TrunkedBodyParser
```

