/**
 * 处理当type遇到大写的情况，比如Div，解析起来会当做class会报错
 * @param {*} type 
 * @param {*} attributes 
 * @param  {...any} children 
 */
export function createElement(type, attributes, ...children) {
  let element;
  if (typeof type === 'string')
    element = new ElementWrapper(type)
  else 
    element = new type

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

export class Component{
  constructor(content) {
    // this.root = this.render()
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

class TextWrapper extends Component{
  constructor(content) {
    this.root = document.createTextNode(content)
  }
}

class ElementWrapper extends Component{
  constructor(type) {
    this.root = document.createElement(type)
  }
}