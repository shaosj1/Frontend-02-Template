/**
 * 处理当type遇到大写的情况，比如Div，解析起来会当做class会报错
 * @param {*} type 
 * @param {*} attributes 
 * @param  {...any} children 
 */
function createElement(type, attributes, ...children) {
  let element;
  if (typeof type === 'string')
    element = new ElementWrapper(type)
  else 
    element = new Div

  for(let name in attributes) {
    element.setAttribute(name, attributes[name])
  }
    
  // 添加子元素
  for(let child of children) {
    // 判断下是否是文本节点
    if (typeof child === 'string') {
      child = new TextWrapper(child)
    }
    element.appendChild(child)
  }
  return element;  
}

class TextWrapper{
  constructor(content) {
    this.root = document.createTextNode(content)
  }
  setAttribute(name, value) {
    this.root.setAttribute(name, value)
  }
  appendChild(child) {
    console.log(child, this.root)
    child.mountTo(this.root)
  }
  mountTo(parent) {
    parent.appendChild(this.root)
  }
}

class ElementWrapper{
  constructor(type) {
    this.root = document.createElement(type)
  }
  setAttribute(name, value) {
    this.root.setAttribute(name, value)
  }
  appendChild(child) {
    child.mountTo(this.root)
  }
  mountTo(parent) {
    parent.appendChild(this.root)
  }
}

class Div{
  constructor() {
    this.root = document.createElement('div')
  }
  setAttribute(name, value) {
    this.root.setAttribute(name, value)
  }
  appendChild(child) {
    child.mountTo(this.root)
  }
  mountTo(parent) {
    parent.appendChild(this.root)
  }
}
let a = <Div id="mydiv" class="cls">
   <span>a</span>
   <span>b</span>
   <span>c</span>
   hello world!
   </Div>

a.mountTo(document.body)