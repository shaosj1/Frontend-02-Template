组件基本概念：
某种意义上可以认为是一种特殊的模块或对象，特点是以树形结构进行组合，有模板化的配置能力。
包含的语义要素：
Properties、Methods、Inherit、Attribute、Config&State、Event、lifecycle、ChildrenProperties vs Attribute
都有属性的意思，但是一些情况下是有区别的，Properties来源于对象属性；Attribute来源xml的属性
举例html中，两者就是不同的：
attribute:
<my-component  attribute="v"/>
myComponent.getAttribute('a')
myComponent.setAttribute('a', 'value')

properties:
myComponent.a = "value"

input value的特殊情况：
<input value="cute"/>
const input = document.getElementsByTagName('input')[0]
input.value = 'aa' // 若property设置了会优先显示property的设置，后面attribute的修改也不会影响input的展示
console.log(input.value, input.getAttribute('value'))
input.setAttribute('value', 'bb') // 修改attitute，不影响property
console.log(input.value, input.getAttribute('value')) 

四种要素的更改条件：
             标签设置    js设置    js修改   用户输入
property       否         是       是      不建议
attribute      是         是       是      不建议
state          否         否       否      是
config         是         否       否      否

为组件添加jsx语法
步骤：
1.创建一个文件夹，执行npm init，一路回车保留默认设置
2.npm i webpack webpack-cli 全局安装webpack
3.创建webpack.config.js文件，指定entry，做一些基本配置，可以配置mode:development
4.安装babel、@babel/core @babel/preset-env
5.创建main.js入口文件，简单写些代码
6.执行webpack命令，会生成dist文件夹，进去查看main.js文件内容，会发现使用babel后高版本的js会自动转为低版本的写法
7.安装@babel/plugin-transform-react-jsx，并在webpack.config.js文件中配置plugins
let a = <div/> // 此时在js文件中写改行代码会报错，安装@babel/plugin-transform-react-jsx插件，dist/main.js可以看到被解析为了React.createElement(\"div\", null);
8.plugins: [["@babel/plugin-transform-react-jsx", {pragma: "createElement"}]]配置中加入pragma属性指定函数名就可替换React.createElement的部分
9.实现createElement(type, attributes, ...children){}
webpack-dev-server  // 不需要反复的执行webpack命令