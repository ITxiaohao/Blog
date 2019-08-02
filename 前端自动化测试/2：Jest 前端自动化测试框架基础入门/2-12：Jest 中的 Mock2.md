---
title: '2-12：Jest 中的 Mock（2）'
date: 2019-07-26
permalink: 'test-learn-jest-mock2'
---

## mock axios

一般在真实的项目里，测试异步函数的时候，不会真正的发送 ajax 请求去请求这个接口，为什么？

比如有 1w 个接口要测试，每个接口要 3s 才能返回，测试全部接口需要 30000s，这个自动化测试的时间就太慢了

我们前端只需要去确认这个异步请求发送成功就好了，至于后端接口返回什么内容我们就不测了，这是后端自动化测试要做的事情，不应该让前端去做

```js
// demo.js
import axios from 'axios'
export const runCallback = callback => {
  callback('abc')
}
export const createObject = classItem => {
  new classItem()
}

export const getData = () => {
  return axios.get('/api').then(res => res.data)
}
```

修改 demo.test.js，在最上面写 `jest.mock('axios')`

我们让 jest 去对 axios 做模拟，这样就不会去请求真正的数据了

`axios.get.mockResolvedValue({data: 'hello'})`

这时我们在 demo 中调用 axios.get 的时候，不会真实的请求这个接口，而是会以我们写的 `{data: 'hello'}` 去**模拟请求成功**后的结果

```js
import { runCallback, createObject, getData } from './demo'
import axios from 'axios'
jest.mock('axios')

test.only('测试 getData', async () => {
  axios.get.mockResolvedValue({ data: 'hello' })
  await getData().then(data => {
    expect(data).toBe('hello')
  })
})
```

测试通过，这样就把**异步获取数据**的内容转变为**同步准备数据**的内容

mock 第三个用处：改变函数的内部实现

**mockResolvedValueOnce** 模拟请求返回一次的结果

也可以用 **mockResolvedValueOnce** 来模拟多次请求，返回不同的结果

```js
test.only('测试 getData', async () => {
  // 第三个用处：改变函数的内部实现
  axios.get.mockResolvedValueOnce({ data: 'hello' })
  axios.get.mockResolvedValueOnce({ data: 'world' })
  await getData().then(data => {
    expect(data).toBe('hello')
  })
  await getData().then(data => {
    expect(data).toBe('world')
  })
})
```

还可以使用 **mockImplementation** 来模拟返回值：

```js
func.mockImplementation(() => {
  console.log(11)
  return 'zsh'
})

// 等同于
const func = jest.fn(() => {
  console.log(11)
  return 'zsh'
})
```

示例：

```js
test.only('测试 runCallback', () => {
  const func = jest.fn()
  // func.mockReturnValue('zsh')
  func.mockImplementationOnce(() => {
    console.log(11)
    return 'zsh'
  })
  func.mockImplementationOnce(() => {
    console.log(22)
    return 'ITxiaohao'
  })
  runCallback(func)
  runCallback(func)
  runCallback(func)
  // expect(func.mock.calls.length).toBe(2)
  // expect(func.mock.calls[0]).toEqual(['abc'])
  expect(func.mock.results[0].value).toBe('zsh')
  expect(func.mock.results[1].value).toBe('ITxiaohao')
  expect(func).toBeCalled()
  console.log(func.mock)
})
```

:::tip
`func.mockReturnValue()` 和 `func.mockImplementationOnce()` 比较类似，但还是有差别的

**mockReturnValue** 只能写返回值，但在 **mockImplementationOnce** 里可以写更多的逻辑再 return

```js
func.mockReturnValue('zsh')

func.mockImplementationOnce(() => {
  console.log(22)
  // do something
  return 'ITxiaohao'
})
```

:::

expect 的语句也叫**断言**，断定什么样的内容会有什么样的结果

```js
expect(func.mock.calls[0]).toEqual(['abc'])
expect(func).toBeCalledWith('abc')
```

toBeCalledWith 表示传递给回调函数的参数是 abc

```js
export const runCallback = callback => {
  callback('abc')
}
```

## mock 函数总结

1. 捕获函数的调用和返回结果，以及 this 和调用顺序
2. 它可以让我们自由的设置返回结果
3. 改变函数的内部实现
