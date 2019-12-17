---
title: '2-11：Jest 中的 Mock（1）'
date: 2019-07-26
tags:
  - Jest
categories:
  - 自动化测试
permalink: 'test-learn-jest-mock1'
---

不用 Mock 数据有些问题是解决不了的

```js
// demo.js
export const runCallback = callback => {
  callback()
}

// demo.test.js
import { runCallback } from './demo'
test('测试 runCallback', () => {
  const func = () => {
    return 'hello'
  }
  expect(runCallback(func)).toBe('hello')
})
```

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Jest/20190726160847.png)

因为我们执行了 callback 没有 return

修改 demo

```js
export const runCallback = callback => {
  return callback()
}
```

这样测试就通过了，但是，我们并不想为了通过测试而修改原本的逻辑，比如这里的 return

不必自己写 func 来模拟数据，可以借助 **jest.fn**

## jest.fn

```js
const func = jest.fn()
runCallback(func)
```

## toBeCalled

创建了一个函数，并且传递给了 **runCallback**，只要这个函数 func 被正确的**执行**了，是不是就能证明 runCallback 被执行过了。那么测试就通过了

```js
import { runCallback } from './demo'
test('测试 runCallback', () => {
  const func = jest.fn()
  runCallback(func)
  expect(func).toBeCalled()
})
```

使用 **toBeCalled** 匹配器，这时我们修改 demo.js，注释掉 callback()

```js
export const runCallback = callback => {
  // callback()
}
```

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Jest/20190726160950.png)

报错信息是：应调用模拟函数，但未调用它。

使用 **jest.fn** 来 mock 函数，用来**捕获**函数的调用

如果是这种自己写的函数，是通不过测试的，因为无法知道它是被调用的

```js
import { runCallback } from './demo'
test('测试 runCallback', () => {
  const func = () => {} // mock 函数 捕获函数的调用
  runCallback(func)
  expect(func).toBeCalled()
})
```

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Jest/20190726161028.png)

使用 toBeCalled 匹配器接收的值必须是模拟或监视函数

通过 jest.fn 这种方式创建的函数，会挂载一个 **mock** 属性

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Jest/20190726161041.png)

里面有个 **calls** 数组，保存该函数被调用过的情况，**instances** 表示它实例 **this** 的指向，**results** 表示这次执行输出的结果

有什么用呢？比如要测试 func 被调用了**两次**

```js
import { runCallback } from './demo'
test('测试 runCallback', () => {
  const func = jest.fn() // mock 函数 捕获函数的调用
  runCallback(func)
  runCallback(func)
  expect(func).toBeCalled()
  console.log(func.mock)
})
```

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Jest/20190726161102.png)

可以发现 calls 有两个中括号，func 被调用了两次，但是调用它的时候，参数传的都是空，我们加上参数

```js
// demo.js
export const runCallback = callback => {
  callback('abc')
}
```

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Jest/20190726161121.png)

因为被调用了两次，试用例就能这么写：

`expect(func.mock.calls.length).toBe(2)`

也能这么写

`expect(func.mock.calls[0]).toEqual(['abc'])`

**invocationCallOrder** 表示的是被调用的顺序

```js
runCallback(func)
runCallback(func)
runCallback(func)
```

**invocationCallOrder**: [ 1, 2, 3 ] ，你按顺序传递进去的，测试用例也是按这个顺序执行的

每次的返回值，因为我们没有写返回值，所以默认都是 **undefined**

```js
{
  results: [
    { type: 'return', value: undefined },
    { type: 'return', value: undefined },
    { type: 'return', value: undefined }
  ]
}
```

在 jest.fn 内部写了一个箭头函数返回 456，之后运行的时候就会 mock 返回值 456

```js
const func = jest.fn(() => {
  return '456'
}) // mock 函数 捕获函数的调用
```

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Jest/20190726161232.png)

## mockReturnValueOnce

也可以用其他语法来写，例如：**mockReturnValueOnce**，模拟返回一次

```js
const func = jest.fn() // mock 函数 捕获函数的调用
func.mockReturnValueOnce('zsh')
```

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Jest/20190726161255.png)

如果要多次可以这么写

```js
func.mockReturnValueOnce('zsh')
func.mockReturnValueOnce('hello')
func.mockReturnValueOnce('world')
```

或者用链式调用来写

```js
func
  .mockReturnValueOnce('zsh')
  .mockReturnValueOnce('hello')
  .mockReturnValueOnce('world')
```

## mockReturnValue

`func.mockReturnValue('zsh')` 表示每次返回的值都是固定的 `zsh`

测试用例就可以这么写

```js
expect(func.mock.results[0].value).toBe('zsh')
```

## instances

```js
// demo.js
export const runCallback = callback => {
  callback('abc')
}

export const createObject = classItem => {
  new classItem()
}

// demo.test.js
test.only('测试 createObject', () => {
  const func = jest.fn()
  createObject(func)
  console.log(func.mock)
})
```

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Jest/20190726161400.png)

this 的指向，之前是使用一个 mock 函数，this 的指向在 node 中为 undefined，如果是 new Jest.fn , this 自然就指向了 Jest.fn 的构造器
