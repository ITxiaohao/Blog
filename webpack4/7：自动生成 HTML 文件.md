---
title: "七：自动生成 HTML 文件"
date: 2019-03-20
permalink: "webpack4-generate-html"
---

[demo7 源码地址](https://github.com/ITxiaohao/webpack4-learn/tree/master/demo07)

经过上面几个小节的操作，有没有觉得每次要去更改 index.html 中引入 js 文件很麻烦，一旦打包的名字变更后，也要对应的去修改 index.html 引入的 js 名称，这个时候就要使用一个插件来帮助我们，打包完之后**自动生成 HTML 文件**，**并自动引入打包后的 js 文件**

#### (一) 安装依赖

```bash
npm i html-webpack-plugin html-loader --save-dev
```

package.json 如下：

```json
{
  "scripts": {
    "dev": "webpack --mode development",
    "build": "webpack --mode production"
  },
  "devDependencies": {
    "clean-webpack-plugin": "^2.0.0",
    "html-loader": "^0.5.5",
    "html-webpack-plugin": "^3.2.0",
    "webpack": "^4.29.6",
    "webpack-cli": "^3.2.3"
  },
  "dependencies": {
    "lodash": "^4.17.11"
  }
}
```

#### (二) 更改配置文件

```js
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      // 打包输出HTML
      title: "自动生成 HTML",
      minify: {
        // 压缩 HTML 文件
        removeComments: true, // 移除 HTML 中的注释
        collapseWhitespace: true, // 删除空白符与换行符
        minifyCSS: true // 压缩内联 css
      },
      filename: "index.html", // 生成后的文件名
      template: "index.html" // 根据此模版生成 HTML 文件
    })
  ]
};
```

**HtmlWebpackPlugin** 是在 plugin 这个选项中配置的。常用参数含义如下：

- title: 打包后生成 html 的 title
- filename：打包后的 html 文件名称
- template：模板文件（例子源码中根目录下的 index.html）
- chunks：和 entry 配置中相匹配，支持多页面、多入口
- minify：压缩选项

由于使用了 `title` 选项，则需要在 `template` 选项对应的 html 的 title 中加入 `<%= htmlWebpackPlugin.options.title %>`

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307102044.png)

```js {4， 18}
const path = require("path");

const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin"); // 引入插件

module.exports = {
  entry: {
    page: "./src/page.js"
  },
  output: {
    publicPath: __dirname + "/dist/", // js 引用的路径或者 CDN 地址
    path: path.resolve(__dirname, "dist"), // 打包文件的输出目录
    filename: "[name].bundle.js", // 代码打包后的文件名
    chunkFilename: "[name].js" // 代码拆分后的文件名
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      // 打包输出HTML
      title: "自动生成 HTML",
      minify: {
        // 压缩 HTML 文件
        removeComments: true, // 移除 HTML 中的注释
        collapseWhitespace: true, // 删除空白符与换行符
        minifyCSS: true // 压缩内联 css
      },
      filename: "index.html", // 生成后的文件名
      template: "index.html" // 根据此模版生成 HTML 文件
    })
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        lodash: {
          name: "chunk-lodash", // 单独将 lodash 拆包
          priority: 10, // 优先级要大于 commons 不然会被打包进 commons
          test: /[\\/]node_modules[\\/]lodash[\\/]/
        },
        commons: {
          name: "chunk-commons",
          minSize: 1, //表示在压缩前的最小模块大小,默认值是 30kb
          minChunks: 2, // 最小公用次数
          priority: 5, // 优先级
          reuseExistingChunk: true // 公共模块必开启
        }
      }
    }
  }
};
```

#### (三) 打包并测试

运行 `npm run build`

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307102242.png)

打开 dist 文件夹里自动生成的 index.html

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307102402.png)

在浏览器中打开 index.html 文件，打开控制台也发现有输出，OK，自动生成 HTML 文件成功

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307102521.png)

细心的朋友可能会发现一个问题，生成后的 HTML 文件引入的 JS 为**绝对路径**，但是真实的项目打完包之后都是部署在服务器上，用绝对路径肯定不行，因为你本地电脑的绝对路径放在服务器上肯定找不到

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307102901.png)

我们要将引入的 js 文件**从绝对路径改为相对路径**

修改 webpack.config.js 文件

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307103015.png)

找到 output 输出配置，更改 publicPath 公共路径，修改为 `./` 绝对路径

```js
  output: {
    publicPath: './', // js 引用的路径或者 CDN 地址
    path: path.resolve(__dirname, 'dist'), // 打包文件的输出目录
    filename: '[name].bundle.js', // 代码打包后的文件名
    chunkFilename: '[name].js' // 代码拆分后的文件名
  },
```

再次打包，看打包后的 index.html 文件，打开浏览器测试，也是没问题的

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307103244.png)
