---
title: '一：搭建项目并打包 JS 文件'
date: 2019-03-20
permalink: 'webpack4-pack-js'
---

[demo1 源码地址](https://github.com/ITxiaohao/webpack4-learn/tree/master/demo01)

创建空文件夹，通过运行以下命令初始化 **package.json**

```bash
npm init -y
```

:::tip
npm init  用来初始化生成一个新的  package.json  文件。它会向用户提问一系列问题，如果你觉得不用修改默认配置，一路回车就可以了。
如果使用了 -y（代表 yes），则跳过提问阶段，直接生成一个新的  package.json  文件。
:::

引入 webpack4：

```bash
npm i webpack --save-dev
```

还需要  webpack-cli ，作为一个单独的包引入，如果不装 webpack-cli 是无法在命令行里使用 webpack 的

```bash
npm i webpack-cli --save-dev
```

此项目 webpack 版本如下：

```json
"webpack": "^4.29.6",
"webpack-cli": "^3.2.3"
```

现在打开  package.json  并添加一个  build(构建) 脚本：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190303164215.png)

尝试运行看看会发生什么：

```bash
npm run build
```

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190303164344.png)

在 webpack4 以前的版本中，必须在名为 webpack.config.js 的配置文件中 通过  entry  属性定义 entry point(入口点)，就像这样：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190303164413.png)

从 webpack4 开始，不再必须定义 entry point(入口点) ：它将默认为 **./src/index.js**

测试这个新功能，首先创建 ./src/index.js 文件

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190303164918.png)

再运行 `npm run build` 试试

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190303165055.png)

打包成功，并在当前的根目录中得到打包后的文件夹，也就是 **dist** 文件夹

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190303165232.png)

它将查找 **./src/index.js** 作为默认入口点。 而且，它会在 **./dist/main.js** 中输出模块包，目前代码量小，可以格式化看效果

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190305093607.png)

至此，打包 JS 结束

参考：[webpack 官网入门](https://webpack.js.org/guides/getting-started)
