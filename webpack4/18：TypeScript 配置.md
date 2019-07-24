---
title: '十八：TypeScript 配置'
date: 2019-03-20
permalink: 'webpack4-typescript'
---

[demo18 源码地址](https://github.com/ITxiaohao/webpack4-learn/tree/master/demo18)

[TypeScript](https://www.tslang.cn/) 是 JavaScript 类型的超集，它可以编译成纯 JavaScript

新建文件夹，`npm init -y`，`npm i webpack webpack-cli -D`，新建 src 目录，创建 **index.ts** 文件，这段代码在浏览器上是运行不了的，需要我们打包编译，转成 js

```ts
class Greeter {
	greeting: string
	constructor(message: string) {
		this.greeting = message
	}
	greet() {
		return 'Hello, ' + this.greeting
	}
}

let greeter = new Greeter('world')

alert(greeter.greet())
```

```bash
npm i ts-loader typescript -D
```

新建 webpack.config.js 并配置

```js {9}
const path = require('path')

module.exports = {
	mode: 'production',
	entry: './src/index.ts',
	module: {
		rules: [
			{
				test: /\.ts?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	}
}
```

在 package.json 中配置 script

```json
{
	"scripts": {
		"build": "webpack"
	}
}
```

运行 `npm ruh build`，报错了，缺少 **tsconfig.json** 文件

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190322095022.png)

:::tip

当打包 typescript 文件的时候，需要在项目的根目录下创建一个 tsconfig.json 文件

:::

以下为简单配置，更多详情看[官网](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

```json
{
	"compileerOptions": {
		"outDir": "./dist", // 写不写都行
		"module": "es6", // 用 es6 模块引入 import
		"target": "es5", // 打包成 es5
		"allowJs": true // 允许在 ts 中也能引入 js 的文件
	}
}
```

再次打包，打开 bundle.js 文件，**将代码全部拷贝到浏览器控制台上**，使用这段代码，可以看到弹窗出现 Hello,world，说明 ts 编译打包成功

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190322100409.png)

**引入第三方库**

```bash
npm i lodash
```

```js {9}
import _ from 'lodash'

class Greeter {
	greeting: string
	constructor(message: string) {
		this.greeting = message
	}
	greet() {
		return _.join()
	}
}

let greeter = new Greeter('world')

alert(greeter.greet())
```

lodash 的 join 方法需要我们传递参数，但是现在我们什么都没传，也没有报错，我们使用 typescript 就是为了类型检查，在引入第三方库的时候也能如此，可是现在缺并没有报错或者提示

我们还要安装一个 lodash 的 typescript 插件，这样就能识别 lodash 方法中的参数，一旦使用的不对就会报错出来

```bash
npm i @types/lodash -D
```

安装完以后可以发现下划线 \_ 报错了

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190322101450.png)

需要改成 `import * as _ from 'lodash'`，将 join 方法传递的参数删除，还可以发现 join 方法的报错，这就体现了 typescript 的优势，同理，引入 jQuery 也要引入一个 jQuery 对应的类型插件

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190322101701.png)

**如何知道使用的库需要安装对应的类型插件呢?**

打开[TypeSearch](https://microsoft.github.io/TypeSearch/)，在这里对应的去搜索你想用的库有没有类型插件，如果有只需要 `npm i @types/jquery -D` 即可

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190322102406.png)
