---
title: 'Event'
permalink: 'node-event'
---

## event

node 中一个核心概念就是事件，事实上很多 node 的模块都是基于事件，事件就是提示程序中发生了什么的信号

例如 node 中有个 http 模块

客户端往服务器发送一个 http 请求，服务端要做的就是响应这个事件，具体来说就是读取请求中的内容

如何操作事件模块：

node 中有个 events 事件触发器

大多数 Node.js 核心 API 构建于惯用的异步事件驱动架构，其中某些类型的对象（又称触发器，Emitter）会触发命名事件来调用函数（又称监听器，Listener）

监听器就是当事件发生时被调用的函数，

EventEmitter 类

```js
// ** event
const EventEmitter = require('events')
const event = new EventEmitter()
// 创建监听器
event.on('messageLogged', function() {
	console.log('Listener called')
})
// 发起事件
event.emit('messageLogged')
```

这里我们使用 on 方法来监听，还有个方法叫 addListener，on 是 addListener 的别名，更常用。

执行顺序很重要，如果你在发起事件后才定义监听器，那么什么都不会发生，因为当你发起事件时，emit 遍历了所有的监听者。所以要先发起事件，再监听

结果会输出 `Listener called`，可以在发起事件的时候携带数据，例如在 logger 模块记录日志的时候，可能会创建一个日志的编号返回给客户端，或者返回一个 URL 直接访问日志信息

```js
// ** event
const EventEmitter = require('events')
const event = new EventEmitter()
// 创建监听器
event.on('messageLogged', arg => {
	// 约定俗成一般用 arg，或者用 e、eventArg
	console.log('Listener called', arg)
})
// 发起事件
event.emit('messageLogged', { id: 1, url: 'http://' })
```

但是实际编程中很少会直接操作 **EventEmitter**，相反，我们会创建一个类，拥有 **EventEmitter** 的所有功能，为什么要这样做呢？看示例：

```js {3}
// app.js
const EventEmitter = require('events')
const event = new EventEmitter()
// 创建监听器
event.on('messageLogged', arg => {
	console.log('Listener called', arg)
})
const log = require('./logger')
log('message')
```

```js {3}
// logger.js
const EventEmitter = require('events')
const emitter = new EventEmitter()
var url = 'http://mylogger.io/log'
function log(message) {
	// Send an HTTP request
	console.log(message)
	// 发起事件
	emitter.emit('messageLogged', { id: 1, url: 'http://' })
}
module.exports = log
```

在 logger.js 中发起时间，在 app.js 中监听，但是输出完只有 message，没有触发监听，只是因为我们现在是操作着两个不同的 **EventEmitter**

在 app.js 中是 `event` 实例，在 logger 模块中是 `emitter` 实例，这是完全不同的两个实例，这就是不经常直接使用 **EventEmitter** 的原因

而是创建一个继承并扩展了 **EventEmitter** 所有能力的类，看示例：

```js {12}
// logger
const EventEmitter = require('events')
var url = 'http://mylogger.io/log'
class Logger extends EventEmitter {
	log(message) {
		// Send an HTTP request
		console.log(message)
		// 发起事件
		this.emit('messageLogged', { id: 1, url: 'http://' })
	}
}
module.exports = Logger // 导出 Logger 类
```

logger 不用导出 log 函数，而是导出 Logger 类，为了让 Logger 类完全具备 EventEmitter 的所有功能，使用 ES6 新增的 extends，这样 Logger 就具备了 EventEmitter 所以的功能和特性

将发起事件改为 this 来调用

```js {4}
// app.js
const EventEmitter = require('events')
const Logger = require('./logger')
const logger = new Logger()
// 创建监听器
logger.on('messageLogged', arg => {
	console.log('Listener called', arg)
})
logger.log('message')
```

在 app 中通过 new Logger() 来创建一个 logger 实例，并使用 logger 来创建监听器

以上是我们手动实现，Node 内置模块中也有很多类是基于 **EventEmitter**

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/node/20190719162648.png)

## http event

```js
const http = require('http')
const server = http.createServer()
server.listen(3000)
console.log('Listening on port 3000')
```

当我们运行应用的时候，就会监听 3000 端口，当有一个请求发送时，server 就会发起事件，我们就可以使用 on 方法来处理事件

在监听之前要先创造一个监听器 `server.on` 方法有两个参数，第一个是 `connection`,第二个是回调函数，socket 类的实例，没有返回值

```js
const http = require('http')
const server = http.createServer()
server.on('connection', () => {
	console.log('New connection')
})
server.listen(3000)
console.log('Listening on port 3000')
```

打开 localhost：3000，返回控制台，可以看到输出 `New connection`，这里就可以去处理一些事件，实际中不这么做，通常是给 **createServer** 方法一个回调函数

```js
const server = http.createServer((req, res) => {})
```

这样我们就可以直接操作真实的 **request** 和 **response** 对象，比如检测请求的 URL 为 `/` 我们就返回数据

```js
// ** http.js
const http = require('http')
const server = http.createServer((req, res) => {
	if (req.url === '/') {
		res.write('hello world')
		res.end()
	}
})
server.on('connection', () => {
	console.log('New connection')
})
server.listen(3000)
console.log('Listening on port 3000')
```
