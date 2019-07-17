---
title: "JavaScript 基础-上"
permalink: "javascript-first"
---

## 类型转换

在 JS 中类型转换只有三种情况，分别是：

- 转换为布尔值
- 转换为数字
- 转换为字符串

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123155338.png)

### 转 Boolean 类型

**undefined**、**null**、**false**、**NaN**、**''**、**0**、**-0**，转为 **false**，其他所有值都转为 **true**，**包括所有对象**。

### 四则运算符

:::tip
其他运算只要其中一方是**数字**，那么另一方就转为**数字**。
:::

**加法**运算符不同于其他几个运算符,它有以下几个特点：

- 运算中其中一方为**字符串**，那么就会把另一方也转换为**字符串**
- 如果一方不是字符串或者数字，那么会将它转换为**数字**或者**字符串**

```js
console.log(1 + "1"); // '11'
console.log(true + true); // 2
console.log(4 + [1, 2, 3]); // "41,2,3"
console.log([1, 2] + [2, 1]); // '1,22,1'
```

:::tip 练习
**`4 + [1, 2, 3]`** : 其中一方不是字符串或者数字，则转换为数字或者字符串

- 将 **`[1, 2, 3]`** 转换为 **`'1, 2, 3'`** 字符串
- **`4 + '1, 2, 3'`** 右边是字符串，将左边的数字也转换为字符串
- **`'4' + '1, 2, 3' = '41, 2, 3'`**

**`[1, 2] + [2, 1]`** : 其中一方不是字符串或者数字，则转换为数字或者字符串

**`[1, 2] + [2, 1]`** 转化为字符串，**`'1, 2' + '2, 1' = '1, 22, 1'`**
:::

对于加号需要注意这个表达式 `'a' + + 'b'`

`'a'` 是字符串，将右边 `+ 'b'` 转为数字，`+ 'b'` ---> NaN

**NaN** 不是字符串也不是数字，转换为 `'NaN'` 字符串

`'a' + NaN = 'aNaN'`、

有个小技巧就是将一些数字型的字符串转为 **number** 类型，如 `+ '1' = 1`

除了加法运算，只要其中一方是数字，那么另一方就会被转成数字

```js
console.log(4 * "3"); // 12
console.log(4 * []); // 0
console.log(4 * [1, 2]); // NaN
```

### == 操作符

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190214140108.png)

上图中的 toPrimitive 就是对象转基本类型。

这里来解析一道题目 `[] == ![] // -> true` ，下面是这个表达式为何为 **true** 的步骤

```js
// [] 转成 true，然后取反变成 false
[] == false
// 根据第 8 条得出
[] == ToNumber(false)
[] == 0
// 根据第 10 条得出
ToPrimitive([]) == 0
// [].toString() -> ''
'' == 0
// 根据第 6 条得出
0 == 0 // -> true
```

工作中尽量使用 `===` 来代替 `==`

:::tip
判断是否为 null 的时候用 ==，其他全部用 ===
:::

### 比较运算符

1. 如果是对象，就通过 toPrimitive 转换对象
2. 如果是字符串，就通过 unicode 字符索引来比较

```js
let a = {
  valueOf() {
    return 0;
  },
  toString() {
    return "1";
  }
};
a > -1; // true
```

在以上代码中，因为 **a 是对象**，所以会通过 **valueOf** 方法转换为原始类型再比较值。这里我们自定义了一个 **valueOf** 方法，返回的是 **0**，如果这里改为 **-2**，则 `a > -1` 为 **false**

## this

参考《你不知道的 JS》，书中比较详细的描述了 **this** 的指向问题

### 关于 this

**this 到底是什么**

> **this 是在运行时进行绑定的，并不是在编写时绑定，它的上下文取决于函数调用时的各种条件**

this 的绑定和函数声明的位置没有任何关系，只取决于函数的**调用方式**

当一个函数被调用时，会创建一个活动记录（有时候也称为执行上下文）。这个记录会包含函数在哪里被调用（调用栈）、函数的调用方法、传入的参数等信息。

this 就是记录的其中一个属性，会在函数执行的过程中用到。

:::tip
this 既不指向函数自身也不指向函数的词法作用域

this 实际上是在函数被调用时发生的绑定，它指向什么完全取决于函数在哪里被调用。
:::

### this 全面解析

1. 调用位置

在理解 this 的绑定过程之前，首先要理解调用位置：**调用位置就是函数在代码中被调用的位置（而不是声明的位置）**

只有仔细分析调用位置才能回答这个问题：这个 this 到底引用的是什么？

最重要的是要分析**调用栈**（就是为了到达当前执行位置所调用的所有函数）。

我们关心的调用位置就在当前正在执行的函数的**前一个调用中**

```js
function baz() {
  // 当前调用栈是：baz
  // 因此，当前调用位置是全局作用域
  console.log("baz");
  bar(); // <-- bar 的调用位置
}

function bar() {
  // 当前调用栈是 baz -> bar
  // 因此，当前调用位置在 baz 中
  console.log("bar");
  foo(); // <-- foo 的调用位置
}

function foo() {
  // 当前调用栈是 baz -> bar -> foo
  // 因此，当前调用位置在 bar 中
  debugger;
  console.log("foo");
}

baz(); // <-- baz 的调用位置
```

可以把调用栈想象成一个函数调用链，就像我们在前面代码段的注释中所写的一样。

但是这种方法非常麻烦并且容易出错。

另一个查看调用栈的方法是使用浏览器的**调试工具**

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190214142135.png)

### 四种绑定规则

你必须找到**调用位置**，然后判断需要应用下面**四条规则**中的哪一条。

我们首先会分别解释这四条规则，然后解释多条规则都可用时它们的优先级如何排列。

#### 2.1 默认绑定

首先要介绍的是最常用的函数调用类型：**独立函数调用**。

可以把这条规则看作是无法应用其他规则时的默认规则

```js
function foo() {
  console.log(this.a);
}
var a = 2;
foo(); // 2
```

当调用 `foo()` 时，`this.a` 被解析成了**全局变量 a**。为什么？因为在本例中，函数调用时应用了 this 的默认绑定，因此 this 指向全局对象。

那么我们怎么知道这里应用了默认绑定呢？可以通过分析调用位置来看看 `foo()` 是如何调用的。

`foo()` 是直接使用不带任何修饰的函数引用进行调用的，因此只能使用默认绑定，无法应用其他规则。

如果使用**严格模式（strict mode）**，那么全局对象将无法使用默认绑定，因此 **this 会绑定到 undefined**

```js
function foo() {
  "use strict";
  console.log(this); // undefined
  console.log(this.a); // TypeError: Cannot read property 'a' of undefined
}
var a = 2;
foo();
```

:::tip
这里有一个微妙但是非常重要的细节，虽然 this 的绑定规则完全取决于调用位置，但是只有 foo() 运行在非严格模式（ strict mode ）下时，默认绑定才能绑定到全局对象；严格模式下与 foo() 的调用位置无关
:::

#### 2.2 隐式绑定

```js
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2,
  foo: foo
};
obj.foo(); // 2
```

调用位置会使用 obj 上下文来引用函数，因此你可以说函数被调用时 obj 对象“**拥有**”或者“**包含**”它。

当 foo() 被调用时，它的落脚点确实指向 obj 对象。当函数引用有上下文对象时，隐式绑定规则会把函数调用中的 this 绑定到这个上下文对象。

**因为调用 foo() 时 this 被绑定到 obj，因此 this.a 和 obj.a 是一样的**

:::tip
**对象属性引用链中只有最后一层会影响调用位置**
:::

```js
function foo() {
  console.log(this.a);
}
var obj2 = {
  a: 42,
  foo: foo
};

var obj1 = {
  a: 2,
  obj2: obj2
};
obj1.obj2.foo(); // 42，最终是调用了 obj2.foo，this 指向 obj2
```

#### 注意隐式丢失的问题

一个最常见的 this 绑定问题就是被隐式绑定的函数会丢失绑定对象，也就是说它会应用默认绑定，从而把 this 绑定到全局对象或者 undefined 上，取决于是否是严格模式。

```js
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2,
  foo: foo
};

var bar = obj.foo; // 函数别名！！
var a = "oops, global"; // a 是全局对象的属性
bar(); // "oops, global"
```

以上代码放在**浏览器**环境中返回 `'oops, global'`，this 绑定到了 window 全局对象中，如果是在 node 环境中，全局对象是 global，还有在其他环境中 this 会绑定到 undefined

因为 bar() 函数是在全局下被调用的，虽然 **bar** 是 obj.foo 的一个引用，但是实际上，它引用的是 foo 函数本身，因此此时的 **bar()** 其实是一个不带任何修饰的函数调用，因此应用了默认绑定

::: warning
回调函数丢失 this 绑定是非常常见的
:::

#### 2.3 显式绑定

在分析隐式绑定时，我们必须在一个对象内部包含一个指向函数的属性，并通过这个属性间接引用函数，从而把 this 间接(**隐式**)绑定到这个对象上。

那么如果我们不想在对象内部包含函数引用，而想在某个对象上强制调用函数，该怎么做呢？

可以使用函数的 `call(..)` 和 `apply(..)` 方法。

它们的第一个参数是一个对象，它们会把这个对象绑定到 this，接着在调用函数时指定这个 this。因为你可以直接指定 this 的绑定对象，因此我们称之为显式绑定。

```js
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2
};
foo.call(obj); // 2
```

通过 **foo.call(..)**，我们可以在调用 foo 时强制把它的 this 绑定到 obj 上。

**可惜，显式绑定仍然无法解决我们之前提出的丢失绑定问题。**

1. 硬绑定

但是显式绑定的一个变种可以解决这个问题。

```js {8}
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2
};
var bar = function() {
  foo.call(obj);
};

bar(); // 2

setTimeout(bar, 100); // 2

// 硬绑定的 bar 不可能再修改它的 this
bar.call(window); // 2
```

以上代码请在**浏览器**环境中运行

我们创建了函数 bar()，并在它的内部手动调用了 **foo.call(obj)**，因此**强制**把 foo 的 this 绑定到了 obj。无论之后如何调用函数 bar，它总会手动在 obj 上调用 foo。

这种绑定是一种显式的强制绑定，因此我们称之为硬绑定。

举个 🌰：

硬绑定的典型应用场景就是创建一个**包裹函数**，传入所有的参数并返回接收到的所有值

```js
function foo(something) {
  console.log(this.a, something);
  return this.a + something;
}
var obj = {
  a: 2
};
var bar = function() {
  return foo.apply(obj, arguments);
};
var b = bar(3); // 2 3
console.log(b); // 5
```

由于硬绑定是一种非常常用的模式，所以在 ES5 中提供了内置的方法 `Function.prototype.bind`

```js
function foo(something) {
  console.log(this.a, something);
  return this.a + something;
}

var obj = {
  a: 2
};

var bar = foo.bind(obj);

var b = bar(3); // 2 3
console.log(b); // 5
```

bind(..) 会返回一个硬编码的新函数，它会把参数设置为 this 的上下文并调用原始函数。

更多细节请看 call、apply 和 bind 的区别

2. API 调用的“上下文”

内置函数，都提供了一个可选的参数，通常被称为“上下文”（context）

其作用和 bind(..) 一样，**确保你的回调函数使用指定的 this**

```js
function foo(el) {
  console.log(el, this.id);
}
var obj = {
  id: "awesome"
};

[1, 2, 3].forEach(foo, obj);
// 1 ' awesome'
// 2 ' awesome'
// 3 ' awesome'
```

这些函数实际上就是通过 call(..) 或者 apply(..) 实现了显式绑定，这样你可以少些一些代码。

#### 2.4 new 绑定

JavaScript 中 new 的机制实际上和面向类的语言完全不同

在 JavaScript 中，构造函数只是一些使用 new 操作符时被调用的函数。它们并不会属于某个类，也不会实例化一个类。实际上，它们甚至都不能说是一种特殊的函数类型，它们只是**被 new 操作符调用的普通函数而已**。

**实际上并不存在所谓的“构造函数”，只有对于函数的“构造调用”。**

使用 new 来调用函数，或者说发生构造函数调用时，会自动执行下面的操作

1. 创建（或者说构造）一个全新的对象。
2. 这个新对象会被执行 [[ 原型 ]] 连接。
3. 这个新对象会绑定到函数调用的 this。
4. 如果函数没有返回其他对象，那么 new 表达式中的函数调用会自动返回这个新对象。

```js
function foo(a) {
  this.a = a;
}

var bar = new foo(2);
console.log(bar.a); // 2
```

使用 new 来调用 foo(..) 时，我们会构造一个新对象 bar 并把它绑定到 foo(..) 调用中的 this 上。new 是最后一种可以影响函数调用时 this 绑定行为的方法，我们称之为 new 绑定。

### 优先级

现在我们已经了解了函数调用中 this 绑定的四条规则，你需要做的就是找到函数的调用位置并判断应当应用哪条规则。

但是，如果某个调用位置可以应用多条规则该怎么办？为了解决这个问题就必须给这些规则设定优先级，这就是我们接下来要介绍的内容。

毫无疑问，**默认绑定的优先级是四条规则中最低的**，所以我们可以先不考虑它。

```js
function foo() {
  console.log(this.a);
}
var objl = {
  a: 2,
  foo: foo
};

var obj2 = {
  a: 3,
  foo: foo
};
objl.foo(); // 2
obj2.foo(); // 3
objl.foo.call(obj2); // 3
obj2.foo.call(objl); // 2
```

相比隐式绑定，**显式绑定优先级更高**，也就是说在判断时应当先考虑是否可以应用显式绑定

**new 绑定 > 显式绑定 > 隐式绑定**

### 判断 this

1. 函数是否在 new 中调用（new 绑定）？如果是的话 this 绑定的是新创建的对象。

`var bar = new foo()` **this 指向 bar**

2. 函数是否通过 call、apply（显式绑定）或者硬绑定调用？如果是的话，this 绑定的是指定的对象。

`var bar = foo.call(obj2)` **this 指向 obj2**

3. 函数是否在某个上下文对象中调用（隐式绑定）？如果是的话，this 绑定的是那个上下文对象。

`var bar = obj1.foo()` **this 指向 obj1**

4. 如果都不是的话，使用默认绑定。如果在严格模式下，就绑定到 undefined，否则绑定到全局对象。

`var bar = foo()` **this 指向全局对象或者 undefined**

一定要注意，有些调用可能在无意中使用默认绑定规则。如果想“**更安全**”地忽略 this 绑定

你可以使用一个 DMZ 对象，比如 ø = **Object.create(null)**，以保护全局对象。

:::tip

ES6 中的箭头函数并不会使用四条标准的绑定规则，而是根据当前的词法作用域来决定 this

具体来说，**箭头函数会继承外层函数调用的 this 绑定**（无论 this 绑定到什么）。这其实和 ES6 之前代码中的 self = this 机制一样。

:::

#### 总结

如果要判断一个运行中函数的 this 绑定，就需要找到这个函数的直接调用位置。

找到之后就可以顺序应用下面这四条规则来判断 this 的绑定对象。

1. 由 new 调用？绑定到新创建的对象。
2. 由 call 或者 apply（或者 bind）调用？绑定到指定的对象。
3. 由上下文对象调用？绑定到那个上下文对象。
4. 默认：在严格模式下绑定到 undefined，否则绑定到全局对象

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190214155213.png)

## 深浅拷贝

基本数据类型保存在`栈内存`，引用类型保存在`堆内存`中

如果是基本数据类型，赋值的时候，会在栈内存中重新开辟一块空间，两者修改后互不影响

```js
let a = 1;

let b = a;

a = 2;

console.log(a); // 2
console.log(b); // 1
```

而赋值引用类型的时候，修改其中一个则会影响到另一个

以下是对象

```js
let a = {
  age: 1
};

let b = a;
a.age = 2;

console.log("a.age", a.age); // 2
console.log("b.age", b.age); // 2
```

以下是数组

```js
let arr = [1, 2, 3];

let brr = arr;

arr.push(4); // 使用 push、splic、pop、shift、unshift 均会更改

console.log(arr); // [ 1, 2, 3, 4 ]
console.log(brr); // [ 1, 2, 3, 4 ]
```

因为 a 和 b 都指向同一个引用，所以将 a 更改后，b 也跟着更改

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/vue-admin/20190717103420.png)

在开发中会遇到既要保留原始数据，又要更改新数据，如果只是单纯的改变值，我们可以使用浅拷贝

### 浅拷贝

对象的解决方法：

1、通过 `Object.assign()` 来解决

```js {5}
let a = {
  age: 1
};

let b = Object.assign({}, a);

a.age = 2;
console.log("a.age", a.age); // 2
console.log("b.age", b.age); // 1
```

2、通过 ES6 的展开运算符 `{...}`

```js {5}
let a = {
  age: 1
};

let b = { ...a };

a.age = 2;
console.log("a.age", a.age); // 2
console.log("b.age", b.age); // 1
```

数组的解决方法：

1、通过 `concat()` 来解决

**concat** 方法不会改变 **this** 或任何作为参数提供的数组，而是返回一个**浅拷贝**，它包含与原始数组相结合的相同元素的副本，原始数组的元素将复制到**新数组**中。[MDN 上对 concat 的描述](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)

```js {3}
let arr = [1, 2, 3];

let brr = arr.concat();

arr.push(4);
console.log(arr); // [ 1, 2, 3, 4 ]
console.log(brr); // [ 1, 2, 3 ]
```

2、通过 `slice()` 来解决

`slice()` 方法返回一个新的数组对象，这一对象是一个由 **begin** 和 **end**（不包括 end）决定的原数组的**浅拷贝**,原始数组不会被改变。[MDN 上对 slice 的描述](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)

```js {3}
let arr = [1, 2, 3];

let brr = arr.slice();

arr.push(4);
console.log(arr); // [ 1, 2, 3, 4 ]
console.log(brr); // [ 1, 2, 3 ]
```

其实这两种方法都是返回一个新的数组，所以改变其中一个数组并不会影响另一个

浅拷贝只能解决一层引用的问题，如果是多层则会失败

```js {8,10}
let a = {
  age: 1,
  city: {
    name: "fz"
  }
};

let b = Object.assign({}, a);

a.city.name = "sz";

console.log("a.city.name", a.city.name); // sz
console.log("b.city.name", b.city.name); // sz
```

有多层引用的时候就要使用深拷贝

### 深拷贝

通常可以使用 JSON.parse(JSON.stringify(object)) 来解决

```js {8,13}
let a = {
  age: 1,
  city: {
    name: "fz"
  }
};

let b = JSON.parse(JSON.stringify(a));

a.city.name = "sz";

console.log("a.city.name", a.city.name); // sz
console.log("b.city.name", b.city.name); // fz
```

但是该方法也是有局限性的：

- 会忽略 undefined
- 会忽略 symbol
- 不能序列化函数
- 不能解决循环引用的对象

```js
let a = {
  w: function() {},
  x: undefined,
  y: Object,
  z: Symbo
let b = JSON.stringify(a)
console.log(b) // '{}'

JSON.stringify([undefined, Object, Symbol('')])
// '[null,null,null]'
```

undefined、任意的函数以及 symbol 值，在序列化过程中会被忽略（出现在非数组对象的属性值中时）或者被转换成 null（出现在数组中时）

[MDN 上对 JSON.stringify 的描述](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)

不过这种解决方案可以解决大部分问题，并且该函数是内置函数中处理深拷贝性能最快的

如果想实现更好的深拷贝，可以使用 **lodash** 函数库

```js
var obj1 = {
  a: 1,
  b: { f: { g: 1 } },
  c: [1, 2, 3]
};
var obj2 = _.cloneDeep(obj1);
console.log(obj1.b.f === obj2.b.f); // false
```

也可以手动递归拷贝（较为麻烦）

```js
var obj1 = {
  a: 1,
  b: {
    f: {
      g: 1
    }
  },
  c: [1, 2, 3]
};

function getType(obj) {
  // tostring 会返回对应不同的标签的构造函数
  var toString = Object.prototype.toString;
  var map = {
    "[object Boolean]": "boolean",
    "[object Number]": "number",
    "[object String]": "string",
    "[object Function]": "function",
    "[object Array]": "array",
    "[object Date]": "date",
    "[object RegExp]": "regExp",
    "[object Undefined]": "undefined",
    "[object Null]": "null",
    "[object Object]": "object"
  };
  // 判断是否为 DOM 元素
  if (obj instanceof Element) {
    return "element";
  }
  return map[toString.call(obj)];
}

function deepClone(data) {
  var type = getType(data);
  var obj;
  if (type === "array") {
    obj = [];
  } else if (type === "object") {
    obj = {};
  } else {
    //不再具有下一层次
    return data;
  }
  if (type === "array") {
    for (var i = 0, len = data.length; i < len; i++) {
      obj.push(deepClone(data[i]));
    }
  } else if (type === "object") {
    for (var key in data) {
      obj[key] = deepClone(data[key]);
    }
  }
  return obj;
}

let obj2 = deepClone(obj1);
obj1.b.f.g = 2;
console.log(obj2); // 不会改变
```

## Map、Filter、Reduce

`Map` 的作用是生成一个**新数组**，遍历原数组，将数组中的元素进行一些变换后放入新数组中

```js
let array = [1, 2, 3];
let b = array.map(v => v + 1); // [2, 3, 4]
```

`Map` 接收三个参数，分别是**当前索引元素**、**索引值**、**原数组**

```js
let array = ["1", "2", "3"];
let b = array.map(parseInt); // [ 1, NaN, NaN ]
```

- 第一轮遍历  parseInt('1', 0) -> 1
- 第二轮遍历  parseInt('2', 1) -> NaN
- 第三轮遍历  parseInt('3', 2) -> NaN

`Filter`  的作用也是生成一个**新数组**，在遍历数组的时候**将返回值为  true  的元素**放入新数组，我们可以利用这个函数删除一些不需要的元素

```js
let array = [1, 2, 4, 6];
let newArray = array.filter(v => v !== 6);
console.log(newArray); // [ 1, 2, 4 ]
```

和  `Map`  一样，`Filter`  的回调函数也接受三个参数，用处也相同。

`Reduce` 可以将数组中的元素通过**回调函数**最终转换为一个值。

如果要实现一个将函数里的元素全部相加得到一个值，可能会这样写

```js
const arr = [1, 2, 3];
let total = 0;
for (let i = 0; i < arr.length; i++) {
  total += arr[i];
}
console.log(total); // 6
```

使用 `Reduce` 的话就可以将遍历部分的代码优化为一行代码

```js
const arr = [1, 2, 3];
const sum = arr.reduce((acc, current) => acc + current, 0); // 6
```

对于  `Reduce`  来说，它接受**两个参数**，分别是**回调函数**和**初始值**，接下来我们来分解上述代码中  `Reduce`  的过程

1. 首先初始值为  0，该值会在执行**第一次回调函数**时作为**第一个参数**传入
2. 回调函数接受四个参数，分别为**累计值**、**当前元素**、**当前索引**、**原数组**，这里着重分析第一个参数
3. 在第一次执行回调函数时，当前值和初始值相加得出结果 1，该结果会在**第二次执行回调函数**时当做**第一个参数传入**
4. 所以在第二次执行回调函数时，相加的值就分别是  1  和 2，以此类推，循环结束后得到结果  6

当然 `Reduce` 还可以实现很多功能，接下来我们就通过  `Reduce`  来实现  `Map`  函数

```js
const arr = [1, 2, 3];
const mapArray = arr.map(value => value * 2);
const reduceArray = arr.reduce((acc, current) => {
  acc.push(current * 2);
  return acc;
}, []);
console.log(mapArray, reduceArray); // [ 2, 4, 6 ] [ 2, 4, 6 ]
```

- 第一次执行的时候，将 **[]** 空数组作为第一个参数传入，即 **acc = []** ，然后执行回调函数，`acc.push(current \* 2)` 这里 **acc = []**，**current = 1** ，执行完后，**acc = [2]**，**return acc**

- 第二次执行的时候，将第一次执行的结果作为第一个参数传入，即 **acc = [2]** ，再执行 `acc.push(current \* 2)` ，这时的 **current = 2** ，结果 **acc = [2，4]**，返回 acc

- 第三次执行的时候，再将第二次执行的结果作为第一个参数传入，即 **acc = [2，4]**，再执行 `acc.push(current \* 2)` ，这时的 **current = 3**，结果 **acc = [2，4，6]** ，返回 acc ，reduce 函数执行结束
