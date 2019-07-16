---
title: "二十二：编写 loader"
date: 2019-03-20
permalink: "webpack4-loader"
---

[demo22 源码地址](https://github.com/ITxiaohao/webpack4-learn/tree/master/demo22)

新建文件夹，`npm init -y`，`npm i webpack webpack-cli -D`，新建 src/index.js，写入 `console.log('hello world')`

新建 `loaders/replaceLoader.js` 文件

```js
module.exports = function(source) {
  return source.replace("world", "loader");
};
```

source 参数就是我们的源代码，这里是将源码中的 world 替换成 loader

新建 `webpack.config.js`

```js
const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    main: "./src/index.js"
  },
  module: {
    rules: [
      {
        test: /.js/,
        use: [path.resolve(__dirname, "./loaders/replaceLoader.js")] // 引入自定义 loader
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
  }
};
```

目录结构：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190325165912.png)

打包后打开 dist/main.js 文件，在最底部可以看到 world 已经被改为了 loader，一个最简单的 loader 就写完了

添加 optiions 属性

```js
const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    main: "./src/index.js"
  },
  module: {
    rules: [
      {
        test: /.js/,
        use: [
          {
            loader: path.resolve(__dirname, "./loaders/replaceLoader.js"),
            options: {
              name: "xh"
            }
          }
        ]
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
  }
};
```

修改 replaceLoader.js 文件，保存后打包，输出看看效果

```js
module.exports = function(source) {
  console.log(this.query);
  return source.replace("world", this.query.name);
};
```

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190325170458.png)

打包后生成的文件也改为了 options 中定义的 name

更多的配置见官网 [API](https://webpack.js.org/api/loaders/#examples)，找到 Loader Interface，里面有个 this.query

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190325171141.png)

如果你的 options 不是一个对象，而是按字符串形式写的话，可能会有一些问题，这里官方推荐使用 [loader-utils](https://github.com/webpack/loader-utils#getoptions) 来获取 options 中的内容

安装 `npm i loader-utils -D`，修改 replaceLoader.js

```js
const loaderUtils = require("loader-utils");

module.exports = function(source) {
  const options = loaderUtils.getOptions(this);
  console.log(options);
  return source.replace("world", options.name);
};
```

`console.log(options)` 与 `console.log(this.query)` 输出内容一致

如果你想传递额外的信息出去，return 就不好用了，官网给我们提供了 [this.callback](https://webpack.js.org/api/loaders/#thiscallback) API，用法如下

```js
this.callback(
  err: Error | null,
  content: string | Buffer,
  sourceMap?: SourceMap,
  meta?: any
)
```

修改 replaceLoader.js

```js
const loaderUtils = require("loader-utils");

module.exports = function(source) {
  const options = loaderUtils.getOptions(this);
  const result = source.replace("world", options.name);

  this.callback(null, result);
};
```

目前没有用到 sourceMap(必须是此模块可解析的源映射)、meta(可以是任何内容(例如一些元数据)) 这两个可选参数，只将 result 返回回去，保存重新打包后，效果和 return 是一样的

如果在 loader 中写异步代码，会怎么样

```js
const loaderUtils = require("loader-utils");

module.exports = function(source) {
  const options = loaderUtils.getOptions(this);

  setTimeout(() => {
    const result = source.replace("world", options.name);
    return result;
  }, 1000);
};
```

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190326093218.png)

报错 loader 没有返回，这里使用 [this.async](https://webpack.js.org/api/loaders/#thisasync) 来写异步代码

```js {6}
const loaderUtils = require("loader-utils");

module.exports = function(source) {
  const options = loaderUtils.getOptions(this);

  const callback = this.async();

  setTimeout(() => {
    const result = source.replace("world", options.name);
    callback(null, result);
  }, 1000);
};
```

模拟一个同步 loader 和一个异步 loader

新建一个 `replaceLoaderAsync.js` 文件，将之前写的异步代码放入，修改 `replaceLoader.js` 为同步代码

```js
// replaceLoaderAsync.js

const loaderUtils = require("loader-utils");
module.exports = function(source) {
  const options = loaderUtils.getOptions(this);
  const callback = this.async();
  setTimeout(() => {
    const result = source.replace("world", options.name);
    callback(null, result);
  }, 1000);
};

// replaceLoader.js
module.exports = function(source) {
  return source.replace("xh", "world");
};
```

修改 `webpack.config.js`，loader 的执行顺序是从下到上，先执行异步代码，将 world 改为 xh，再执行同步代码，将 xh 改为 world

```js
module: {
  rules: [
    {
      test: /.js/,
      use: [
        {
          loader: path.resolve(__dirname, "./loaders/replaceLoader.js")
        },
        {
          loader: path.resolve(__dirname, "./loaders/replaceLoaderAsync.js"),
          options: {
            name: "xh"
          }
        }
      ]
    }
  ];
}
```

保存后打包，在 mian.js 中可以看到已经改为了 `hello world`，使用多个 loader 也完成了

如果有多个自定义 loader，每次都通过 `path.resolve(__dirname, xxx)` 这种方式去写，有没有更好的方法？

使用 `resolveLoader`，定义 modules，当你使用 loader 的时候，会先去 `node_modules` 中去找，如果没找到就会去 `./loaders` 中找

```js {8,9,10}
const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    main: "./src/index.js"
  },
  resolveLoader: {
    modules: ["node_modules", "./loaders"]
  },
  module: {
    rules: [
      {
        test: /.js/,
        use: [
          {
            loader: "replaceLoader.js"
          },
          {
            loader: "replaceLoaderAsync.js",
            options: {
              name: "xh"
            }
          }
        ]
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
  }
};
```
