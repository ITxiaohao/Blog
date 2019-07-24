---
title: '2-3：使用 Jest 修改自动化测试样例'
date: 2019-07-24
permalink: 'test-learn-jest-modify'
---

[lesson2 源码]

### Jest 使用

如果只有 test 和 expect 这两个方法是远远不够的，让我们来学习 Jest 吧

在上一个课程的基础上：

```sh
npm init # 一顿回车

npm i jest@24.8.0 -D
```

安装指定版本，之后就不会因为版本升级的问题而与此教程有冲突，-D 表示 --save-dev 在开发阶段使用测试用例，上线后就不会使用了，它不是生成打包代码的一部分

安装完之后可以在 node_modules 文件夹下的 bin 文件夹目录中找到

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Jest/20190725005931.png)

先导出要测试的方法

```js
function add(a, b) {
  return a + b
}
function minus(a, b) {
  return a - b
}
function multi(a, b) {
  return a * b
}
module.exports = {
  add,
  minus,
  multi
}
```

导入，之前 math 是在浏览器环境下运行的代码，现在改为在 node 环境中运行的模块

```js
const math = require('./math')
const { add, minus, multi } = math
test('测试加法 3 + 7', () => {
  expect(add(3, 7)).toBe(10)
})
test('测试减法 3 - 3', () => {
  expect(minus(3, 3)).toBe(0)
})
test('测试乘法 3 * 3', () => {
  expect(multi(3, 3)).toBe(9)
})
```

修改 package.json

```json
{
  "scripts": {
    "test": "jest"
  },
  "devDependencies": {
    "jest": "^24.8.0"
  }
}
```

npm test 会执行 jest 命令，jest 会去找以 .test.js 为结尾的文件，这样 math.test.js 就会被运行

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Jest/20190724135853.png)

如果我们修改了预期，例如：

```js
test('测试乘法 3 * 3', () => {
  expect(multi(3, 3)).toBe(10)
})
```

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Jest/20190724135944.png)

:::tip 提问
Q: 为什么使用 Jest 需要将方法导出？

Jest 实际上在前端自动化测试中，帮我们完成的是两类内容。1：单元测试 2：集成测试

也可以说是模块测试和多个模块测试，所以我们要用 Jest 就一定要引入模块这个概念
:::

那么问题又来了，如果写成模块导出后，浏览器引入的 math 就不识别了，会提示 `module is not defined`，无法运行，怎么解决：加 `try catch`

```js
function add(a, b) {
  return a + b
}
function minus(a, b) {
  return a - b
}
function multi(a, b) {
  return a * b
}
try {
  module.exports = {
    add,
    minus,
    multi
  }
} catch (error) {}
```

测试环境下可以获取 module，浏览器也不会出错

不过现如今的 vue、react 根本不需要用 try catch，因为他们本身就是模块化的
