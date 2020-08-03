学习笔记

1. 收集CSS
   - 利用 CSS 库将 CSS 代码转化成 AST 以供后续操作
   - CSS AST 是如何抽象表示 CSS 规则的
2. 添加调用
   - 在 startTag 就可以进行 CSS 规则收集
   - 真实浏览器中 body 如果含有 style 标签，会触发 CSS 的重新计算
3. 获取父序列
   - 在computeCSS函数中，我们必须知道元素的所有父元素才能判断元素与规则是否匹配
   - 计算父元素匹配的顺序是从内向外
4. 选择器与元素的匹配
   - 复杂选择起拆成针对单个元素的选择器，用循环匹配父元素队列
5. 计算选择器与元素匹配
   - 根据选择器的类型和元素的属性，计算是否与当前元素匹配
6. 生成computed属性
7. specificity的计算逻辑
   - CSS规则根据specificity和后来优先规则覆盖
   - specificity是个四元组，越左边权重越高
   - 一个CSS规则的specificity根据包含的简单选择器相加而成
8. 排版
   - layout 可以称之为排版或者布局，一个意思
   - 排版模式分为
     - 传统模式：float
     - flex
     - grid
     - CSS Houdini
9. 计算位置
    - 根据 flex 的各项属性计算得出每个元素的 width、height、left、right、top、bottom 使用这些来定位和布局
10. 绘制元素
    - 使用 images 库将 DOM Tree 绘制成图片
