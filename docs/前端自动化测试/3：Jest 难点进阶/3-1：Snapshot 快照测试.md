---
title: '3-1 Snapshot 快照测试'
date: 2019-07-27
tags:
  - Jest
categories:
  - 自动化测试
permalink: 'test-learn-jest-snapshot'
---

lesson9

比如我们有一个配置文件需要测试，配置文件及测试用例代码如下：

```js
// demo.js
export const generateConfig = () => {
  return {
    server: 'http://localhost',
    port: 8080,
    domain: 'localhost'
  }
}

// demo.test.js
import { generateConfig } from './demo'
test('测试 generateConfig 函数', () => {
  expect(generateConfig()).toEqual({
    server: 'http://localhost',
    port: 8080,
    domain: 'localhost'
  })
})
```

我们可以这么去测试代码，但如果我们修改了配置文件，使用 toEqual 匹配器来测试，就无法通过了，当然，你可以去修改 toEqual 里的内容，确保与配置文件里的相同，但如果一旦忘了修改 toEqual 里的内容，就会导致测试无法通过，我们可以使用快照功能，将我们之前测试的配置文件里内容保存一份，使用 toMatchSnapshot 匹配器

```js {8}
import { generateConfig } from './demo'
test('测试 generateConfig 函数', () => {
  // expect(generateConfig()).toEqual({
  // server: 'http://localhost',
  // port: 8080,
  // domain: 'localhost'
  // })
  expect(generateConfig()).toMatchSnapshot()
})
```

运行后会在根目录生成一个 `__snapshots__` 文件夹，以及 demo.test.js.snap 文件

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Jest/20190727211724.png)

里面的内容就是我们配置文件的数据

```js
// Jest Snapshot v1, https://goo.gl/fbAQLP
exports[`测试 generateConfig 函数 1`] = `
Object {
"domain": "localhost",
"port": 8080,
"server": "http://localhost",
}
`
```

当我们第一次运行测试用例的时候，**toMatchSnapshot** 会把 **generateConfig()** 返回的结果存到**快照**里，之后配置文件修改了，新的快照会和之前存的进行对比，如果一样就通过，反之不通过，例如修改了端口

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Jest/20190727211946.png)

如果我们真的要改这个配置文件，怎么办

先按 **w** 显示更多信息，再按 **u**，可以**更新**快照

**› Press u to update failing snapshots.**

更新完之后测试就可以通过了，并且在 **demo.test.js.snap** 里存的快照数据也更新了，可以理解为使用快照做二次确认，配置文件是否需要更改，因为也许我们会不小心修改了配置文件

## 测试两个快照

```js
// demo.js
export const generateConfig = () => {
  return {
    server: 'http://localhost',
    port: 8081,
    domain: 'localhost'
  }
}
export const generateAnotherConfig = () => {
  return {
    server: 'http://localhost',
    port: 8081,
    domain: 'localhost',
    time: 2019
  }
}
```

```js
// demo.test.js
import { generateConfig, generateAnotherConfig } from './demo'
test('测试 generateConfig 函数', () => {
  // expect(generateConfig()).toEqual({
  // server: 'http://localhost',
  // port: 8080,
  // domain: 'localhost'
  // })
  expect(generateConfig()).toMatchSnapshot()
})

test('测试 generateAnotherConfig 函数', () => {
  expect(generateAnotherConfig()).toMatchSnapshot()
})
```

先执行一遍测试用例，生成**两个**快照数据，**修改**两个原始数据之后，两个测试用例肯定是通过不了的

如果这个时候，通过 **u** 模式来**更新**快照，会发现两个快照的数据**全部更新**了，可如果我们希望**只更新一个**，另一个不更新，要怎么办

**› Press i to update failing snapshots interactively.**

使用 **i** 模式，通过交互式让你一个一个的去更新快照，而不是全部更新

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Jest/20190727212244.png)

这是第一个快照的错误信息，第二个快照被**跳过**了，会询问你是否需要通过 u 去更新

当按完 u 之后会继续出现**第二个**快照的信息，并且告诉你第一个已经被更新过了

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Jest/20190727212315.png)

再按 u 就会提示两个快照都更新完了，按回车就会返回之前的模式

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Jest/20190727212336.png)

## 测试动态数据

还有一种情况，可能我们配置文件里不是写死的数据，而是动态的，比如 `new Date()`

```js {14}
// demo.js
export const generateConfig = () => {
  return {
    server: 'http://localhost',
    port: 8082,
    domain: 'localhost'
  }
}
export const generateAnotherConfig = () => {
  return {
    server: 'http://localhost',
    port: 8081,
    domain: 'localhost',
    time: new Date()
  }
}
```

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Jest/20190727212431.png)

测试用例可以这么写

```js
test('测试 generateAnotherConfig 函数', () => {
  expect(generateAnotherConfig()).toMatchSnapshot({
    time: expect.any(Date)
  })
})
```

解释一下，这里的 `time: expect.any(Date)` 表示快照里的 **time** 可以是**任意类型**的 **Date** 都可以，不必每次和上一次**相等**，**记得先按 u 更新快照**

不仅仅支持 Date，还有 Number、String

## toMatchInlineSnapshot

现在我们快照是以文件的形式生成，下面来生成**行内**的快照，先把生成的快照文件**删除**

:::tip

需要先安装一个模块，不然是无法使用行内的快照的

```sh
npm i prettier@1.18.2
```

:::

```js
test('测试 generateAnotherConfig 函数', () => {
  expect(generateAnotherConfig()).toMatchInlineSnapshot({
    time: expect.any(Date)
  })
})
```

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Jest/20190727212707.png)

生成快照被放置到了 toMatchInlineSnapshot 的**第二个参数**里，这就是行内的 Snapshot，区别就在于把快照放到了测试用例中，更加直观

除了 u 可以更新快照，也可以按 **s** **跳过**当前的用例不更新

:::tip

提示：如果你只更新了一个用例，而 Jest 提示更新了两个，是有点问题的，可以 ctrl +c，之后重新运行下 npm run test，这个功能 Jest 刚推出不久，**也许在之后的版本中会修复**

:::
