---
title: "九：JS Tree Shaking"
date: 2019-03-20
permalink: "webpack4-tree-shaking"
---

[demo9 源码地址](https://github.com/ITxiaohao/webpack4-learn/tree/master/demo09)

什么是 Tree Shaking？

字面意思是摇树，项目中没有使用的代码会在打包的时候丢掉。**JS 的 Tree Shaking 依赖的是 ES6 的模块系统（比如：import 和 export）**

项目目录如下：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307185838.png)

在 util.js 文件中写入测试代码

```js
// util.js
export function a() {
  return 'this is function "a"';
}

export function b() {
  return 'this is function "b"';
}

export function c() {
  return 'this is function "c"';
}
```

在 app.js 中引用 util.js 的 function a() 函数，**按需引入**：

```js
// app.js
import { a } from "./vendor/util";
console.log(a());
```

命令行运行 webpack 打包后，打开打包后生成的 **/dist/app.bundle.js** 文件。查找我们 `a()` 函数输出的字符串，如下图所示：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307191853.png)

如果将查找内容换成 `this is function "c"` 或者 `this is function "b"`, 并没有相关查找结果。说明 JS Tree Shaking 成功。

**1. 如何处理第三方 JS 库?**

对于经常使用的第三方库（例如 jQuery、lodash 等等），如何实现 Tree Shaking ?

下面以 lodash.js 为例，进行介绍。

安装 lodash.js : `npm install lodash --save`

在 app.js 中引用 lodash.js 的一个函数：

```js
// app.js
import { chunk } from "lodash";
console.log(chunk([1, 2, 3], 2));
```

命令行打包。如下图所示，打包后大小是 70kb。显然，只引用了一个函数，不应该这么大。并没有进行 Tree Shaking。

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307193414.png)

开头讲过，js tree shaking 利用的是 ES 的模块系统。而 lodash.js 使用的是 **CommonJS** 而不是 **ES6** 的写法。所以，安装对应的模块系统即可。

安装 lodash.js 的 ES 写法的版本：`npm install lodash-es --save`

修改一下 app.js:

```js
// app.js
import { chunk } from "lodash-es";
console.log(chunk([1, 2, 3], 2));
```

再次打包，打包结果只有 3.5KB（如下图所示）。显然，tree shaking 成功。

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307194006.png)

:::tip 友情提示：
在一些对加载速度敏感的项目中使用第三方库，请注意库的写法是否符合 ES 模板系统规范，以方便 webpack 进行 tree shaking。
:::
