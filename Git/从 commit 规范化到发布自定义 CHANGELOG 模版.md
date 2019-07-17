---
title: "从 commit 规范化到发布自定义 CHANGELOG 模版"
permalink: "git-commit"
---

## 前言

最近在学习 Git 提交规范、发布及生成 CHANGELOG，最后实现自己的 CHANGELOG 模版并发布到 NPM，插件地址请戳[这里](https://www.npmjs.com/package/conventional-changelog-custom-config)

之前对 Git Commit 不是很规范，想到什么提交什么，团队中每个人的提交方式都不同，没有很特别的指定哪些 commit 是新功能，哪些是修复 bug，查看 commit 记录比较吃力

对版本的概念也不熟，使用 git tag 打版本之前，都需要**先查**一遍远程上的版本是多少，新增完本地 tag 之后再将 tag push 到远程仓库，这也只是完成了打版本的步骤，如果需要提供 CHANGELOG.md 文件来说明每次版本的更新内容就比较麻烦

这时候就需要插件来帮我们规范 git commit 提交、自动化发布版本，自动生成 CHANGELOG

**本文篇幅较长，图片较多，提前预警！**

## husky 钩子插件

使用 [husky](https://github.com/typicode/husky) 来管理 `git commit` 之前的操作，为什么要这么做，因为我们可以在 `git commit` 之前再校验一次代码，防止提交「脏」代码，保证代码库中的代码是「干净」的，`husky` 不仅仅能管理 `commit`，`git` 的钩子几乎都能管理，不过用的最多的还是 `commit` 和 `push`

- 安装

```bash
npm install husky --save-dev
```

- 在 package 中配置

```json
"husky": {
  "hooks": {
    "pre-commit": "npm run lint"
  }
}
```

这里在 `commit` 之前，我们先执行了 `npm run lint`，这是 `vue-cli3` 给我们提供的命令，会根据我们的 `eslint` 规则来校验代码，并且**自动修复**，记得先 `git add` 文件

- 使用

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190130184001.png)

但这样会有一个问题，就是这次提交，我可能只修改了一个文件，比如我就修改了 `a.js` 的内容，但它依然会校验 src 下面所有的 .js 文件，非常的不友好。

导致的问题就是：每次提交代码，无论改动多少，都会检查整个项目下的文件，当项目大了之后，检查**速度**也会变得越来越**慢**

## lint-staged

解决上面的痛点就需要使用 [lint-staged](https://github.com/okonet/lint-staged)。它**只会**校验你提交或者说你修改的**部分**内容。

`npm install lint-staged -D -S`

修改 package.json 配置：

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "src/*_/_.{js,vue}": ["npm run lint", "git add"]
  }
}
```

如上配置，每次它只会在你本地 `commit` 之前，校验你提交的内容是否符合你**本地配置**的 **eslint** 规则，如果符合规则，则会提交成功。如果不符合它会**自动**执行 `npm run lint` 尝试帮你**自动修复**，如果修复成功则会帮你把修复好的代码提交，如果失败，则会提示你错误，让你修好这个错误之后才能允许你提交代码。

但这并不是强制的，有些团队成员或者说刚来的新人没有在编辑器中配置或者**无视**命令行中提示的错误，强行提交，这时候就需要配置 **pre-commit** 这种强制性校验的东西，保证所有提交到远程仓库的内容都是符合团队规范的。

参考**花裤衩**大佬的文档 [vue-element-admin](https://panjiachen.gitee.io/vue-element-admin-site/zh/guide/advanced/git-hook.html#husky)

## Commit 提交规范检查

在多人协作项目中，如果代码风格统一、代码提交信息的说明准确，在后期维护以及 `Bug` 处理时会更加方便。

Git 每次提交代码，都要写 `Commit message`（提交说明）

但是每个人的提交方式不同，没有很特别的指定哪些 commit 是新功能，哪些是修复 bug，这时需要插件来帮我们规范化

规范 Commit message 的作用

- 提供更多的历史信息，**方便**快速浏览
- 过滤某些 commit（比如文档改动），便于快速查找信息
- 直接从 commit 生成 **CHANGELOG**
- **可读性好**，清晰，不必深入看代码即可了解当前 commit 的作用。
- 为 Code Reviewing（代码审查）做准备
- 方便跟踪工程历史

在项目中安装插件：

```bash
npm i commitizen cz-conventional-changelog --save-dev
```

- 在 package 中配置

```json
"config": {
  "commitizen": {
    "path": "cz-conventional-changelog"
  }
}
```

- 在 package 的 **scripts** 中配置命令

```json
"commit": "git-cz",
```

- 使用

依赖安装完就可以开始**秀操作**了

要先 `git add .` 将文件加入本地暂存区后，才能 `commit`

```bash
npm run commit
```

注意，如果之前通过 `git commit` 这种方式提交代码，都要改为 `git-cz`

注意，如果之前通过 `git commit` 这种方式提交代码，都要改为 `git-cz`

注意，如果之前通过 `git commit` 这种方式提交代码，都要改为 `git-cz`

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190130194119.png)

Commit message 格式说明

Commit message 一般包括三部分：**Header**、**Body** 和 **Footer**

**Header** `type(scope):subject` type(必需)、scope(可选) 和 subject(必需)

这里有几种类型可以选择

type：用于说明 commit 的类别，规定为如下几种

```md
feat：新功能
fix：修补 bug
docs：修改文档，比如 README, CHANGELOG, CONTRIBUTE 等等
style： 不改变代码逻辑 (仅仅修改了空格、格式缩进、逗号等等)
refactor：重构（既不修复错误也不添加功能）
perf: 优化相关，比如提升性能、体验
test：增加测试，包括单元测试、集成测试等
build: 构建系统或外部依赖项的更改
ci：自动化流程配置或脚本修改
chore: 非 src 和 test 的修改
revert: 恢复先前的提交
```

scope：(可选)用于说明 commit 影响的范围

subject：commit 的简要说明，尽量简短

**Body**

Body 部分是对本次 commit 的详细描述，可以分成多行

**Footer**

Footer 部分只用于两种情况。

- 不兼容变动

如果当前代码与上一个版本不兼容，则 Footer 部分以 **BREAKING CHANGE** 开头，后面是对变动的描述、以及变动理由和迁移方法。

- 关闭 Issue

如果当前 commit 针对某个 issue，那么可以在 Footer 部分关闭这个 issue, 也可以一次关闭多个 issue

```md
? Select the **type** of change that you're committing:
(type) 选择提交更改的类型
? What is the **scope** of this change (e.g. component or file name)? (press enter to skip)
(scope) 此次更改的范围是什么（组件或者文件名）
? Write a **short**, imperative tense description of the change:
(subject) 写一个简短的，命令式的变化描述
? Provide a **longer description** of the change: (press enter to skip)
(Body) 提供更改的长描述
? Are there any **breaking changes**?
(Footer) 有没有突破性的变化
? Does this change affect any open **issues**? (y/N)
(Footer) 此次更改是否有要关闭 issues
```

如果当前 commit 针对某个 issues

`? Does this change affect any open issues? (y/N)`

选择 Y，输入 **Closes #1** (表示关闭第 1 个 issues)

也可以一次关闭多个 issues ： Closes #1 #2 #3

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/vue-admin/20190625162916.png)

CHANGELOG 中 issues 默认的链接地址是根据 package.json 中的 **repository** 来生成的

如果 `repository` 没有，则会获取 git 中的**远程仓库路径**来作为前缀

之后就会进行**代码格式化校验**，如果代码不符合规范，同样会提交失败，**一定要确保项目当前格式没问题，规范后再提交！！！**

更多细节可以参考阮一峰老师的博客：[Commit message 和 Change log 编写指南](https://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)

## 自动发布版本

这里我使用 [release-it](https://github.com/release-it/release-it#readme) 作为发布版本插件，也可以选择 [standard-version](https://github.com/conventional-changelog/standard-version)

- 安装插件

```bash
npm install --save-dev release-it
```

- 在 package 的 **scripts** 中配置命令

```json
"release": "release-it"
```

在项目终端输入 `npm run release` 就会执行操作

如果出现下图的报错信息，可以通过登录 npm 解决

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/vue-admin/20190710225230.png)

在发布版本前，**一定**要**确认**是否还有文件**没有提交**，否则是会报错的，报错信息如下：

```bash
ERROR Working dir must be clean.
Please stage and commit your changes.
Alternatively, use `--no-git.requireCleanWorkingDir` to include the changes in the release commit (or save `"git.requireCleanWorkingDir": false` in the configuration).
```

工作目录必须是干净的，请暂存 (**add**) 并提交 (**commit**) 你的更改

**不推荐**通过修改 git 配置来解决，因为发布一个版本就应该是**没有任何更改**的，**稳定的**才去发布，git tag 如果没有指定对应的 commitID，**默认**在**最新**的 commit 上打标签，**注意！！**要在**主分支**(master)上发版本

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/vue-admin/20190625154549.png)

`release-it`会读取**本地**的 **package.json** 中的 **version**，提示你**当前**版本是多少，不需要开发者使用 `git tag -l` 来查询当前本地版本是多少，以及这个版本做了哪些改动，它提供了几个默认选项让你选择版本号

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/vue-admin/20190625154523.png)

如果你觉得上面的选项不能满足你的要求，最后一个选项是自己填入版本信息(要符合规范)，有关版本规范可以参考[语义化版本 2.0.0](https://semver.org/lang/zh-CN/)

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/vue-admin/20190625154925.png)

确认版本后，会自动修改 `package.json` 的版本信息，这是前端开发者查看当前项目版本的途径之一。之后就是询问是否要 commit，是否打 tag，是否 push 到远程仓库，可以一路回车。最后一项如果是公司项目，不需要上传到 npm 仓库，选 NO 即可，即使选了 Yes，但只要你在 **package.json** 中配置 **private** 为 **true**，也不会上传。如何查看发布成功? 可以输入 `git tag -l` 查看本地 tag，也可以 `git ls-remote --tags origin` 查看远程 tag

但是这只是一个 tag，没有详细信息，**更新日志**还是需要开发者手动编写

这个时候就需要用到自动生成 CHANGELOG 插件了

## 自动生成 CHANGELOG

安装

```sh
npm i conventional-changelog-cli --save-dev
```

配置 package.json

```json
"changelog": "conventional-changelog -p angular -i CHANGELOG.md -s -r 0"
```

上面 changelog 命令不会覆盖以前的 `CHANGELOG`，只会在 **CHANGELOG.md** 的**头部**加上自从上次发布以来的变动。

```bash
npm run changelog
```

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190130210836.png)

生成 CHANGELOG.md 文件

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190130195243.png)

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/vue-admin/20190710231129.png)

在 **CHANGELOG.md** 的头部加上自从上次**发布版本**以来的变动。显示 feat、bug、doc 等类型

生成的 CHANGELOG 不会按 commit 上传的时间顺序排序，有人给官方提交了 issues，等待官方解决。。👉[传送门](https://github.com/conventional-changelog/conventional-changelog/issues/373)

可以打开 GitHub/GitLub 仓库，将更新日志生成的内容对应的填入 tag 版本中就可以了

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/vue-admin/20190712043249.png)

## 深入 conventional-changelog 源码

这里先展示最终生成的 CHANGELOG 效果图

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/vue-admin/20190710133722.png)

起源背景如下：

> 测试：”需要在 CHANGELOG 中生成 commit 对应的提交人，这样问题定位就知道去找谁负责”
>
> 我：“😎 这个简单~配置下参数就可以了”

我以为只要配置一下参数，毕竟 CHANGELOG 插件是支持自定义参数的，当我看到文档**懵逼**了，没有提供这两个参数，显示提交人和提交人邮箱，咋办，翻 issue。。。这个需求应该有人提 😏，根据 [#351](https://github.com/conventional-changelog/conventional-changelog/issues/351) 知道了使用自定义配置需要从外部传入自定义配置文件

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/vue-admin/20190629145125.png)

新建一个配置文件，在命令后面带上 -n <文件路径>

```json
{
  "scripts": {
    "changelog": "conventional-changelog -p angular -i CHANGELOG.md -s -r 0 -n ./changelog-option/index.js"
  }
}
```

解决了使用自定义配置问题，如何增加 CHANGELOG 生成更多的提交信息，还是翻 issue... [#349](https://github.com/conventional-changelog/conventional-changelog/issues/349)

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/vue-admin/20190629145434.png)

结合起来大概是这样，试试效果：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/vue-admin/20190629145555.png)

format 里面有 authorName 和 authorEmail 字段，运行 `npm run changelog` 后依旧没有效果 😖 只能翻源码了

## VSCode 调试 node_modules 第三方插件

配置 **launch.json**，调试 **conventional-changelog-cli** 插件下的 **cli.js** 文件，这里保持和 package 中的 changelog 一致，传入参数 `"-p", "angular", "-i", "CHANGELOG.md", "-s", "-r", "0", "-n", "./changelog-option/index.js"`

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "cwd": "${workspaceFolder}",
      "program": "${workspaceFolder}\\node_modules\\conventional-changelog-cli\\cli.js",
      "args": [
        "-p",
        "angular",
        "-i",
        "CHANGELOG.md",
        "-s",
        "-r",
        "0",
        "-n",
        "./changelog-option/index.js"
      ]
    }
  ]
}
```

全局搜索传入的配置项字段：**gitRawCommitsOpts**，打个断点调试一下

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/vue-admin/20190712012615.png)

发现作者是将用户传入的 **gitRawCommitsOpts** 做个合并，最后传入到 **conventionalChangelog** 方法中去执行，继续查看该方法

插件由 `conventional-changelog-cli` 跳转到 `conventional-changelog` 下

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/vue-admin/20190712094254.png)

判断用户是否有传入 **preset** 预设参数，调试的时候使用了 **angular** 的配置 (**-p angular**)

这里 return 了一个 `conventionalChangelogCore` 方法，依旧点击跳转

## conventional-changelog-core

作为插件的核心库，最核心的地方就是 **mergeConfig** 这个方法

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/vue-admin/20190712023828.png)

在 core 中将配置传入 **mergeConfig** 中进行合并

**format** 默认只有 **hash**、**gitTags** 和 **committerDate**，没有需要的 **authorName** 和 **authorEmail**，fromTag 是我们最后一次提交的 tag，**merges: false** 表示在 CHANGELOG 中**不会**生成 merges 分支的信息

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/vue-admin/20190712014400.png)

**mergeConfig** 是一个 **Promise**，求值后将配置传给了 **gitRawCommits**，涉及了 **pipe** 导流来传递数据

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/vue-admin/20190712025551.png)

将 `gitRawCommitsOpts` 配置传入 `gitRawCommits` 方法中，继续点进去看，又会跳转到 `git-raw-commits` 插件

## git-raw-commits

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/vue-admin/20190629153050.png)

通过 `git-raw-commits` 的 GitHub 官网 [README](https://github.com/conventional-changelog/conventional-changelog/blob/master/packages/git-raw-commits/README.md)，发现这个插件是从本地 git 仓库中获取提交记录，之前传入的 **format** 就是 git-log 中的参数

```md
hash：哈希值

gitTags：标签

committerDate：提交时间

authorName：提交人

authorEmail：邮箱
```

更多 git-log 细节可以去看 **git** [官方文档](https://git-scm.com/docs/git-log)，也可以在 git log 后面带上我们配置的 format 进行格式化

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/vue-admin/20190710232529.png)

直接使用 git log 查看 git 提交记录中，也有 Author 的 name 和 email 字段

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/vue-admin/20190710232445.png)

看到这里，确定了 [git-raw-commits](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/git-raw-commits) 插件只是从 git 中读取数据并格式化，那么肯定有个插件是将这些数据写成 CHANGELOG.md 文件，于是继续翻 `conventional-changelog-core` ，发现 `conventional-changelog-writer`，这个插件先不看，还记得之前使用的是 `angular` 的预设吗，可以去看 `conventional-changelog-angular` 插件

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/vue-admin/20190629155258.png)

好的项目从文件名就知道各个文件是做什么的，将不同插件的配置单独拆分，这点值得学习

## conventional-changelog-angular

`writer-opts.js` 就是写入 CHANGELOG 的配置，最后会将配置传给 `conventional-changelog-writer`，这里来匹配我们之前 commit message 的信息

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/vue-admin/20190629155450.png)

其实在 writer 之前，还有一个 [**parser**](https://github.com/conventional-changelog-archived-repos/conventional-commits-parser) 插件，用来解析我们提交的信息，这个 changelog 里面到底是依赖了多少插件。。。

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/vue-admin/20190703095448.png)

在用 commit **规范化**插件提交的时候，就需要填写相应的信息，这里打印一下 commit 信息

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/vue-admin/20190703095255.png)

发现的确有 **authorName** 和 **authorEmail** 这两个字段存在，而且 `conventional-changelog-writer`这个插件就是将这样的对象生成 CHANGELOG.md，通过插件的 [README](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-writer) 可以知道

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/vue-admin/20190710232625.png)

现在字段也有了，但是为什么不会显示呢，继续看源码，这里用到了 `templates/commit.hbs` 文件

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/vue-admin/20190629160014.png)

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/vue-admin/20190629155938.png)

看到这里也就差不多了，template 文件夹下就是生成 CHANGELOG 的模版文件，查了下 hbs(**Handlebars**) 是一个模版引擎。不过在 commit.hbs 中却并**没有**发现有用到这两个字段，想想也是，这两个字段是我配置 `gitRawCommitsOpts` 传入的

说明 `angular` 预设一开始就没想过要生成 authorName 和 email。。。这就尴尬了，只能自己加上了，照葫芦画瓢，修改 commit.hbs 文件，在生成 commit 的 hash 值后面加上

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/vue-admin/20190629160929.png)

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/vue-admin/20190629161112.png)

成功啦~~！！！🎉🎉🎉

让我激动一下，但是转念一想 🤔，这种直接修改 **node_modules** 里插件的源码，根本没法分享啊，如果同事要用，不可能也这样去修改 `conventional-changelog-angular` 的源码吧，而且只要重新 npm install 安装依赖后，之前修改了也会消失

作者已经在 `conventional-changelog-cli` 中提供了自定义的[例子](https://github.com/conventional-changelog/conventional-changelog-angular/blob/master/index.js)

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/vue-admin/20190629162025.png)

不过这个地址已经被**废弃**了，新地址就是我们之前使用的 angular 预设 [conventional-changelog-angular](https://github.com/conventional-changelog/conventional-changelog/blob/master/packages/conventional-changelog-angular/README.md) ，官方也有提供其他预设模版，如：`atom`、`eslint`、`jQuery`

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/vue-admin/20190710232827.png)

这种在**一个** package 中管理**多个**项目是用了 [lerna](https://lerna.js.org/)，一个用于管理拥有多个包的 JavaScript 项目的工具。是一种比较流行的 `monorepo` 项目管理模式，React、Vue、Babel 都有用这种模式来管理。

前面也分析了 **conventional-changelog-angular** ，直接 clone 源码来改，创建 `git-raw-commit.js`

```js
module.exports = {
  format:
    "%B%n-hash-%n%H%n-gitTags-%n%d%n-committerDate-%n%ci%n-authorName-%n%an%n-authorEmail-%n%ae"
};
```

在 index.js 中传入并使用

```js
"use strict";
const Q = require(`q`);
const conventionalChangelog = require(`./conventional-changelog`);
const parserOpts = require(`./parser-opts`);
const recommendedBumpOpts = require(`./conventional-recommended-bump`);
const writerOpts = require(`./writer-opts`);
// 格式化 git log 信息
const gitRawCommitsOpts = require("./git-raw-commit");

module.exports = Q.all([
  conventionalChangelog,
  parserOpts,
  recommendedBumpOpts,
  writerOpts,
  gitRawCommitsOpts
]).spread(
  (
    conventionalChangelog,
    parserOpts,
    recommendedBumpOpts,
    writerOpts,
    gitRawCommitsOpts
  ) => {
    return {
      conventionalChangelog,
      parserOpts,
      recommendedBumpOpts,
      writerOpts,
      gitRawCommitsOpts // 传入
    };
  }
);
```

之后修改 commit.hbs，显示 authorName 和 authorEmail

> 这里有个**小坑**！！我用 **VSCode** 修改完直接保存后，如果有**多次提交**，不会折行，会挤在同一行，估计是保存的**格式不对**，也许是我 VSCode 安装了比较多的格式化扩展，建议用 **Notepad++** 去修改 **commit.hbs** 文件

## 替换 issues 路径

公司使用 **redmine** 来管理项目，测试人员会在 **redmine** 中提 **issues**，这里生成完 **CHANGELOG** 要批量替换 **issues** 的地址，将 **GitLab** 地址前缀替换成 **redmine**，网上说用 **replace** 库，可我发现这个库上传 npm 是三年前，并且已经**不维护了**，使用后也**报错**。。。于是写了一个简单的字符串替换文件，生成完 CHANGELOG 后运行该文件即可替换，支持传递参数（参考 `conventional-changelog` 源码，使用了 [minimist](https://www.npmjs.com/package/minimist) 插件来获取传递的参数）

```json
{
  "scripts": {
    "changeissueurl": "node ./changelog-option/replace.js https://gitlba.com/issues/ https://redmine.example.com/issues"
  }
}
```

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/vue-admin/20190712111034.png)

再把这两个脚本集成到一个 version 中，之后要发版本，生成 CHANGELOG 只要运行 **npm run version** 即可

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/vue-admin/20190629163807.png)

## 发布到 NPM 仓库

这样还是太**麻烦**，对于使用者来说不需要了解太多，而且文件存在本地，不方便**迁移**，🤔 能不能像 angular 一样直接做成预设模版，让 `conventional-changelog` 直接去用我们自定义的预设模版就行了，为了验证，还是得翻源码，之前有调试到，但是没细看

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/vue-admin/20190712033631.png)

在 `conventional-changelog-preset-loader` 中

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/vue-admin/20190712033801.png)

预设只要按照 `${scope}conventional-changelog-${name}` 这种命名规范就可以被 require，**scope** 是因为 npm 仓库不能同名，可以加上自己的用户名作为作用域，例如：`@zsh/conventional-changelog-angular`，之后在配置中改为 `-p @zsh/angular` 就可以使用自定义的预设了

感谢 `conventional-changelog` ！不多说，起一个 npm 项目，将之前的文件都放进去，再次对模版进行优化。

TODO：

- [x] authorName 和 authorEmail 不一定是必需的，可配置
- [x] issues 替换地址更为简便
- [x] 给 Title 新增 **emojis** 🚀

因为这里获取的 commit 是字符串格式，可以在 commit.hbs 模版中设置一个值，之后再根据用户的配置来进行替换，这样 authorName 和 authorEmail 就不是必需的，默认禁用，需要手动设置开启

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/vue-admin/20190712034749.png)

issues 和 emojis 比较简单就不说了，相信大家如果认真的看到这里，完全可以做你自己的预设~

由于是第一次发布到 npm 上，没什么经验，效果不好还望见谅 🏃‍♂️，npm 地址：[conventional-changelog-custom-config](https://www.npmjs.com/package/conventional-changelog-custom-config)

**使用**

```sh
npm install conventional-changelog-custom-config --save-dev
```

通过在 package.json 中配置参数的形式来定制 CHANGELOG，**不填配置**则会按照 **angular** 的预设模版生成 CHANGELOG，具体配置如下：

```json
{
  "scripts": {
    "changelog": "conventional-changelog -p custom-config -i CHANGELOG.md -s -r 0"
  },
  "changelog": {
    "bugsUrl": "https://redmine.example.com/issues/",
    "emojis": true,
    "authorName": true,
    "authorEmail": true
  }
}
```

**bugsUrl**

Type: `string` Default: `false`

当你需要将 issues URL 替换成其他 URL 时，使用该参数，例如使用 **redmine** 管理项目, `bugsUrl: 'https://redmine.example.com/issues/'`

如果不填 `bugsUrl` 则会根据 **package.json** 中的 `repository` 或 `repository.url` 来作为 issues URL

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/example"
  }
}
```

如果 `repository.url` 也没有，则会获取 git 中的**远程仓库路径**来作为前缀，[conventional-changelog-core 源码地址](https://github.com/conventional-changelog/conventional-changelog/blob/791e8d5b35d7df467cdf391992fe6b4e000a3f67/packages/conventional-changelog-core/lib/merge-config.js#L149-L154)

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/vue-admin/20190711225233.png)

如果你使用了第三方的协作系统（例如 **bitbucket**）， 推荐你使用这个插件 [conventional-changelog-angular-bitbucket](https://github.com/uglow/conventional-changelog-angular-bitbucket)

**emojis**

Type: `boolean` Default: `false`，emojis types 参考 [gitmoji](https://gitmoji.carloscuesta.me/)

| Commit Type | Title                    | Description                                                                                                 | Emojis |
| :---------- | :----------------------- | :---------------------------------------------------------------------------------------------------------- | :----- |
| `feat`      | Features                 | A new feature                                                                                               | ✨     |
| `fix`       | Bug Fixes                | A bug Fix                                                                                                   | 🐛     |
| `docs`      | Documentation            | Documentation only changes                                                                                  | 📝     |
| `style`     | Styles                   | Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)      | 💄     |
| `refactor`  | Code Refactoring         | A code change that neither fixes a bug nor adds a feature                                                   | ♻️     |
| `perf`      | Performance Improvements | A code change that improves performance                                                                     | ⚡️    |
| `test`      | Tests                    | Adding missing tests or correcting existing tests                                                           | ✅     |
| `build`     | Build                    | Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)         | 👷     |
| `ci`        | Continuous Integrations  | Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs) | 🔧     |
| `chore`     | Chores                   | Other changes that don't modify src or test files                                                           | 🎫     |
| `revert`    | Reverts                  | Reverts a previous commit                                                                                   | ⏪     |

**authorName**

Type: `boolean` Default: `false`

在 CHANGELOG 中生成用户名

**authorEmail**

Type: `boolean` Default: `false`

在 CHANGELOG 中生成邮箱

更多细节可以看 [README](https://github.com/ITxiaohao/conventional-changelog-custom-config)，码字不易，开源不易，觉得不错给个 ⭐️ 吧~😝 感谢感谢~

## 总结

总结这一整套折腾过程，代码风格规范 ----> commit 规范 ----> version 规范 ----> 生成 CHANGELOG ---> 自定义 CHANGELOG ---> NPM 发布预设

前四个步骤看看 README 就直接上手，没什么难点，自定义 CHANGELOG 稍微麻烦些，对外开放 `conventional-changelog-cli` 收集用户配置，如 -p angular -s -r 0 -n config.js，如果有预设模版，比如 angular，就将 `conventional-changelog-angular` 中的配置传入 `conventional-changelog-core` 中 merge，之后通过 `git-raw-commits` 从本地 git 中获取 log 数据，`conventional-changelog-parser` 来解析用户提交的信息，将两种数据整合成一个对象，传入 `conventional-changelog-writer` 生成 CHANGELOG.md 文件

刚开始安装插件比较多，一旦配完就是一两个命令的事，感兴趣的也参照我这篇文章，自己写一套模版用， npm 上也有很多预设模版可以用，axetroy 大佬写了个 [VSCode 扩展](https://github.com/axetroy/vscode-changelog-generator) 列入了 conventional-changelog 官方推荐 ，[文章位置](http://axetroy.xyz/#/post/186)

**本文篇幅较长，难免会有错误和不足的地方，希望大佬们留言指正，以免误人**

## 参考文档

[git commit 、CHANGELOG 和版本发布的标准自动化](http://imziv.com/blog/article/read.htm?id=91)

[Commit message 和 Change log 编写指南](https://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)

[conventional-changelog-core](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-core)

[git-log](https://git-scm.com/docs/git-log)

[package.json](https://docs.npmjs.com/files/package.json)

[vue-element-admin](https://panjiachen.gitee.io/vue-element-admin-site/zh/guide/advanced/git-hook.html#husky)

[VSCode Debugging](https://code.visualstudio.com/docs/editor/debugging#_platformspecific-properties)
