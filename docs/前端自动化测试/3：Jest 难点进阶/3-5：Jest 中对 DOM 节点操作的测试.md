---
title: '3-5：Jest 中对 DOM 节点操作的测试'
date: 2019-07-28
tags:
  - Jest
categories:
  - 自动化测试
permalink: 'test-learn-jest-dom'
---

先安装 Jquery

```sh
npm i jquery
```

```js
import $ from 'jquery'
const addDivToBody = () => {
  $('body').append('<div/>')
}
export default addDivToBody

import addDivToBody from './demo'
import $ from 'jquery'
test('测试 addDivToBody', () => {
  addDivToBody()
  addDivToBody()
  console.log($('body').find('div').length)
  expect($('body').find('div').length).toBe(2)
})
```

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Jest/20190728155833.png)

在 Jest 里对 Dom 操作非常简单，Jest 实际是在 Node 的环境中，但 Node 本身不具备 Dom

原因是 Jest 在 Node 中自己模拟了一套 Dom API，一般称作 **jsDom**

这里不用 JQuery，直接使用 `document.getElementsByTagName` 这种原生 JS 的写法也是没问题的
