---
title: '3-3：mock times'
date: 2019-07-28
tags:
  - Jest
categories:
  - 自动化测试
permalink: 'test-learn-jest-mock-times'
---

lesson11

之前测试回调函数的方式，使用 done 进行测试

```js
export default callback => {
  setTimeout(() => {
    callback()
  }, 3000)
}

import timer from './timer'
test('timer 测试', done => {
  timer(() => {
    expect(1).toBe(1)
    done()
  })
})
```

使用 **done** 测试回调函数，由于定时器我们设置了 **3s** 后执行，等待 **3s** 后会发现测试通过了

假如 setTimeout 设置为几百秒，难道我们也要在 Jest 中等几百秒后再测试吗？

对这种 setTimeout 异步函数也做一些 mock 模拟，可以先将 timer.js 里的时间设置为 **30000**

使用 `jest.useFakeTimers()`、`jest.runAllTimers()` 和 `toHaveBeenCalledTimes`

```js
import timer from './timer'
jest.useFakeTimers()

test('timer 测试', () => {
  const fn = jest.fn()
  timer(fn)
  jest.runAllTimers()
  expect(fn).toHaveBeenCalledTimes(1)
})
```

首先使用 `jest.useFakeTimers()` 来模式定时器，之后使用 `jest.fn` 模拟函数，传入我们定义的 timer 中，再使用 `jest.runAllTimers()` 立刻执行所有的定时器，这样就不用等待 30s，`toHaveBeenCalledTimes(1)` 用来匹配定时器是否被调用过，参数表示次数，1 表示被调用了 1 次，这三者都是配套使用的

```js
export default callback => {
  setTimeout(() => {
    callback()
    setTimeout(() => {
      callback()
    }, 30000)
  }, 30000)
}
```

如果测试多个定时器，之前的测试用例就通过不了

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Jest/20190728112338.png)

期望这个函数被调用一次，担是现在被调用了两次，修改 **toHaveBeenCalledTimes**

`expect(fn).toHaveBeenCalledTimes(2)`

这样测试用例就可以通过了，如果只想让最外层的定时器执行，内部的不执行，可以使用 `jest.runOnlyPendingTimers()` 替换 `jest.runAllTimers()`

只运行当前处于队列中即将被执行的 timer，同时将 **toHaveBeenCalledTimes** 修改为 1

```js
import timer from './timer'
jest.useFakeTimers()
test('timer 测试', () => {
  const fn = jest.fn()
  timer(fn)
  jest.runOnlyPendingTimers()
  expect(fn).toHaveBeenCalledTimes(1)
})
```

但这样还是写的比较麻烦，在 jest 22 版本中推出了一个更好用的 API，即使之前的用法记不住也可以，使用这个新 API

```js
import timer from './timer'
jest.useFakeTimers()
test('timer 测试', () => {
  const fn = jest.fn()
  timer(fn)
  jest.advanceTimersByTime(30000)
  expect(fn).toHaveBeenCalledTimes(1)
})
```

使用 `jest.advanceTimersByTime()` 让时间快进 30s，如果我们快进 60s，setTimeout 就执行两次了，因为我们在 timer 里写了两个 setTimeout，只需要将 toHaveBeenCalledTimes 修改为 2 即可

```js
import timer from './timer'
jest.useFakeTimers()

test('timer 测试', () => {
  const fn = jest.fn()
  timer(fn)
  jest.advanceTimersByTime(30000)
  expect(fn).toHaveBeenCalledTimes(1)
  jest.advanceTimersByTime(30000)
  expect(fn).toHaveBeenCalledTimes(2)
})
```

如果这么写，就会在上一个快进的基础上再快进 30s，但如果有多个 test，就会给其他的 test 造成影响，例如：

```js
import timer from './timer'
jest.useFakeTimers()

test('timer 测试', () => {
  const fn = jest.fn()
  timer(fn)
  jest.advanceTimersByTime(30000)
  expect(fn).toHaveBeenCalledTimes(1)
  jest.advanceTimersByTime(30000)
  expect(fn).toHaveBeenCalledTimes(2)
})

test('timer1 测试', () => {
  const fn = jest.fn()
  timer(fn)
  jest.advanceTimersByTime(30000)
  expect(fn).toHaveBeenCalledTimes(1)
  jest.advanceTimersByTime(30000)
  expect(fn).toHaveBeenCalledTimes(2)
})
```

之前对时间的快进有可能会影响下一个测试用例，我们可以在 beforeEach 中来做

```js
beforeEach(() => {
  jest.useFakeTimers()
})
```

每个测试用例调用之前都重新执行一遍 `jest.useFakeTimers()` 做初始化
