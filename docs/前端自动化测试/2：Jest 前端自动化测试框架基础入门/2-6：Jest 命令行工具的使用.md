---
title: '2-6：Jest 命令行工具的使用'
date: 2019-07-25
tags:
  - Jest
categories:
  - 自动化测试
permalink: 'test-learn-jest-command'
---

npm run test ，会提示有一些命令，如

> Watch Usage
>
> › Press f to run only failed tests.
>
> › Press o to only run tests related to changed files.
>
> › Press p to filter by a filename regex pattern.
>
> › Press t to filter by a test name regex pattern.
>
> › Press q to quit watch mode.
>
> › Press Enter to trigger a test run.

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Jest/20190725142651.png)

```js
test('toMatch', () => {
  const str = 'http://www.zsh.com'
  expect(str).toMatch('zsh')
  expect(str).toMatch(/zsh/)
})
test('toContain', () => {
  const arr = ['z', 's', 'h']
  const data = new Set(arr)
  expect(data).toContain('z')
})
const throwNewErrorFunc = () => {
  throw new Error('this is a new error')
}
test('toThrow', () => {
  expect(throwNewErrorFunc).toThrow('this is a new error')
})
```

有三个测试用例，修改最后一个

```js
const throwNewErrorFunc = () => {
  throw new Error('this is a new error')
}
test('toThrow', () => {
  expect(throwNewErrorFunc).toThrow('测试')
})
```

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Jest/20190725142633.png)

前面两项没有问题，最后一个报错了，如果继续修改，还是把测试用例**全部**跑一遍，当你的测试用例很多的时候，运行时间也就越久，我们需要 Jest 只**针对没有通过测试的用例**去运行

**f: 只会去跑之前没有通过的测试**

只要我们在控制台按 f 就可以了

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Jest/20190725142716.png)

可以发现之前通过的两个测试用例前面的图标从 √ 变成了 ○ 并且跳过了这两个测试用例，只会测试 toThrow 这个用例

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Jest/20190725142741.png)

如果出现 Watch Usage: Press w to show more. 只要按 w 就会出现更多信息

如果这个时候随便在代码中加一个回车，它就不会去跑所有的测试用例了，因为测试用例都已经通过了，没有错误，即便再改出了错误，Jest 也不会去测试了

如果要退出 f 这个模式，只需要再按一下 f

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Jest/20190725142757.png)

o：模式

Press o to only run tests related to changed files.

复制 matchers.test.js 到 **matchers1.test.js**

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Jest/20190725142822.png)

默认情况下会运行所有的测试文件，目前有 6 个测试用例都被跑了一遍，如果你只改 matchers1.test.js 里的文件，Jest 也会跑所有的测试文件，这其实是没有必要的，只需要跑我们当前修改的测试文件就可以了

使用 o 模式，它只会测试当前改变的文件

如果这时改了 matchers.test.js 和 matchers1.test.js，我们需要一个工具来帮我们记录改动了哪些文件

使用 **git** 来管理我们的代码

```bash
git init

git add .
```

这个时候再运行 npm run test

> No tests found related to files changed since last commit.
>
> Press `a` to run all tests, or run Jest with `--watchAll`

会提示找不到与上次提交后更改的文件相关的测试，请按 a （All 模式） 会运行所有测试或使用 --watch 运行 jest

因为**没有修改文件**，之提交一下代码到本地仓库

`git commit -m "version 1"`

重新运行 `npm run test`，修改 **matchers.test.js** 制造一个错误，标准模式下会测试 **6** 个用例，此时按 **o**

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Jest/20190725142844.png)

只会测试当前更改的文件中的 **3** 个用例，因为通过了 git 提交了代码，只要是在此基础上修改了文件，git 就能捕获到，Jest 也就知道了哪些文件被修改过，单独测试

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Jest/20190725142903.png)

:::tip

记住：o 模式是**一定**要配置 **git** 去使用的

:::

还有一种方式，就是修改 **package.json**

```json
{
  "scripts": {
    "test": "jest --watch",
    "coverage": "jest --coverage"
  }
}
```

将 **--watchAll** 改为 **--watch**，默认直接进入 **o** 模式

t：按测试用例名称的正则表达式来过滤哪些测试用例要执行

由于我们现在是 --watch 默认 o 模式，并且没有要更改的

> No tests found related to files changed since last commit.
>
> Press `a` to run all tests, or run Jest with `--watchAll`

要先进入 **a** 模式之后按 **t** 进入

> Pattern Mode Usage
>
> › Press Esc to exit pattern mode.
>
> › Press Enter to filter by a tests regex pattern.
>
> pattern ›

打开 matchers.test.js，这里有个测试用例叫 toMatch，复制下来并回车

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Jest/20190725143042.png)

只会测试 toMatch 用例，其他的都被跳过了

t: 模式就是根据我们测试用例的名字去过滤

q: 就直接是退出对代码的监控

Enter： 重新运行测试

当你使用 --watchAll 的时候，就可以使用 p 模式，跟 t 模式类似，根据测试文件名来过滤
