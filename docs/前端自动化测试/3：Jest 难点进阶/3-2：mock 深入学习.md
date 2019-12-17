---
title: '3-2：mock 深入学习'
date: 2019-07-27
tags:
  - Jest
categories:
  - 自动化测试
permalink: 'test-learn-jest-mock3'
---

lesson10

之前我们通过这种方式来模拟异步请求

```js
// demo.js
import axios from 'axios'
export const fetchData = () => {
  return axios.get('/').then(res => res.data)
}
// 假设后端返回的数据：
// {
// data: "(function (){ return '123' })()"
// }
```

```js
// demo.test.js
import { fetchData } from './demo'
import axios from 'axios'
jest.mock('axios')
test('fetchData 测试', () => {
  axios.get.mockResolvedValue({
    data: "(function (){ return '123' })()"
  })
  return fetchData().then(data => {
    expect(eval(data)).toEqual('123')
  })
})
```

模拟异步请求是需要时间的，如果请求多的话时间就很长，这时候可以在本地 mock 数据，在根目录下新建 `__mocks__` 文件夹，里面新建一个 `demo.js`

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Jest/20190727223543.png)

意思是准备使用 `__mocks__` 中的 `demo.js` 来替换我们需要测试的 `demo.js`

```js
// __mocks__ 中的 demo.js
export const fetchData = () => {
  return new Promise((resolved, rejects) => {
    resolved("(function (){ return '123' })()")
  })
}
```

直接在 mocks 中写成 promise 同步的函数，直接 resolved 返回数据，现在去修改 `demo.test.js` 文件

```js
jest.mock('./demo')
import { fetchData } from './demo'
test('fetchData 测试', () => {
  return fetchData().then(data => {
    expect(eval(data)).toEqual('123')
  })
})
```

建议将 `jest.mock('./demo')` 置顶，表示使用 jest 去模拟当前文件夹下的 demo 文件，jest 就会**自动**到 `__mocks__` 目录下去找 demo 文件，先模拟，再引入模块

这种模拟数据的方式，就**不用**去模拟 **axios** 这个库，而是去直接模拟 **fetchData** 这个方法

使用 mock 的文件来替换我们真实的文件，从一个异步请求转变为同步函数

```js
jest.unmock('./demo')
```

取消模拟，这样测试就不会通过，jest 就不会使用我们 mock 的数据，而是使用真实的 demo 发送一个请求

还可以通过配置文件的形式，不用在代码中写

先注释掉 `jest.mock('./demo')`

修改 `jest.config.js` 文件，将 **automock** 设置为 **true**，默认 false，并解除注释

重启测试命令 `npm run test`，可以发现测试也是通过的

一旦设置了 **automock: true**，当我们导入方法的时候，会**自动**去找是否有 mock 目录，是否有 demo 这个文件，这和直接写 **jest.mock** 效果是一样的，这样当你 mock 的文件比较多的时候，就不用一行一行的 **jest.mock** 啦

如果我们需要测试两个函数，其中一个需要 mock，而另一个本身就是同步函数，不需要 mock，怎么写

先将 **automock** 改为 **false**，并且将 `jest.mock('./demo')` 还原，重启测试

这个时候在真实的 `demo.js` 中增加一个函数进行测试

```js
export const getNumber = () => {
  return 123
}

test('getNumber 测试', () => {
  expect(getNumber()).toEqual(123)
})
```

保存后测试用例是过不了的，因为我们的 **demo** 是通过 **mock** 替换的，mock 中我们并没有写 **getNumber** 这个函数

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Jest/20190727224607.png)

实际上我们希望的是，如果该函数被 mock 了，就使用 mock 中的函数，如果没有，就使用真实文件中的函数

```js {3}
jest.mock('./demo')
import { fetchData } from './demo'
const { getNumber } = jest.requireActual('./demo')
```

fetchData 是通过我们 mock 文件中的函数，而 getNumber 则是使用 `jest.requireActual` 方法，从真实文件中引入的

这时测试就可以通过了

更多 mock 的细节可以参考官方文档 [mock-function-api](https://jestjs.io/docs/en/mock-function-api) 和 [jest-object](https://jestjs.io/docs/en/jest-object)
