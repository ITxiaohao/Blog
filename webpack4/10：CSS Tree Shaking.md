---
title: '十：CSS Tree Shaking'
date: 2019-03-20
permalink: 'webpack4-css-tree-shaking'
---

[demo10 源码地址](https://github.com/ITxiaohao/webpack4-learn/tree/master/demo10)

CSS Tree Shaking 并不像 JS Tree Shaking 那样方便理解，首先要模拟一个真实的项目环境，来体现 CSS 的 Tree Shaking 的配置和效果。

**此章节源码基于第八节处理 CSS 项目上做修改**

我们首先编写 /src/css/base.css 样式文件，在文件中，我们编写了 3 个样式类。但在代码中，我们只会使用 .box 和 .box--big 这两个类。代码如下所示：

```css
/* base.css */
html {
  background: red;
}

.box {
  height: 200px;
  width: 200px;
  border-radius: 3px;
  background: green;
}

.box--big {
  height: 300px;
  width: 300px;
  border-radius: 5px;
  background: red;
}

.box-small {
  height: 100px;
  width: 100px;
  border-radius: 2px;
  background: yellow;
}
```

按照正常使用习惯，DOM 操作来实现样式的添加和卸载，是一贯技术手段。所以，入口文件 `/src/app.js` 中创建了一个 `<div>` 标签，并且将它的类设为 `.box`

```js
// app.js
import base from './css/base.css'

// 给 app 标签再加一个 div 并且类名为 box
var app = document.getElementById('app')
var div = document.createElement('div')
div.className = 'box'
app.appendChild(div)
```

最后，为了让环境更接近实际环境，我们在 `index.html` 的一个标签，也引用了定义好的 box-big 样式类。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>CSS Tree Shaking</title>
  </head>

  <body>
    <div id="app">
      <div class="box-big"></div>
    </div>
  </body>
</html>
```

[PurifyCSS](https://github.com/purifycss/purifycss)将帮助我们进行 **CSS Tree Shaking** 操作。为了能准确指明要进行 Tree Shaking 的 CSS 文件，还有 **glob-all** （另一个第三方库）。

**glob-all** 的作用就是帮助 PurifyCSS 进行**路径处理**，定位要做 Tree Shaking 的路径文件。

安装依赖：

```bash
npm i glob-all purify-css purifycss-webpack --save-dev
```

更改配置文件：

```js
const path = require('path')

const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 将 css 单独打包成文件

const PurifyCSS = require('purifycss-webpack')
const glob = require('glob-all')

module.exports = {
  entry: {
    app: './src/app.js'
  },
  output: {
    publicPath: './', // js 引用的路径或者 CDN 地址
    path: path.resolve(__dirname, 'dist'), // 打包文件的输出目录
    filename: '[name].bundle.js', // 代码打包后的文件名
    chunkFilename: '[name].js' // 代码拆分后的文件名
  },
  module: {
    rules: [
      {
        test: /\.css$/, // 针对 .scss 或者 .css 后缀的文件设置 loader
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      // 打包输出HTML
      title: '自动生成 HTML',
      minify: {
        // 压缩 HTML 文件
        removeComments: true, // 移除 HTML 中的注释
        collapseWhitespace: true, // 删除空白符与换行符
        minifyCSS: true // 压缩内联 css
      },
      filename: 'index.html', // 生成后的文件名
      template: 'index.html', // 根据此模版生成 HTML 文件
      chunks: ['app'] // entry中的 app 入口才会被打包
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    // 清除无用 css
    new PurifyCSS({
      paths: glob.sync([
        // 要做 CSS Tree Shaking 的路径文件
        path.resolve(__dirname, './*.html'), // 请注意，我们同样需要对 html 文件进行 tree shaking
        path.resolve(__dirname, './src/*.js')
      ])
    })
  ]
}
```

打包完查看 dist/app.css 文件

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190308111209.png)

在 index.html 和 src/app.js 中引用的样式都被打包了，而没有被使用的样式类–box-small，没有被打包进去

:::warning 注意！

平时用 vue 开发，比较常用的是 elementUI，如果这时你用 purifyCss 来过滤无用的 css，当你使用的 element 不多的情况如下图，在 vue-cli3 打包

:::

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190308135219.png)

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190308135241.png)

清除前 194kb，清除后，6.68kb，震惊!!!

将打包后的文件放到 nginx 部署后，打开网页也相当震惊!!!

样式全无，泪目。。。

:::danger 警告!!!
如果项目中有引入第三方 css 库的话，谨慎使用!!!
:::
