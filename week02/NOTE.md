> javaScript模块分三个模块：语法、运行时、执行过程

# 运行时
 ## 类型（7种）
   + Undefined、Null、Boolean、String、Number、Symbol、Object
   + 有关问题  
      1. 为什么有的编程规范要求用void 0代替undefined？
      > 答：js中undefined是一个变量，而非是一个关键字，因此避免被无意中被篡改，建议使用void 0来获取undefined值

      2. String有最大长度是2^53 - 1，且这个所谓的长度不是我们理解中的字符数。因为String的意义并非“字符串”，而是字符串的UTF16编码。我们对字符串的操作charAt、length等针对的是UTF16编码。所以，字符串的最大长度实际是受字符串的编码长度影响的。
      3. 字符串的值是不可变的，为什么？
      > var str = 'hello'   
        str[0] = 'w'
        console.log(str) // 返回hello，赋值未生效，说明字符串值不可变  
        str = 'world' // 此时把str的值改为'world'  
        console.log(str) //打印出来的值是"world"，说明字符串重新赋值和字符串拼接都会引用新的地址来存放字符串的值，是消耗内存的操作
        
      4. js中-0和+0是除法运算上有区别的
      > 为了使/0不报错，引入Infinity和-Infinity  
      1 / +0 // Infinity  
      1 / -0 // -Infinity
      
      5. 0.1 + 0.2 == 0.3 为什么返回false？
      > 这是浮点运算的特点，不是严格相等，而是相差微小的值，正确的比较方法应该是：  
      Math.abs(0.1 + 0.2 - 0.3 <= Number.EPSILON) // 检查两边差值的绝对值是否小于最小精度
      
    + Symbol
    
       1.使用
       > var sym = Symbol('des') // 这里的des是对Symbol的描述
      
       2.一些标准中提到的Symbol，可以在全局Symbol函数的属性中找到
       > 例如，我们可以使用Symbol.iterator来自定义for...of在对象上的行为  
    
    + Object
      >JavaScript中定义，对象是属性的集合
      
      * 问题  
        1.为什么基本类型可以调用对象的方法？
        > 即"123".charAt(0)  
        因为运算符提供了装箱操作，它会根据基础类型构造一个临时对象，使得我们能在基础类型上调用对应对象的方法

        2.类型转换
        > 使用内置的Object函数，显式调用装箱能力  
        var symbolObj = Object(Symbol("a"))
        symbolObj instanceof Symbol // true  
        typeof symbolObj            // object
        symbolObj.constructor === Symbol // true  
        
        // 每一类装箱对象皆有私有的Class属性，这些属性可以用Object.prototype.toString获取，即  
        Object.prototype.toString.call(symbolObj) // [object Symbol]
        
        // 拆箱：
        先调用对象的valueOf和toString方法来获得拆箱后的基本类型，若没找到valueOf和toString方法，或者这两个方法返回的不是基本类型，产生类型错误TypeError  
        // String的拆箱会优先调用toString  
        // es6后，还允许对象通过显式的指定@toPrimitive Symbol来覆盖原有行为
        obj[Symbol.toPremitive] = () => {return 'hello'}
    
- 对象
  + 特性
  > 对象具有高度动态性，这是因为JavaScript赋予了使用者在运行过程中为对象添加状态和行为的能力
  + 对象包含两种属性  
    1.数据属性(具有4个特征)
    * value：就是属性的值
    * writable：决定属性是否能被赋值（默认为true）
    * enumerable：for in 是否能枚举该属性（默认为true）
    * configurable：决定该属性是否可删除和改变特征值（默认为true）
    
    > 可以使用内置函数getOwnPropertyDescripter来查看数据属性内容  
    Object.getOwnPropertyDescripter(o, '属性名')

    2.访问器（getter/setter）（4个特征）
    * getter：函数或undefined，在取值时被调用
    * setter：函数或undefined，在取值时被调用
    * enumerable：决定for in能否枚举该属性
    * configurable：决定该属性能否被删除或者改变特征值
  
    > 如果我们想改变属性特征或定义访问器属性，可使用Object.defineProperty  
    var o = {a: 1}  
    Object.defineProperty(o, 'b', { value: 2, writable: false, enumerable: false, configurable: true })  
    // 新加一个属性b，特征设置为不可赋值和for in枚举，所以接下来对b属性的修改无效且for in遍历不可得到  
    
    3.定义对象时，可以使用get set关键字来创建访问器属性  
    var o = {
        get a() { return 1 }
    }
    o.a // 1
    
- 原型
  > 概括：
        1.若所有的对象都有私有字段[[prototype]],就是对象的原型
        2.读一个属性，对象本身没有，则继续访问对象的原型，直到原型为空或找到为止

  javascript提供了三种内置函数，操作原型：  
  1.Object.create 根据指定的原型创建对象，原型可以为null  
  2.Object.getPrototypeOf 获取对象的原型  
  3.Object.setPrototypeOf 设置一个对象的原型  

- javascript 类
  + new 运算  
    接收一个构造器和一组调用函数。实际上做了3件事：
    1. 以构造函数的prototype属性为原型，创建新对象
    2. 将this和参数传给构造器，执行
    3. 如果构造器返回的是对象，则返回，否则fanh第一步创建的对象
    > new这样的行为试图让函数对象在语法上与类相似，但它客观提供了两种方式，1.在构造器中添加属性 2.在构造器的prototype上添加属性
  + 当我们使用类的思想定义代码时，应尽量使用class来声明类，而不是用旧语法拿函数来模拟对象
  
## JS语言通识
  - 什么是产生式（BNF）
    + 用尖括号括起来的名称来表示语法结构名
    + 语法结构分成基础结构和需要用其他语法结构定义的复合结构
      * 基础结构称终结符
      * 复合结构成非终结符
    + 引号和中间的字表示终结符
    + 可以有括号
    + *表示重复多次
    + |表示或
    + +表示至少一次

    例子
    > 四则运算：1 + 2 * 3  
    终结符：Number、+ - * /  
    非终结符：MultiplicativeExpression、AddtiveExpression
  
  - 深入理解产生式  
    通过产生式理解乔姆斯基谱系
    + 0型 无限制文法
    >  ?::=? // 左右都可以是非终结符，无限制

    + 1型 上下文相关文法
    > ?<A>?::=?<B>? // 也是左右都可以定义，不过只有A\B这两部分可变
    
    + 2型 上下文无关文法
    > <A>::=? // 右边可定义，左边是固定的
    
    + 3型 正则文法
    > <A>::=<A>? // 左边正则的A部分必须出现在右侧的开头
 
    javaScript总体上是上下文无关文法，有特殊正则和相关文法   
    > 例题：2 ** 1 ** 2 = ?  
    答案是2，原因**运算符是平方的意思，且是右结合，先算右边   
    因此运算过程为1^2 = 1  
    然后变为2 ** 1 解为2^1 = 2
   
   - 语言的分类  
     按用途：
     + 数据描述语言
     > JSON HTML XAML SQL CSS
     + 编程语言
     > C C++ JAVA C# Python Ruby javaScript Perl Lisp
   - 按表达方式
     + 声明式语言
     > 只告诉结果，比如JSON HTML Lisp等  
       大多数数据描述语言都是声明式

     + 命令型语言
     > 除了告诉结果，还有每个步骤的语言。如C C++ JAVA C# Python Ruby javaScript Perl
     
 - 编程语言的性质
   + 图灵完备性
   > 1. 命令式--图灵机  
       1.goto  
       2.if和while
   > 2. 声明式--lambda  
       递归
 - 动态与静态
   + 动态
   > 1.在用户的设备/在线服务器上
     2.产品实际运行时
     3.Runtime
   + 静态
   > 1.在开发者设备上
     2.产品开发时
     3.Compiletime(编译时)

- 类型系统
   + 动态类型系统与静态类型系统
   > 判断规则：类型存在在谁的电脑上  
     动态类型：在用户机器上能够找到的类型，例：JavaScript  
     静态类型：开发过程中保留的类型，例：c++
   + 强类型和弱类型
   > String + Number  
   > String == Boolean
   + 复合类型
   > 1.结构体  
     2.函数签名  
     (T1, T2) => T3
   + 子类型
   + 泛型
   > 泛型和子类型相结合会产生逆变/协变  
   例：1.(协变)凡是能用Array<Parent>的地方，都能用Array<Child>  
    2.(逆变)凡是能用Function<Child>的地方，都能用Function<Parent>

- 一般命令式编程语言  
   分为5个层级：
   + Atom(原子级)  // 变量 直接量
   + Expression(表达式)
   + Statement(语句) // 条件语句 循环语句
   + Structure(结构)   // Function class
   + Program(程序/包)  // npm
 
## JS类型
  - Number
    + IEEE754 Double Float(IEEE754标准 双浮点数)
      * Sign(1个符号位：+/-) // 这里说的位就是一个bit，可以是0或1
      * Exponent(11个指数位)
      * Fraction(52个精度位)
      > 包含指数和有效位数，有效位数决定了浮点数表示的精度，指数决定了表示的范围  
      > 64位bit分布图，其中第一位表示符号，0为正，1为负
      > 接下来的前11位表示指数，后面的部分表示精度位。最后得到的float值是精度位乘以指数位乘以2的指数次方
  - String
    + Character（字符）
    + Code Point(码点)
    + Encoding（编码方式）  
    
    字符集：
      * ASCII
      * Unicode
      * UCS
      * GB
        > GB2312  
        > GBK(GB13000)
        > GB18030

      * ISO-8859
      * BIG5
    
- String语法
  + 3种写法:  
    1."abc" // 字符串中想使用双引号，\"转义即可  
    2.'abc'  
    3.\`abc` // 第一个反引号前可以加函数名，让函数做一些解析和处理

- 其他类型
  + Boolean
  + Null & Undefined
    > null是关键字，undefined不是，而是一个变量
    void 0可表示undefined值

 ## 对象
   - 特殊行为的对象
     + Array: Array的length属性根据最大的下标自动变化
     + Object.prototype:作为所有正常对象的默认原型，不能再给他设置原型了
     + String：为了支持下标运算，String的正整数属性访问会去字符串里查找
     + Arguments:arguments的非负整数下标属性跟对应的变量联动
     + 模块的namespace对象：特殊地方非常多，跟一般对象完全不一样，尽量只用于import
     + 类型数组和数组缓冲区：跟内存块相关联，下标运算比较特殊
     + bind后的function：跟原来的函数相关联
   - 例题：定义狗咬人的抽象对象  
     > 定义一个Dog的对象，若将咬的行为定义在Dog的对象上这样是不符合对象的基本特征。  
     > 在设计对象状态和行为时，总是遵循"行为改变状态"的原则
