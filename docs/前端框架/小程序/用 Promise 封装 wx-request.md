---
title: '用 promise 封装 wx.request'
date: 2019-12-17
tags:
  - 小程序
categories:
  - 前端框架
permalink: 'miniprogram-promise'
---

Promise 优势：多个异步等待合并

Promise 是一个对象，不是一个函数，对象是可以保存状态的

Promise 有三种状态，`pending` `fulfilled` `rejected` ，进行中、已成功、已失败

在 `new Promise` 的时候就是处于 `pending` 状态，通过 `reslove` 和 `reject` 把一个进行中的 `promise` 修改为**已成功**或者**已失败**的状态

一旦将状态修改为已成功或者已失败， **promise** 的状态就凝固了，不能再改变

```js
const promise = new Promise((resLove, reject) => {
  wx.getSystemInfo({
  success: res reslove(res),
  fail: error reject(error)
  })
})

promise.then(
  res => {
    console.log(res)
  },
  error => {
    console.log(error)
  }
)
```
