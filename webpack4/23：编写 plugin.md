---
title: '二十三：编写 plugin'
date: 2019-03-20
permalink: 'webpack4-plugin'
---

[demo23 源码地址](https://github.com/ITxiaohao/webpack4-learn/tree/master/demo23)

首先新建一个文件夹，npm 起手式操作一番，具体的在前几节已经说了，不再赘述

在根目录下新建 plugins 文件夹，新建 `copyright-webpack-plugin.js`，一般我们用的都是 `xxx-webpack-plugin`，所以我们命名也按这样来，plugin 的定义是一个类

```js
class CopyrightWebpackPlugin {
  constructor() {
    console.log('插件被使用了')
  }
  apply(compiler) {}
}

module.exports = CopyrightWebpackPlugin
```

在 webpack.config.js 中使用，所以每次使用 plugin 都要使用 **new**，因为本质上 plugin 是一个类

```js
const path = require('path')
const CopyrightWebpackPlugin = require('./plugins/copyright-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.js'
  },
  plugins: [new CopyrightWebpackPlugin()],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  }
}
```

保存后打包，插件被使用了，只不过我们什么都没干

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190326110404.png)

如果我们要传递参数，可以这样

```js
new CopyrightWebpackPlugin({
  name: 'xh'
})
```

同时在 `copyright-webpack-plugin.js` 中接收

```js
class CopyrightWebpackPlugin {
  constructor(options) {
    console.log('插件被使用了')
    console.log('options = ', options)
  }
  apply(compiler) {}
}

module.exports = CopyrightWebpackPlugin
```

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190326110525.png)

我们先把 **constructor** 注释掉，在即将要把打包的结果，**放入 dist 目录之前**的这个时刻，我们来做一些操作

`apply(compiler) {}` compiler 可以看作是 webpack 的实例，具体见官网 [compiler-hooks](https://webpack.js.org/api/compiler-hooks)

hooks 是钩子，像 vue、react 的生命周期一样，找到 `emit` 这个时刻，将打包结果放入 dist 目录前执行，这里是个 `AsyncSeriesHook` 异步方法

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190326111345.png)

```js {7}
class CopyrightWebpackPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'CopyrightWebpackPlugin',
      (compilation, cb) => {
        console.log(11)
        cb()
      }
    )
  }
}

module.exports = CopyrightWebpackPlugin
```

因为 **emit** 是**异步**的，可以通过 **tapAsync** 来写，当要把代码放入到 dist 目录之前，就会触发这个钩子，走到我们定义的函数里，如果你用 **tapAsync** 函数，记得最后要用 **cb()** ，tapAsync 要传递两个参数，第一个参数传递我们定义的插件名称

保存后再次打包，我们写的内容也输出了

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190326112156.png)

**compilation** 这个参数里存放了这次打包的所有内容，可以输出一下 `compilation.assets` 看一下

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190326112425.png)

返回结果是一个对象，`main.js` 是 key，也就是打包后生成的文件名及文件后缀，我们可以来仿照一下

```js
class CopyrightWebpackPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'CopyrightWebpackPlugin',
      (compilation, cb) => {
        // 生成一个 copyright.txt 文件
        compilation.assets['copyright.txt'] = {
          source: function() {
            return 'copyright by xh'
          },
          size: function() {
            return 15 // 上面 source 返回的字符长度
          }
        }
        console.log('compilation.assets = ', compilation.assets)
        cb()
      }
    )
  }
}

module.exports = CopyrightWebpackPlugin
```

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190326112915.png)

在 dist 目录下生成了 `copyright.txt` 文件

之前介绍的是异步钩子，现在使用同步钩子

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190326135159.png)

```js
class CopyrightWebpackPlugin {
  apply(compiler) {
    // 同步钩子
    compiler.hooks.compile.tap('CopyrightWebpackPlugin', compilation => {
      console.log('compile')
    })

    // 异步钩子
    compiler.hooks.emit.tapAsync(
      'CopyrightWebpackPlugin',
      (compilation, cb) => {
        compilation.assets['copyright.txt'] = {
          source: function() {
            return 'copyright by xh'
          },
          size: function() {
            return 15 // 字符长度
          }
        }
        console.log('compilation.assets = ', compilation.assets)
        cb()
      }
    )
  }
}

module.exports = CopyrightWebpackPlugin
```

<!-- `chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=127.0.0.1:9229/d3928cd4-4060-4f99-9bb8-91e6928b6e1a` -->
