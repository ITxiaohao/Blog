---
title: '十九：Eslint 配置'
date: 2019-03-20
permalink: 'webpack4-eslint'
---

[demo19 源码地址](https://github.com/ITxiaohao/webpack4-learn/tree/master/demo19)

创建一个空文件夹，`npm init -y`，`npm webpack webpack-cli -D` 起手式，之后安装 eslint 依赖

```bash
npm i eslint -D
```

使用 npx 运行此项目中的 eslint 来初始化配置，`npx eslint --init`

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190322112303.png)

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190322141216.png)

这里会有选择是 React/Vue/JavaScript，我们统一都先选择 JavaScript。选完后会在项目的根目录下新建一个 `.eslintrc.js` 配置文件

```js
module.exports = {
	env: {
		browser: true,
		es6: true
	},
	extends: 'eslint:recommended',
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly'
	},
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module'
	},
	rules: {}
}
```

里面就是 eslint 的一些规范，也可以定义一些规则，具体看 [eslint 配置规则](https://cn.eslint.org/docs/user-guide/configuring)

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190322140558.png)

在 index.js 中随便写点代码来测试一下 eslint

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190322141304.png)

eslint 报错提示，变量定义后却没有使用，如果在编辑器里没出现报错提示，需要在 vscode 里先安装一个 eslint 扩展，它会根据你当前目录的下的 `.eslintrc.js` 文件来做作为校验的规则

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190322141853.png)

也可以通过命令行的形式，让 eslint 校验整个 src 目录下的文件

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190322141416.png)

如果你觉得某个规则很麻烦，想屏蔽掉某个规则的时候，可以这样，根据 eslint 的报错提示，比如上面的 `no-unused-vars`，将这条规则复制一下，在 `.eslintrc.js` 中的 rules 里配置一下，`"no-unused-vars": 0`，0 表示禁用，保存后，就不会报错了，但是这种方式是适用于**全局的配置**，如果你只想在某一行代码上屏蔽掉 eslint 校验，可以这样做

```js
/* eslint-disable no-unused-vars */
let a = '1'
```

这个 eslint 的 vscode 扩展和 webpack 是没有什么关联的，我们现在要讲的是如何在 webpack 里使用 eslint，首先安装一个插件

```bash
npm i eslint-loader -D
```

在 webpack.config.js 中进行配置

```js {16}
/* eslint-disable no-undef */
// eslint-disable-next-line no-undef
const path = require('path')

module.exports = {
	mode: 'production',
	entry: {
		app: './src/index.js' // 需要打包的文件入口
	},
	module: {
		rules: [
			{
				test: /\.js$/, // 使用正则来匹配 js 文件
				exclude: /nodes_modules/, // 排除依赖包文件夹
				use: {
					loader: 'eslint-loader' // 使用 eslint-loader
				}
			}
		]
	},
	output: {
		// eslint-disable-next-line no-undef
		publicPath: __dirname + '/dist/', // js 引用的路径或者 CDN 地址
		// eslint-disable-next-line no-undef
		path: path.resolve(__dirname, 'dist'), // 打包文件的输出目录
		filename: 'bundle.js' // 打包后生产的 js 文件
	}
}
```

由于 webpack 配置文件也会被 eslint 校验，这里我先写上注释，关闭校验

如果你有使用 babel-loader 来转译，则 loader 应该这么写

`loader: ['babel-loader', 'eslint-loader']`

rules 的执行顺序是从右往左，从下往上的，先经过 eslint 校验判断代码是否符合规范，然后再通过 babel 来做转移

配置完 webpack.config.js，我们将 index.js 还原回之前报错的状态，不要使用注释关闭校验，然后运行打包命令，记得去 package.json 配置 script

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190322144101.png)

会在打包的时候，提示代码不合格，不仅仅是生产环境，开发环境也可以配置，可以将 eslint-loader 配置到 webpack 的公共模块中，这样更有利于我们检查代码规范

如：设置 fix 为 true，它会帮你自动修复一些错误，不能自动修复的，还是需要你自己手动修复

```js
{
 loader: 'eslint-loader', // 使用 eslint-loader
  options: {
    fix: true
  }
}
```

关于 eslint-loader，webpack 的官网也给出了[配置](https://webpack.js.org/loaders/eslint-loader)，感兴趣的朋友自己去看一看
