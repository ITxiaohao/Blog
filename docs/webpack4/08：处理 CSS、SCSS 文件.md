---
title: '八：处理 CSS/SCSS 文件'
date: 2019-03-20
tags:
  - Webpack
categories:
  - Webpack
permalink: 'webpack4-css-scss'
---

[demo8 源码地址](https://github.com/ITxiaohao/webpack4-learn/tree/master/demo08)

#### (一) 准备工作

CSS 在 HTML 中的常用引入方法有 `<link>` 标签和 `<style>` 标签两种，所以这次就是结合 webpack 特点实现以下功能：

- 将 css 通过 link 标签引入
- 将 css 放在 style 标签里

下图展示了这次的目录代码结构：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307160530.png)

这次我们需要用到 `css-loader`，`style-loader` 等 loader，跟 babel 一样，webpack 不知道将 CSS 提取到文件中。需要使用 loader 来加载对应的文件

css-loader:负责解析 CSS 代码，主要是为了处理 CSS 中的依赖，例如 @import 和 url() 等引用外部文件的声明

style-loader 会将 css-loader 解析的结果转变成 JS 代码，运行时**动态插入 style 标签**来让 CSS 代码生效。

#### (二) 安装依赖

```bash
npm i css-loader style-loader --save-dev
```

`package.json` 如下：

```json
{
  "scripts": {
    "dev": "webpack --mode development",
    "build": "webpack --mode production"
  },
  "devDependencies": {
    "clean-webpack-plugin": "^2.0.0",
    "css-loader": "^2.1.0",
    "html-loader": "^0.5.5",
    "html-webpack-plugin": "^3.2.0",
    "mini-css-extract-plugin": "^0.5.0",
    "style-loader": "^0.23.1",
    "webpack": "^4.29.6",
    "webpack-cli": "^3.2.3"
  }
}
```

更改配置文件

```js {6}
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/, // 针对 .css 后缀的文件设置 loader
        use: ['style-loader', 'css-loader']
      }
    ]
  }
}
```

配置 module 中的 rules 属性，和配置 babel 一样，首先在 test 中使用正则来过滤 `.css` 文件，对 `.css` 文件使用 loader，`'style-loader', 'css-loader'`

在 base.css 中写入样式

```css
*,
body {
  margin: 0;
  padding: 0;
}
html {
  background: red;
}
```

**并在 app.js 中引入 base.css**

```js
import style from './css/base.css'
```

配置文件完整代码:

```js (20)
const path = require('path')

const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin') // 引入插件

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
        test: /\.css$/, // 针对 .css 后缀的文件设置 loader
        use: ['style-loader', 'css-loader'] // 使用 loader
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
    })
  ]
}
```

项目打包，查看 dist 文件夹

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307112924.png)

发现并**没有生成 CSS 文件**，但是打开 index.html 是有样式的

原因是：`style-loader`, `css-loader` 两个 loader 的处理后，CSS 代码会转变为 JS，和 index.js 一起打包

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307144121.png)

可以发现是通过 `<style>` 标签注入的 css

如果需要单独把 CSS 文件分离出来，我们需要使用 **mini-css-extract-plugin** 插件。

之前是使用 `extract-text-webpack-plugin` 插件，此插件与 webpack4 不太匹配，现在使用 `mini-css-extract-plugin`

:::warning 注意!!!
确保将 webpack 更新到 **4.2.0** 版及以上。否则 **mini-css-extract-plugin** 将无效！

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190320112208.png)

目前还**不支持热更新**，也就是在开发环境下更改了 css，需要手动的刷新页面才会看到效果，目前这个插件一般在生产环境中使用，开发环境下还是使用 'style-loader'，具体见[官网配置](https://webpack.js.org/plugins/mini-css-extract-plugin/)
:::

```bash
npm i mini-css-extract-plugin --save-dev
```

更改配置文件：

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/, // 针对 .css 后缀的文件设置 loader
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
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ]
}
```

完整代码：

```js
const path = require('path')

const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 将 css 单独打包成文件

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
        test: /\.css$/, // 针对 .css 后缀的文件设置 loader
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
    })
  ]
}
```

这样只是生成了单独的 css 文件，但是并没有压缩，引入 [optimize-css-assets-webpack-plugin](https://github.com/NMFR/optimize-css-assets-webpack-plugin) 插件来实现 css 压缩

```bash
npm install optimize-css-assets-webpack-plugin --save-dev
```

完整代码：

```js
const path = require('path')

const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 将 css 单独打包成文件
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin') // 压缩 css

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
        test: /\.css$/, // 针对 .css 后缀的文件设置 loader
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
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'), //用于优化\最小化 CSS 的 CSS 处理器，默认为 cssnano
      cssProcessorOptions: { safe: true, discardComments: { removeAll: true } }, //传递给 cssProcessor 的选项，默认为{}
      canPrint: true //布尔值，指示插件是否可以将消息打印到控制台，默认为 true
    })
  ]
}
```

再打开 css 文件可以发现已经被压缩了，并且打开 index.html 也是有样式的

#### (三) 处理 SCSS 文件

安装 sass 依赖：

```bash
npm i node-sass sass-loader --save-dev
```

在 src 文件夹下新增 scss 文件夹及 main.scss 文件

main.scss 引入样式

```scss
$bgColor: black !default;
*,
body {
  margin: 0;
  padding: 0;
}
html {
  background-color: $bgColor;
}
```

在 app.js 中引入 main.scss 文件

```js
import './css/base.css'
import './scss/main.scss'
```

修改配置文件

```js
const path = require('path')

const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 将 css 单独打包成文件
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin') // 压缩 css

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
        test: /\.(scss|css)$/, // 针对 .scss 或者 .css 后缀的文件设置 loader
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader',
          'sass-loader' // 使用 sass-loader 将 scss 转为 css
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
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'), //用于优化\最小化 CSS 的 CSS 处理器，默认为 cssnano
      cssProcessorOptions: { safe: true, discardComments: { removeAll: true } }, //传递给 cssProcessor 的选项，默认为{}
      canPrint: true //布尔值，指示插件是否可以将消息打印到控制台，默认为 true
    })
  ]
}
```

:::warning 注意!!!
module.rules.use 数组中，loader 的位置。根据 webpack 规则：**放在最后的 loader 首先被执行，从上往下写的话是下面先执行，从左往右写的话是右边先执行**。

```md
['style-loader', 'css-loader', 'sass-loader']
```

执行顺序为 **sass-loader --> css-loader --> style-loader**

**首先应该利用 sass-loader 将 scss 编译为 css**，剩下的配置和处理 css 文件相同。
:::

打包后再打开 index.html 文件会发现样式已经被 main.scss 中写的覆盖了，处理 scss 成功

#### 为 CSS 加上浏览器前缀

安装 [postcss-loader](https://github.com/postcss/postcss-loader) 和 [autoprefixer](https://github.com/postcss/autoprefixer) 依赖

```bash
npm install postcss-loader autoprefixer --save-dev
```

给 `src/scss/main.css` 中添加这段代码

```css
.example {
  display: grid;
  transition: all 0.5s;
  user-select: none;
  background: linear-gradient(to bottom, white, black);
}
```

有两种方式来配置 **postcss**，第一种是直接写在 webpack.config.js 中

```js
module: {
  rules: [
    {
      test: /\.(sa|sc|c)ss$/, // 针对 .sass .scss 或者 .css 后缀的文件设置 loader
      use: [
        {
          loader: MiniCssExtractPlugin.loader
        },
        'css-loader',
        // 使用 postcss 为 css 加上浏览器前缀
        {
          loader: 'postcss-loader',
          options: {
            plugins: [require('autoprefixer')]
          }
        },
        'sass-loader' // 使用 sass-loader 将 scss 转为 css
      ]
    }
  ]
}
```

打包完之后，查看 dist/app.css 文件

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190309212322.png)

第二种方式，在 webpack.config.js 同级目录下，新建 postcss.config.js 配置文件

```js
module.exports = {
  plugins: [require('autoprefixer')]
}
```

同时在 webpack.config.js 中

```js
module: {
  rules: [
    {
      test: /\.(sa|sc|c)ss$/, // 针对 .sass .scss 或者 .css 后缀的文件设置 loader
      use: [
        {
          loader: MiniCssExtractPlugin.loader
        },
        'css-loader',
        'postcss-loader', // 使用 postcss 为 css 加上浏览器前缀
        'sass-loader' // 使用 sass-loader 将 scss 转为 css
      ]
    }
  ]
}
```

:::tip 提示
由于 module 中的 rules 是倒着执行的，以上的执行顺序是 `sass-loader` -> `postcss-loader` -> `css-loader` -> `MiniCssExtractPlugin.loader`

`postcss-loader` 在 css-loader 和 style-loader 之后使用，但要在其他预处理器加载器之前，例如 sass|less|stylus-loader
:::

#### 补充

在 css-loader 中使用 importLoaders 属性

```js
module: {
  rules: [
    {
      test: /\.(sa|sc|c)ss$/, // 针对 .sass .scss 或者 .css 后缀的文件设置 loader
      use: [
        {
          loader: MiniCssExtractPlugin.loader
        },
        {
          loader: css - loader,
          options: {
            importLoaders: 2
          }
        },
        'postcss-loader', // 使用 postcss 为 css 加上浏览器前缀
        'sass-loader' // 使用 sass-loader 将 scss 转为 css
      ]
    }
  ]
}
```

**importLoaders: 2** 表示：在一个 css 中引入了另一个 css，也会执行之前两个 loader，即 postcss-loader 和 sass-loader

参考：[webpack 官网指南](https://webpack.js.org/guides/asset-management#setup)
