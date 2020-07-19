## 语法树
### 表达式(优先级)
+ 1、member 
  + 点运算 a.b
  + 中括号 a[b]
  + foo\`string\`  string会被当成参数传入函数foo
  + super.b
  + super['b']
  + new.target
  + new Foo()
+ 2、 New
  + new Foo
### 运行时设施
引用类型
  + Object 
  + Key
  + delete 
  + assign

### call Expression
 + foo()
 + super()
 + foo()['b']
 + foo().b
+ foo()\`abc\`

### left Handside &right Handside
+ 1、left Handside 只能放在等号的左边
+  2、right Handside 只能放在等号的右边
    + update 自增自减 
    + Unary 单目运算符
      + delete
      + void
      + typeof
      + +a
      + -a
      + ~a
      + !a
      + await a
    + Exponental 乘方 （唯一一个右结合的运算符）
### Multiplicative
    + */%
### additive
    + +-
### Shift(运算)
    + \>> << >>>
### Relationship
    + /< > <= >= instanceof in

### Equality (相等)
  + ==
  + !=
  + ===
  + !==
### bitwise
 + &^|
### logical(逻辑运算)
+ &&
+ ||
### Conditional(三目运算)
+ ?:

### 类型转化
+ 位运算 == +
### 拆箱转化（Object => 普通数据类型）
+ Topremitive
+ toString vs valueOf
+ Symbol.topremitive(优先)
### 装箱转化 （
  + Number 1 => new Number(1)
  + String  'a' => new String('a')
  + Boolean true => new Boolean(true)
  + Symbol Symbol('a') => new Object(Symbol('a'))
  + 基本类型.属性   => 自动调用装箱转化

## 语句 statement
### completion record(语句执行完成结果的记录)
  + [[type]]:normal,break,continue,return,or throw
  + [[value]]:基本类型
  + [[target]]:label
### 简单语句（表达式语句）
  + 计算 
  + 流程控制
### 复合语句（控制简单语句的执行顺序）
  + 判断、循环
#### block
#### iteration

### 声明
+ function
+ fuction *
+ async function
+ async function *
+ var

+ class
+ const
+ let
#### 预处理
+ 所有的声明都有预处理机制
#### 作用域

## Js执行粒度（运行时）
+ 宏任务
+ 微任务 （promise)
+ 函数调用
+ 语句/声明
+ 表达式
+ 直接量/变量/this
### 函数调用
+ 执行上下文
+ 闭包（每个函数都会生成一个闭包）
