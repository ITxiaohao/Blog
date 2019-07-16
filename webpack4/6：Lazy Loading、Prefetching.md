---
title: "六：Lazy Loading、Prefetching"
date: 2019-03-20
permalink: "webpack4-lazyLoading-prefetching"
---

[demo6 源码地址](https://github.com/ITxiaohao/webpack4-learn/tree/master/demo06)

在 demo5 的基础上修改 index.js 文件，并删除了多余的 js 文件

```js
document.addEventListener("click", function() {
  import(/* webpackChunkName: 'use-lodash'*/ "lodash").then(function(_) {
    console.log(_.join(["3", "4"]));
  });
});
```

这段代码表示的是，当点击页面的时候，异步加载 lodash 并输出内容，打包后打开 index.html 文件，演示如下：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/%E6%87%92%E5%8A%A0%E8%BD%BD.gif)

第一次进入页面的时候，并没有加载 lodash 和 use-lodash，当我点击网页的时候，浏览器再去加载，并且控制台输出内容，这就是代码**懒加载**，如果有用过 **vue-router** 的朋友应该会知道**路由懒加载**，并且官方也推荐使用懒加载的写法，就是为了结合 webpack，下图是 vue-cli3 生成的项目

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190321110641.png)

其实懒加载就是通过 **import** 去异步的加载一个模块，具体什么时候加载，这个要根据业务来写，比如弹窗组件，模态框组件等等，都是点击按钮后再出现。

懒加载能加快网页的加载速度，如果你把详情页、弹窗等页面全部打包到一个 js 文件中，用户如果只是访问首页，只需要首页的代码，不需要其他页面的代码，加入多余的代码只会使加载时间变长，所以我们可以对路由进行懒加载，只有当用户访问到对应路由的时候，再去加载对应模块

:::tip
懒加载并不是 webpack 里的概念，而是 ES6 中的 **import** 语法，webpack 只是能够识别 import 语法，能进行代码分割而已。

import 后面返回的是一个 then，说明这是一个 **promise** 类型，一些低端的浏览器**不支持** promise，比如 **IE** ，如果要使用这种异步的代码，就要使用 **babel** 以及 **babel-polyfill** 来做转换，因为我使用的是 73 版本的 **chrome** 浏览器，对 ES6 语法是支持的，所以我并没有安装 babel 也能使用
:::

更改 index.js 文件

```js
document.addEventListener("click", function() {
  const element = document.createElement("div");
  element.innerHTML = "Hello World";
  document.body.appendChild(element);
});
```

重新打包，并打开 index.html ，打开浏览器控制台，按 `ctrl + shift + p` ，输入 `coverage`

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190321121513.png)

就能看到当前页面加载的 js 代码未使用率，红色区域表示未被使用的代码段

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190428153202.png)

演示：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/coverage1.gif)

打开 `coverage` 如果没出现分析的文件，记得刷新一下

这里一开始红色区域的代码未被使用，当我点击了页面后，变成绿色，页面出现了 `Hello World`，说明代码被使用了

页面刚加载的时候，异步的代码根本就不会执行，但是我们却把它下载下来，实际上就会浪费页面执行性能，webpack 就希望像这样交互的功能，应该把它放到一个异步加载的模块去写

新建一个 click.js 文件

```js
function handleClick() {
  const element = document.createElement("div");
  element.innerHTML = "Dell Lee";
  document.body.appendChild(element);
}

export default handleClick;
```

并且将 index.js 文件改为异步的加载模块：

```js
document.addEventListener("click", () => {
  import("./click.js").then(({ default: func }) => {
    func();
  });
});
```

重新打包，使用 **coverage** 分析

演示：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/coverage2.gif)

当加载页面的时候，没有加载业务逻辑，当点击网页的时候，才会加载 1.js 模块，也就是我们在 index.js 中异步引入的 click.js

这么去写代码，才是使页面加载最快的一种方式，写高性能前端代码的时候，**不关是考虑缓存，还要考虑代码使用率**

所以 webpack 在打包过程中，是希望我们多写这种异步的代码，才能提升网站的性能，这也是为什么 webpack 的 splitChunks 中的 chunks 默认是 async，异步的

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190321143146.png)

异步能提高你网页打开的性能，而同步代码是增加一个缓存，对性能的提升是非常有限的，因为缓存一般是**第二次打开网页或者刷新页面**的时候，缓存很有用，但是网页的性能一般是用户**第一次打开网页**，看首屏的时候。

当然，这也会出现另一个问题，就是当用户点击的时候，才去加载业务模块，如果业务模块比较大的时候，用户点击后并没有立马看到效果，而是要等待几秒，这样体验上也不好，怎么去解决这种问题

一：如果访问首页的时候，不需要加载详情页的逻辑，等用户首页加载完了以后，页面展示出来了，页面的带宽被释放出来了，网络空闲了，再「偷偷」的去加载详情页的内容，而不是等用户去点击的时候再去加载

这个解决方案就是依赖 webpack 的 [Prefetching/Preloading](https://webpack.js.org/guides/code-splitting#prefetchingpreloading-modules) 特性

修改 index.js

```js
document.addEventListener("click", () => {
  import(/* webpackPrefetch: true */ "./click.js").then(({ default: func }) => {
    func();
  });
});
```

`webpackPrefetch: true` 会等你主要的 JS 都加载完了之后，网络带宽空闲的时候，它就会预先帮你加载好

重新打包后刷新页面，注意看 **Network**

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/prefetch.gif)

当网页打开的时候，main.bundle.js 被加载完了，网络空闲了，就会预先加载 1.js 耗时 14ms，等我去点击页面的时候，Network 又多了一个 1.js，耗时 2ms，这是因为第一次加载完了 1.js，被浏览器给缓存起来了，等我点击的时候，浏览器直接从缓存中取，响应速度非常快

这里我们使用的是 `webpackPrefetch`，还有一种是 `webpackPreload`

:::tip 区别：
与 prefetch 相比，Preload 指令有很多**不同之处**：

**Prefetch** 会等待核心代码加载完之后，有空闲之后再去加载。Preload 会和核心的代码并行加载，还是不推荐
:::

:::tip 总结：

针对优化，不仅仅是局限于缓存，缓存能带来的代码性能提升是非常有限的，而是如何让代码的**使用率**最高，有一些交互后才用的代码，可以写到异步组件里面去，通过懒加载的形式，去把代码逻辑加载进来，这样会使得页面访问速度变的更快，如果你觉得懒加载会影响用户体验，可以使用 Prefetch 这种方式来预加载，不过在某些游览器**不兼容**，会有兼容性的问题，重点不是在 Prefetch 怎么去用，而是在做前端代码性能优化的时候，**缓存不是最重要的点，最重要的是代码使用的覆盖率上(coverage)**

:::
