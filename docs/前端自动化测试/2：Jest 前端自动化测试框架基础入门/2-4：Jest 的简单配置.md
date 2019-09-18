---
title: '2-4：Jest 的简单配置'
date: 2019-07-24
permalink: 'test-learn-jest-config'
---

[lesson3 源码]

## 生成 Jest 配置

Jest 本身就有一些默认配置，和 webpack 类似，webpack 你不做配置也能够打包

在根目录下运行 `npx jest --init`

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Jest/20190724231540.png)

```sh
√ Choose the test environment that will be used for testing » jsdom (browser-like)
√ Do you want Jest to add coverage reports? ... yes
√ Automatically clear mock calls and instances between every test? ... yes
```

这里我们在浏览器下测试，选择 jsdom，还有一个 node 选项

是否想增加代码覆盖率报告

是否自动清除每个测试之间的模拟调用和实例

都选 Yes

完成后会在目录下增加一个 `jest.config.js` 文件，里面就是各种配置的说明

里面有打开两个注释，一个是 Mock 的，一个是 Coverage，因为前面它在询问的时候，我们都选择了 Yes，所以这两个配置项就开启了

```js
clearMocks: true,
coverageDirectory: "coverage",
```

如果我们选的是 node 环境，这里就会将注释去掉

```js
// Respect "browser" field in package.json when resolving modules
// browser: false,
```

运行 npx jest --coverage

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Jest/20190724232042.png)

生成测试覆盖率的说明，同时会生成一个 coverage 的目录

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Jest/20190724232106.png)

打开 **lcov-report** 文件夹，打开文件内的 index.html

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Jest/20190724232148.png)

会告诉我们哪些文件被测试过，覆盖率是多少

如果觉得 npx jest --coverage 麻烦的话，可以在 package.json 中配置

```json
{
  "scripts": {
    "test": "jest",
    "coverage": "jest --coverage"
  }
}
```

之后 `npm run coverage` 即可

如果修改了 `jest.config.js`

`coverageDirectory: 'zsh'`

将 coverage 修改为 zsh，并且先删除 coverage 文件夹，之后再运行就会生成一个 zsh 的目录，coverageDirectory 生成 coverage 的目录

先删除 index.html 文件

修改 math.js，使用 export 导出函数

```js
export function add(a, b) {
  return a + b
}
export function minus(a, b) {
  return a - b
}
export function multi(a, b) {
  return a * b
}
```

修改 math.test.js

```js
import { add, minus, multi } from './math'
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

:::warning

运行测试，会报错，因为 Jest 是在 **Node** 环境中运行的，这种 **import** ES6 的导入 Node 还**不支持**，它**只支持** **commonJS** 的导入方法，也就是之前的 **require()** 方法

:::

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Jest/20190724232357.png)

## 使用 Babel7 转换 ES6 代码

我们使用 babel7 来转化 ES6 的语法，默认情况下，如果 Jest 知道 babel 配置，它将使用它来转换文件，忽略 `node_modules`

```sh
npm install @babel/core@7.4.5 @babel/preset-env@7.4.5 -D
```

这里要新建一个 `.babelrc` 文件来配置 babel

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "node": "current"
        }
      }
    ]
  ]
}
```

会根据我们当前的 node 环境，来结合 preset-env 来做转换，之后运行 npm test 就可以正常运行了

Jest 内部机制是: 当你运行 npm run jest 的时候，它内部集成了一个插件 (babel-jest) 会检测当前的环境下你是否安装了 babel 或者是 babel-core

安装了 babel-core 就会去取 .babelrc 的配置，会在运行 jest 之前结合 babel 做一个转换，转换成可以执行的代码，之后就可以运行了

当你在项目中要使用 ES6 甚至更高级的语法的时候，要安装 babel 来进行语法转换

更多细节可以参考[Getting Started](https://jestjs.io/docs/en/getting-started)

## Jest 自动重启

每次手动运行 npm test 比较麻烦，修改 package.json 中的 scripts

```json
{
  "scripts": {
    "test": "jest --watchAll",
    "coverage": "jest --coverage"
  }
}
```

这样 Jest 就会监听测试文件的变化做到自动重新去测试所有的测试用例

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Jest/20190725003052.png)
