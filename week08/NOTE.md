# 浏览器API

[重学前端+训练营学习笔记notion](https://www.notion.so/API-ad8f5bc0e9c6420fa53abfa9729cbe19)


## 标准化组织

- khromos: OpenGL, WebGL
- ECMA: ECMAScript
- WHATWG: HTML
- W3C: webaudio, CG（社区工作组）, WG（标准工作组）

## DOM API

- 节点：DOM树形结构中的节点相关API
- 遍历：遍历DOM需要的API
- 事件：触发和监听事件相关API
- Range：操作文字范围相关API

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/603bfa04-8b04-4196-bbce-a9f83604a2b2/6e278e450d8cc7122da3616fd18b9cf6.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/603bfa04-8b04-4196-bbce-a9f83604a2b2/6e278e450d8cc7122da3616fd18b9cf6.png)

```
ProcessingInstruction:  <?a 1?>   XML文档中处理指令
DocumentType: <!Doctype html>  H5文档类型
```

 

### Node 节点关系

- parentNode
- childNodes
- firstChild
- lastChild
- nextSibling
- previousSibling

### Element 元素关系

- parentElement
- children
- firstElementChild
- lastElementChild
- nextElementSibling
- previousElementSibling

### Node 节点操作

- appendChild：如果aChild已经存在，则只是移动到新的位置
- insertBefore：insertAfter可以使用insertBefore + nextSibling模拟实现
- removeChild：node.removeChild(child)
- replaceChild：parentNode.replaceChild(newChild, oldChild)
- compareDocumentPosition：node.compareDocumentPosition( otherNode )，返回表示位置关系的位掩码
- contains：node.cotains(otherNode)
- isEqualNode：节点类型相同，节点属性、属性值相同，返回true
- isSameNode：DOM level4 已废弃，可直接使用 node === otherNode判断

```jsx
const p = document.createElement('p');
document.body.appendChild(p);  // element.appendChild(aChild), 返回aChild

var sp1 = document.createElement("span");
var sp2 = document.getElementById("childElement");
var parentDiv = sp2.parentNode;
parentDiv.insertBefore(sp1, sp2); // parentNode.insertBefore(newNode, referenceNode)
```

### 节点创建（document的方法）

- createElement
- createTextNode
- createDocumentFragment
- ...

### Element 元素属性

- getAttribute：element.getAttribute('class')
- setAttribute：element.setAttribute('class', 'goods')
- removeAttribute：element.removeAttribute('class')
- hasAttribute：element.hasAttribute('class')

### Element查找（document的方法）

- querySelector
- querySelectorAll：返回NodeList静态列表
- getElementById
- getElementsByName、getElementsByTagName、getElementsByClassName：返回HTMLCollection 动态集合

## Range API

Range 表示一个包含节点与文本节点的一部分的文档片段。

创建：Document.createRange()、new Range()

- range.setStart(startNode, startOffset)
- range.setEnd(endNode, endOffset)
- range.setStartBefore(referenceNode)
- range.setEndBefore(referenceNode)
- range.setStartAfter(referenceNode)
- range.setEndAfter(referenceNode)
- range.selectNode(referenceNode)：使range包含referenceNode整个Node及内容
- range.selectNodeContents(referenceNode)：使range包含referenceNode的内容
- range.extractContents()：把range的内容从文档树移动到一个文档片段，返回DocumentFragment类型Node

```jsx
var range = new Range(),
    firstText = p.childNodes[1],
    secondText = em.firstChild
range.setStart(firstText, 9) // do not forget the leading space
range.setEnd(secondText, 4)

var fragment = range.extractContents()
range.insertNode(document.createTextNode("aaaa"))
```

```jsx
问题：逆序子元素
答案1:
function reverseChild(element) {
   let children = [...element.childNodes];
   for(let child of children) {
     element.removeChild(child);
   }
   // element.innerHTML = '';
   children.reverse();
   for(let child of children) {
     element.appendChild(child);
   }
}
答案2：
function reverseChild(element) {
	var l = element.childNodes.length;
	while(l-- > 0){
		element.appendChild(element.childNodes[l])
 }
}
答案3：
function reverseChild(element) {
	let range = new Range();
	range.selectNodeContents(element);
	let fragment = range.extractContent();
	var l = fragment.childNodes.length;
	while(l-- > 0) {
		fragment.appendChild(fragment.childNodes[l]);
	}
	element.appendChild(fragment);
}
```

## CSSOM

### CSSOM API

描述样式表和规则等CSS的模型部分

### CSSOM View

元素视图相关的View部分（CSSOM View）

**视口滚动 API**

- window.scrollX/scrollY
- window.scroll(x,y)  别名scrollTo 绝对位置
- window.scrollBy(x,y) 相对位置

**元素滚动 API**

- element.scrollTop
- element.scrollLeft
- element.scrollHeight
- element.scroll(x,y)
- element.scrollBy(x, y)
- element.scrollIntoView(arg)

```jsx
element.scrollIntoView(); // 等同于element.scrollIntoView(true) 
element.scrollIntoView(alignToTop); // Boolean型参数 
element.scrollIntoView(scrollIntoViewOptions); // Object型参数
alignToTop: true 顶对齐，false 底对齐
scrollIntoViewOptions: { 
	block: 'start'/'center'/'end'/'nearset', //垂直对齐方式
	inline: 'nearest'/'start'/'center'/'end', // 水平对齐方式
	behavior: 'auto'/'smooth', // 动画过渡效果
}
```

**全局布局 API**

- window.innnerHeight/innerWidth  视口大小
- window.devicePixelRatio 设备像素比
- window.screen.width/height 设备的屏幕尺寸
- window.screen.availWidth/availHeight 设备屏幕的可渲染区域尺寸

**元素布局 API**

- element.getClientRects() 包含元素对应的每一个盒所占据的客户端矩形区域
- element.getBoundingClientRect()
