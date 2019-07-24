---
title: 'Modules'
permalink: 'node-modules'
---

## 模块化

在 Node.js 模块系统中，每个文件都被视为一个独立的模块。

在浏览器中，定义的变量是全局的，可以通过 **window** 来调用，如：

```js
var msg = 'a'

console.log(window.msg) // a
```

在 node 环境中，**没有** window 这样的全局对象，而是 **global**，但是在文件中定义的变量，不会添加到 global 中去，作用域只在当前文件中，在文件外部它是不可见的，这就是 node 模块化系统

模块化可以避免定义全局变量和函数，我们需要创建模块来存放变量和函数，不同模块之间的同名变量和函数不会互相覆盖

在 node 中的每个文件其实都可以被看作是模块

每个模块中定义的变量和函数作用域就仅在该模块中，在模块外不可见，以面向对象的观点可以称为私有成员

如果你需要在其他模块中使用该模块的变量和函数，我们需要将它导出为共有成员

可以在 js 中打印 module，并用 node 环境运行该 js 文件

```js
console.log(module)

// 结果如下：

Module {
  id: '.',
  exports: {},
  parent: null,
  filename: 'E:\\zsh\\Node\\app.js',
  loaded: false,
  children: [],
  paths:
   [ 'E:\\zsh\\Node\\node_modules',
     'E:\\zsh\\node_modules',
     'E:\\node_modules' ]
}
```

这是一个 JSON 对象，如果我们需要将一个模块变为公共模块，就需要导出，就要用到 module 中的 exports 对象，添加到这个对象中的属性将可以在外部访问

```js
const s = 'string'
const o = {}
const a = []
const b = true
const f = function() {}

module.exports.a = a
module.exports.b = b
module.exports.s = s
module.exports.o = o
module.exports.f = f
console.log(module)

// 结果如下：
Module {
  id: '.',
  exports: { a: [], b: true, s: 'string', o: {}, f: [Function: f] },
  parent: null,
  filename: 'e:\\zsh\\Node\\app.js',
  loaded: false,
  children: [],
  paths:
   [ 'e:\\zsh\\Node\\node_modules',
     'e:\\zsh\\node_modules',
     'e:\\node_modules' ] }

```

这里有个注意的地方，通过 **module.exports** 进行导出，上面代码是将文件中的变量添加到 **module.exports** 对象中的属性里，还有一种导出方式，即 `module.exports = xxx`

不过这种方式只能导出一个变量或函数，为什么呢？看打印 module 的结果

```js
const s = 'string'
const o = {}
const a = []
const b = true

module.exports = s
module.exports = b
console.log(module)

Module {
  id: '.',
  exports: true,
  parent: null,
  filename: 'e:\\zsh\\Node\\app.js',
  loaded: false,
  children: [],
  paths:
   [ 'e:\\zsh\\Node\\node_modules',
     'e:\\zsh\\node_modules',
     'e:\\node_modules' ] }
```

可以看到 exports 为 true，即我们导出的 b 变量，b 变量将值赋给了 exports，因为 module 是 JSON 对象，是键值对的形式

如果我们要导出很多个变量以及函数，一个一个按这种形式去导出 `module.exports = x`，岂不是太累了，我们可以这样

```js
module.exports = {
	a,
	b,
	s,
	o,
	f
}
```

其实是等价于

```js
const obj = {
	a,
	b,
	s,
	o,
	f
}

module.exports = obj
```

导出没问题了，该如何导入，通过 `require('')` 的方式进行导入，`require` 不仅仅能引入模块，还可以引入 JSON、node_modules 模块或 Node.js 内置模块

新建一个 js 文件，将之前导出的模块引入，这里可以不用 .js 后缀，node 知道这是一个 js 文件，会自动添加扩展名

```js
const app = require('./app')
console.log(app)

// { a: [], b: true, s: 'string', o: {}, f: [Function: f] }
```

也可以通过 es6 的对象解构来获取导出对象中的属性，一定要与导出模块中的属性一一对应才行

```js
const { a, b, s, o, f } = require('./app')
console.log(a)
console.log(b)
console.log(s)
console.log(o)
console.log(f)

/**
 * []
 * true
 * string
 * {}
 * [Function: f]
 */
```

如果你想**重命名**导出的变量，可以这样：

```js
const { a: array, b, s, o, f } = require('./app')
console.log(array)
```

通过 `:` 冒号将 a **重命名**为 array

:::tip 记住这点

如果你以这种方式导出一个对象或者函数, `module.exports = { xxx }`，引入的时候也要加上 `{}`，即 `const { xxx } = require('..')`，如果没加， `const xxx = require('..')` 就要这样使用： `xxx.xxx`

:::

那么 node 是怎么实现 module.exports 和 require

我们可以在导出代码的 js 文件中的最顶端，强行制造一个错误 `var x = *`

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190509205806.png)

报错提示里有这么一段：

```js
;(function(exports, require, module, __filename, __dirname) {})
```

在执行模块代码之前，Node 会使用一个如下的函数封装器将我们的代码封装：

```js
;(function(exports, require, module, __filename, __dirname) {
	const s = 'string'
	const o = {}
	const a = []
	const b = true
	const f = function() {}
	const obj = {
		a,
		b,
		s,
		o,
		f
	}
	module.exports = obj
})
```

这是立即调用函数表达式，也称为 IIFE，node 不直接执行代码，而是将代码包裹在这样的函数中

详情见[官方文档](http://nodejs.cn/api/modules.html#modules_the_module_wrapper)

这里的 require 参数看起来是全局的，其实是模块本地的，在每个模块中，require 都是作为参数传给函数，称之为模块包装函数，这里的参数还有 exports，exports 是 module.exports 的简写，但是两者还是有区别的

`exports.x = x 等价于 module.exports.x = x`，但是，不能给 exports 对象复制，如：`exports = x`，一旦给 exports 赋予了新值，则不再绑定到 module.exports，结论是使用 **module.exports** 比较好

更多关于 exports 的细节参见[官方文档](http://nodejs.cn/api/modules.html#modules_exports_shortcut)

也可以打印这两个参数

```js
console.log('__filename', __filename)
console.log('__dirname', __dirname)
const s = 'string'
const o = {}
const a = []
const b = true
const f = function() {}
const obj = {
	a,
	b,
	s,
	o,
	f
}
module.exports = obj
```

## 内置模块

除了我们自定义的模块外，node 自身也有一些内置模块，如：HTTP、OS、path、process、QueryString、stream 等等，具体的使用方法见[官网](http://nodejs.cn/api/)

```js
const path = require('path')

const http = require('http')

const os = require('os')

const fs = require('fs')
```
