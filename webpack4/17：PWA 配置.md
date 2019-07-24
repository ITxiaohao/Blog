---
title: '十七：PWA 配置'
date: 2019-03-20
permalink: 'webpack4-pwa'
---

[demo17 源码地址](https://github.com/ITxiaohao/webpack4-learn/tree/master/demo17)

本节使用 [demo15](https://github.com/ITxiaohao/webpack4-learn/tree/master/demo15) 的代码为基础

我们来模拟平时开发中，将打包完的代码防止到服务器上的操作，首先打包代码 `npm run build`

然后安装一个插件 `npm i http-server -D`

在 package.json 中配置一个 script 命令

```json {3}
{
	"scripts": {
		"start": "http-server dist",
		"dev": "webpack-dev-server --open --config ./build/webpack.dev.conf.js",
		"build": "webpack --config ./build/webpack.prod.conf.js"
	}
}
```

运行 `npm run start`

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190321171751.png)

现在就起了一个服务，端口是 8080，现在访问 **http://127.0.0.1:8080** 就能看到效果了

:::warning 注意

如果你有在跑别的项目，端口也是 8080，端口就冲突，记得先关闭其他项目的 8080 端口，再 `npm run start`

:::

我们按 ctrl + c 关闭 http-server 来模拟**服务器挂了**的场景，再访问 **http://127.0.0.1:8080** 就会是这样

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190321172023.png)

页面访问不到了，因为我们服务器挂了，PWA 是什么技术呢，它可以在你第一次访问成功的时候，做一个缓存，当服务器挂了之后，你依然能够访问这个网页

首先安装一个插件：**workbox-webpack-plugin**

```bash
npm i workbox-webpack-plugin -D
```

只有要上线的代码，才需要做 PWA 的处理，打开 **webpack.prod.conf.js**

```js
const WorkboxPlugin = require('workbox-webpack-plugin') // 引入 PWA 插件

const prodConfig = {
	plugins: [
		// 配置 PWA
		new WorkboxPlugin.GenerateSW({
			clientsClaim: true,
			skipWaiting: true
		})
	]
}
```

重新打包，在 dist 目录下会多出 `service-worker.js` 和 `precache-manifest.js` 两个文件，通过这两个文件就能使我们的网页支持 PWA 技术，**service-worker.js** 可以理解为另类的缓存

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190321172747.png)

还需要去业务代码中使用 **service-worker**

在 app.js 中加上以下代码

```js
// 判断该浏览器支不支持 serviceWorker
if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker
			.register('/service-worker.js')
			.then(registration => {
				console.log('service-worker registed')
			})
			.catch(error => {
				console.log('service-worker registed error')
			})
	})
}
```

重新打包，然后运行 `npm run start` 来模拟服务器上的操作，最好用无痕模式打开 **http://127.0.0.1:8080** ，打开控制台

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190321174122.png)

现在文件已经被缓存住了，现在 ctrl + c 关闭服务，再次刷新页面也还是能显示的
