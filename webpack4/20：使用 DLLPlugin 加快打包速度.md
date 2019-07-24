---
title: '二十：使用 DLLPlugin 加快打包速度'
date: 2019-03-20
permalink: 'webpack4-dllPlugin'
---

[demo20 源码地址](https://github.com/ITxiaohao/webpack4-learn/tree/master/demo20)

本节使用 [demo15](https://github.com/ITxiaohao/webpack4-learn/tree/master/demo15) 的代码为基础

我们先安装一个 lodash 插件 `npm i lodash`，并在 app.js 文件中写入

```js
import _ from 'lodash'
console.log(_.join(['hello', 'world'], '-'))
```

在 build 文件夹下新建 webpack.dll.js 文件

```js {11}
const path = require('path')

module.exports = {
	mode: 'production',
	entry: {
		vendors: ['lodash', 'jquery']
	},
	output: {
		filename: '[name].dll.js',
		path: path.resolve(__dirname, '../dll'),
		library: '[name]'
	}
}
```

这里使用 **library**，忘记的朋友可以回顾一下第十六节，自定义函数库里的内容，定义了 library 就相当于挂载了这个全局变量，只要在控制台输入全局变量的名称就可以显示里面的内容，比如这里我们是 `library: '[name]'` 对应的 name 就是我们在 entry 里定义的 **vendors**

在 package.json 中的 script 再新增一个命令

```json {5}
{
	"scripts": {
		"dev": "webpack-dev-server --open --config ./build/webpack.dev.conf.js",
		"build": "webpack --config ./build/webpack.prod.conf.js",
		"build:dll": "webpack --config ./build/webpack.dll.js"
	}
}
```

运行 `npm run build:dll`，会生成 dll 文件夹，并且文件为 `vendors.dll.js`

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190322160815.png)

打开文件可以发现 lodash 已经被打包到了 dll 文件中

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190322160654.png)

那我们要如何使用这个 vendors.dll.js 文件呢

需要再安装一个依赖 `npm i add-asset-html-webpack-plugin`，它会将我们打包后的 dll.js 文件注入到我们生成的 index.html 中

在 webpack.base.conf.js 文件中引入

```js
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin')

module.exports = {
	plugins: [
		new AddAssetHtmlWebpackPlugin({
			filepath: path.resolve(__dirname, '../dll/vendors.dll.js') // 对应的 dll 文件路径
		})
	]
}
```

使用 `npm run dev` 来打开网页

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190322161305.png)

现在我们已经把第三方模块单独打包成了 dll 文件，并使用

但是现在使用第三方模块的时候，要用 **dll** 文件，而不是使用 **/node_modules/** 中的库，继续来修改 **webpack.dll.js** 配置

```js
const path = require('path')
const webpack = require('webpack')

module.exports = {
	mode: 'production',
	entry: {
		vendors: ['lodash', 'jquery']
	},
	output: {
		filename: '[name].dll.js',
		path: path.resolve(__dirname, '../dll'),
		library: '[name]'
	},
	plugins: [
		new webpack.DllPlugin({
			name: '[name]',
			// 用这个插件来分析打包后的这个库，把库里的第三方映射关系放在了这个 json 的文件下，这个文件在 dll 目录下
			path: path.resolve(__dirname, '../dll/[name].manifest.json')
		})
	]
}
```

保存后重新打包 dll，`npm run build:dll`

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190322162313.png)

修改 webpack.base.conf.js 文件，添加 **webpack.DllReferencePlugin** 插件

```js
module.exports = {
	plugins: [
		// 引入我们打包后的映射文件
		new webpack.DllReferencePlugin({
			manifest: path.resolve(__dirname, '../dll/vendors.manifest.json')
		})
	]
}
```

之后再 webpack 打包的时候，就可以结合之前的全局变量 **vendors** 和 这个新生成的 **vendors.manifest.json** 映射文件，然后来对我们的源代码进行分析，一旦分析出使用第三方库是在 **vendors.dll.js** 里，就会去使用 **vendors.dll.js**，不会去使用 **/node_modules/** 里的第三方库了

再次打包 `npm run build`，可以把 **webpack.DllReferencePlugin** 模块注释后再打包对比一下

注释前 4000ms 左右，注释后 4300ms 左右，虽然只是快了 300ms，但是我们目前只是实验性的 demo，实际项目中，比如拿 vue 来说，vue，vue-router，vuex，element-ui，axios 等第三方库都可以打包到 dll.js 里，那个时候的打包速度就能提升很多了

还可以继续拆分，修改 webpack.dll.js 文件

```js {7,8}
const path = require('path')
const webpack = require('webpack')

module.exports = {
	mode: 'production',
	entry: {
		lodash: ['lodash'],
		jquery: ['jquery']
	},
	output: {
		filename: '[name].dll.js',
		path: path.resolve(__dirname, '../dll'),
		library: '[name]'
	},
	plugins: [
		new webpack.DllPlugin({
			name: '[name]',
			path: path.resolve(__dirname, '../dll/[name].manifest.json') // 用这个插件来分析打包后的这个库，把库里的第三方映射关系放在了这个 json 的文件下，这个文件在 dll 目录下
		})
	]
}
```

运行 `npm run build:dll`

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190322165539.png)

可以把之前打包的 **vendors.dll.js** 和 **vendors.manifest.json** 映射文件给删除掉

然后再修改 webpack.base.conf.js

```js
module.exports = {
	plugins: [
		new AddAssetHtmlWebpackPlugin({
			filepath: path.resolve(__dirname, '../dll/lodash.dll.js')
		}),
		new AddAssetHtmlWebpackPlugin({
			filepath: path.resolve(__dirname, '../dll/jquery.dll.js')
		}),
		new webpack.DllReferencePlugin({
			manifest: path.resolve(__dirname, '../dll/lodash.manifest.json')
		}),
		new webpack.DllReferencePlugin({
			manifest: path.resolve(__dirname, '../dll/jquery.manifest.json')
		})
	]
}
```

保存后运行 `npm run dev`，看看能不能成功运行

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190322165928.png)

这还只是拆分了两个第三方模块，就要一个个配置过去，有没有什么办法能简便一点呢? 有!

这里使用 node 的 api，fs 模块来读取文件夹里的内容，创建一个 plugins 数组用来存放公共的插件

```js
const fs = require('fs')

const plugins = [
	// 开发环境和生产环境二者均需要的插件
	new HtmlWebpackPlugin({
		title: 'webpack4 实战',
		filename: 'index.html',
		template: path.resolve(__dirname, '..', 'index.html'),
		minify: {
			collapseWhitespace: true
		}
	}),
	new webpack.ProvidePlugin({ $: 'jquery' })
]

const files = fs.readdirSync(path.resolve(__dirname, '../dll'))
console.log(files)
```

写完可以先输出一下，把 plugins 给注释掉，`npm run build` 打包看看输出的内容，可以看到文件夹中的内容以数组的形式被打印出来了，之后我们对这个数组做一些循环操作就行了

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190322171146.png)

完整代码：

```js
const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin')

// 存放公共插件
const plugins = [
	// 开发环境和生产环境二者均需要的插件
	new HtmlWebpackPlugin({
		title: 'webpack4 实战',
		filename: 'index.html',
		template: path.resolve(__dirname, '..', 'index.html'),
		minify: {
			collapseWhitespace: true
		}
	}),
	new webpack.ProvidePlugin({ $: 'jquery' })
]

// 自动引入 dll 中的文件
const files = fs.readdirSync(path.resolve(__dirname, '../dll'))
files.forEach(file => {
	if (/.*\.dll.js/.test(file)) {
		plugins.push(
			new AddAssetHtmlWebpackPlugin({
				filepath: path.resolve(__dirname, '../dll', file)
			})
		)
	}
	if (/.*\.manifest.json/.test(file)) {
		plugins.push(
			new webpack.DllReferencePlugin({
				manifest: path.resolve(__dirname, '../dll', file)
			})
		)
	}
})

module.exports = {
	entry: {
		app: './src/app.js'
	},
	output: {
		path: path.resolve(__dirname, '..', 'dist')
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader'
					}
				]
			},
			{
				test: /\.(png|jpg|jpeg|gif)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							name: '[name]-[hash:5].min.[ext]',
							limit: 1000, // size <= 1KB
							outputPath: 'images/'
						}
					},
					// img-loader for zip img
					{
						loader: 'image-webpack-loader',
						options: {
							// 压缩 jpg/jpeg 图片
							mozjpeg: {
								progressive: true,
								quality: 65 // 压缩率
							},
							// 压缩 png 图片
							pngquant: {
								quality: '65-90',
								speed: 4
							}
						}
					}
				]
			},
			{
				test: /\.(eot|ttf|svg)$/,
				use: {
					loader: 'url-loader',
					options: {
						name: '[name]-[hash:5].min.[ext]',
						limit: 5000, // fonts file size <= 5KB, use 'base64'; else, output svg file
						publicPath: 'fonts/',
						outputPath: 'fonts/'
					}
				}
			}
		]
	},
	plugins,
	performance: false
}
```

使用 `npm run dev` 打开网页也没有问题了，这样自动注入 dll 文件也搞定了，之后还要再打包第三方库只要添加到 **webpack.dll.js** 里面的 `entry` 属性中就可以了
