---
title: '十四：webpack-dev-server'
date: 2019-03-20
permalink: 'webpack-dev-server'
---

[demo14 源码地址](https://github.com/ITxiaohao/webpack4-learn/tree/master/demo14)

**1. 为什么需要开发模式？**

这十几节来我们使用最多的就是**生产环境**，也就是执行 `npm run build` 命令，打包项目中的各种文件及压缩

而开发模式就是指定 mode 为 development。对应我们在 `package.json` 中配置的，就是 `npm run dev`，在第二小节也涉及到了这一点

在开发模式下，我们需要对代码进行调试。对应的配置就是：**devtool** 设置为 **source-map**。在非开发模式下，需要关闭此选项，以减小打包体积。详情见: [devtool](https://webpack.docschina.org/configuration/devtool/#src/components/Sidebar/Sidebar.jsx)

在开发模式下，还需要**热重载**、**路由重定向**、**设置代理**等功能，webpack4 已经提供了 devServer 选项，启动一个本地服务器，让开发者使用这些功能。

目录结构：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190312171439.png)

安装依赖

```bash
npm i webpack-dev-server --save-dev
```

修改 `package.json`

```json {3,13}
{
	"scripts": {
		"dev": "webpack-dev-server --open",
		"build": "webpack --mode production"
	},
	"devDependencies": {
		"clean-webpack-plugin": "^2.0.0",
		"html-loader": "^0.5.5",
		"html-webpack-plugin": "^3.2.0",
		"jquery": "^3.3.1",
		"webpack": "^4.29.6",
		"webpack-cli": "^3.2.3",
		"webpack-dev-server": "^3.2.1"
	}
}
```

因为我们在 package.json 中配置了 script，所以开启开发模式直接 `npm run dev` 即可

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190312171510.png)

虽然控制台输出了打包信息（假设我们已经配置了热重载），但是磁盘上并没有创建 **/dist/** 文件夹和打包文件。控制台的打包文件的相关内容是存储在内存之中的。

修改 index.html 文件

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<meta http-equiv="X-UA-Compatible" content="ie=edge" />
		<title>webpack-dev-server</title>
	</head>

	<body>
		This is Index html
	</body>
</html>
```

按照项目目录，简单封装下 /vendor/ 下的三个 js 文件，以方便 app.js 调用：

```js
// minus.js
module.exports = function(a, b) {
	return a - b
}

// multi.js
define(function(require, factory) {
	'use strict'
	return function(a, b) {
		return a * b
	}
})

// sum.js
export default function(a, b) {
	console.log('I am sum.js')
	return a + b
}
```

app.js 中使用三种引入方式引入 js 文件:

```js
import sum from './vendor/sum'
console.log('sum(1, 2) = ', sum(1, 2))

var minus = require('./vendor/minus')
console.log('minus(1, 2) = ', minus(1, 2))

require(['./vendor/multi'], function(multi) {
	console.log('multi(1, 2) = ', multi(1, 2))
})
```

现在开始更改 webpack.config.js， 完整的配置文件如下：

```js
const webpack = require('webpack')
const path = require('path')

const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	entry: {
		app: './src/app.js'
	},
	output: {
		publicPath: '/', // js 引用的路径或者 CDN 地址
		path: path.resolve(__dirname, 'dist'), // 打包文件的输出目录
		filename: '[name].bundle.js', // 代码打包后的文件名
		chunkFilename: '[name].js' // 代码拆分后的文件名
	},
	mode: 'development', // 开发模式
	devtool: 'source-map', // 开启调试
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		port: 8000, // 本地服务器端口号
		hot: true, // 热重载
		overlay: true, // 如果代码出错，会在浏览器页面弹出“浮动层”。类似于 vue-cli 等脚手架
		proxy: {
			// 跨域代理转发
			'/comments': {
				target: 'https://m.weibo.cn',
				changeOrigin: true,
				logLevel: 'debug',
				headers: {
					Cookie: ''
				}
			}
		},
		historyApiFallback: {
			// HTML5 history模式
			rewrites: [{ from: /.*/, to: '/index.html' }]
		}
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
		new webpack.HotModuleReplacementPlugin(), // 热部署模块
		new webpack.NamedModulesPlugin(),
		new webpack.ProvidePlugin({
			$: 'jquery', // npm
			jQuery: 'jQuery' // 本地Js文件
		})
	]
}
```

对上面的配置进行单独分析:

- 模块热更新

模块热更新需要 **[HotModuleReplacementPlugin](https://webpack.js.org/plugins/hot-module-replacement-plugin/#root)** 和 **[NamedModulesPlugin](https://www.webpackjs.com/plugins/named-modules-plugin/)** 这两个插件，**并且顺序不能错，并且指定 devServer.hot 为 true**，

```js {1,5,6}
const webpack = require('webpack') // 引入 webpack

module.exports = {
	plugins: [
		new webpack.HotModuleReplacementPlugin(), // 热部署模块
		new webpack.NamedModulesPlugin()
	]
}
```

有了这两个插件，在项目的 **js** 代码中**可以针对侦测到变更的文件并且做出相关处理**，也就不用写完代码**重新刷新页面**，它会自动检测变更的代码并且在页面上更改

:::tip
注意是 **js** 代码，如果你去改动 index.html 文件，保存后，页面并不会更改，反之你去修改了 js 文件，保存后，页面会更新
:::

比如，我们启动开发模式后，修改了 `vendor/sum.js` 这个文件，此时，需要在浏览器的控制台打印一些信息。那么，**app.js** 中就可以这么写：

```js
if (module.hot) {
	// 检测是否有模块热更新
	module.hot.accept('./vendor/sum.js', function() {
		// 针对被更新的模块, 进行进一步操作
		console.log('/vendor/sum.js is changed')
	})
}
```

每当 **sum.js** 被修改后，都可以自动执行回调函数。

浏览器控制台输出信息如下：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190312171605.png)

但是我们日常开发中使用 vue 脚手架根本没有写过这样的代码，也能热更新，是因为 **vue-loader** 中内置了这种方法，**css-loader** 中也有，所以我们改完 js 和 css 代码就能直接看到更新

- 跨域代理

随着前后端分离开发的普及，跨域请求变得越来越常见。为了快速开发，可以利用 devServer.proxy 做一个代理转发，来绕过浏览器的跨域限制。

devServer 模块的底层是使用了 [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)，能配置的东西非常多

按照前面的配置文件，如果想调用微博的一个接口：https://m.weibo.cn/comments/hotflow。只需要在代码中对 /comments/hotflow 进行请求即可，在 app.js 中添加如下代码：

```js
$.get(
	'/comments/hotflow',
	{
		id: '4263554020904293',
		mid: '4263554020904293',
		max_id_type: '0'
	},
	function(data) {
		console.log(data)
	}
)
```

上面代码是使用 jQuery 发送 get 请求，如果是在 vue 项目中，一般是使用 axios 来发送请求

修改完 app.js 后保存，打开之前的 localhost:8000 网页，可以看到 Network 发送的请求

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190312171756.png)

- HTML5–History

当项目使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html。

在 SPA（单页应用）中，任何响应直接被替代为 index.html。

在 vuejs 官方的脚手架 vue-cli 中，开发模式下配置如下：

```js
historyApiFallback: {
	// HTML5 history模式
	rewrites: [{ from: /.*/, to: '/index.html' }]
}
```

最终 app.js 中的代码如下：

```js
import sum from './vendor/sum'
console.log('sum(1, 2) = ', sum(1, 2))

var minus = require('./vendor/minus')
console.log('minus(1, 2) = ', minus(1, 2))

require(['./vendor/multi'], function(multi) {
	console.log('multi(1, 2) = ', multi(1, 2))
})

$.get(
	'/comments/hotflow',
	{
		id: '4263554020904293',
		mid: '4263554020904293',
		max_id_type: '0'
	},
	function(data) {
		console.log(data)
	}
)

if (module.hot) {
	// 检测是否有模块热更新
	module.hot.accept('./vendor/sum.js', function() {
		// 针对被更新的模块, 进行进一步操作
		console.log('/vendor/sum.js is changed')
	})
}
```

打开控制台，可以看到代码都正常运行没有出错。除此之外，由于开启了 **source-map**，所以可以定位代码位置（下图红框内）：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190312171919.png)

参考文章： [webpack4 系列教程 (十五)：开发模式与 webpack-dev-server](https://godbmw.com/passages/2018-10-19-webpack-dev-server/)
