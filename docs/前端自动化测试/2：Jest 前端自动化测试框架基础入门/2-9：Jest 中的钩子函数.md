---
title: '2-9：Jest 中的钩子函数'
date: 2019-07-25
tags:
  - Jest
categories:
  - 自动化测试
permalink: 'test-learn-jest-hook'
---

lesson7 源码

原理与 react 和 vue 中的生命周期完全一致

```js
// Counter.js
export default class Counter {
  constructor() {
    this.number = 0
  }
  addOne() {
    this.number += 1
  }
  minusOne() {
    this.number -= 1
  }
}
```

```js
// Counter.test.js
import Counter from './Counter'
const counter = new Counter()

test('测试 Counter 中的 addOne 方法', () => {
  counter.addOne()
  expect(counter.number).toBe(1)
})

test('测试 Counter 中的 minusOne 方法', () => {
  counter.minusOne()
  expect(counter.number).toBe(0)
})
```

通过第一个测试用例加 1，number 的值为 1，当第二个用例减 1 的时候，结果应该是 0

但是这样两个用例间相互干扰不好，可以通过 Jest 的钩子函数来解决

## beforeAll

在所有测试用例运行之前，会先调用 beforeAll 钩子函数

## beforeEach

每个测试用例执行之前，都会调用，类似 vue-router 的 beforeEach，这样每次测试都是一个**全新**的实例，各个用例之间**互不干扰**。

## afterEach

与 beforeEach 相反

## afterAll

与 beforeAll 相反

```js
import Counter from './Counter'
let counter = null

beforeAll(() => {
  console.log('BeforeAll')
})

beforeEach(() => {
  console.log('BeforeEach')
  counter = new Counter()
})

afterEach(() => {
  console.log('AfterEach')
})

afterAll(() => {
  console.log('AfterAll')
})

test('测试 Counter 中的 addOne 方法', () => {
  counter.addOne()
  expect(counter.number).toBe(1)
})
test('测试 Counter 中的 minusOne 方法', () => {
  counter.minusOne()
  expect(counter.number).toBe(-1)
})
```

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Jest/20190725234704.png)

在 Counter.js 中新增两个方法

```js
export default class Counter {
  constructor() {
    this.number = 0
  }
  addOne() {
    this.number += 1
  }
  addTwo() {
    this.number += 2
  }
  minusOne() {
    this.number -= 1
  }
  minusTwo() {
    this.number -= 2
  }
}
```
