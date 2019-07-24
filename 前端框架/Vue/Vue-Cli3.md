---
title: 'Vue-Cli3'
permalink: 'vue-cli3'
---

## 构建及部署

:::tip Node 版本要求

Vue CLI 需要 **Node.js 8.9** 或更高版本 (推荐 8.11.0+)。你可以使用 **nvm** 或 **nvm-windows** 在同一台电脑中管理多个 **Node** 版本。

:::

可以使用下列任一命令安装这个新的包：

```bash
npm install -g @vue/cli
# OR
yarn global add @vue/cli
```

创建项目

```bash
vue create vue-cli3-learn
```

### 初始化配置

选择配置

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190118191142.png)

**是否使用 history 路由模式（No）**：这里看具体情况，因为 history 路由模式是要**和后端配合**

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190118191228.png)

**选择 css 预处理器（Sass/SCSS）**：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190118191246.png)

**选择 eslint 配置（ESLint + Prettier config）**：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190118191301.png)

**选择什么时候执行 eslint 校验（Lint on save）**：保存时就校验

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190118191313.png)

**是否将之前的设置保存为一个预设模板（n）**：这里先不设置为预设，有需要的可以设置

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190118191336.png)

如果选择 y 会让输入名称，以便下次**直接使用**，否则直接开始初始化项目。

出现以下内容表示初始化脚手架成功

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190118191353.png)

文件结构如下：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190118191410.png)

配置在 `.eslintrc.js` 配置文件中设置 `Prettier` 格式化风格

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190118191431.png)

```js
'prettier/prettier': [
	'error',
	{
		semi: false, // false 表示去除结尾分号
		singleQuote: true, // 双引号全改用单引号
		bracketSpacing: true // 函数体括号后方留空格
	}
]
```

配置完以后**肯定**和现有的代码冲突，因为规则不同

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190118191457.png)

如果文件有很多，一个个手动去更改很累，这时就要使用官方为我们提供好的功能了

在 README.md 文件中有这么一句话：**整理和修复文件**

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190118191521.png)

怎么看这个 `npm run lint` 是执行了什么命令呢，为什么就能整理和修复文件

在 **package.json** 文件中，可以看到

```js
 "lint": "vue-cli-service lint"
```

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190118191538.png)

我们试着运行 `npm run lint` 看看会发生什么

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190118191555.png)

它就去执行了 `vue-cli-service lint`

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190118192156.png)

可以看到所有的错误都被自动修复了

### 在项目中优雅的使用 svg

首先在 **/src/components** 创建 **SvgIcon.vue** 文件

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190118192226.png)

```vue
<template>
  <svg :class="svgClass" aria-hidden="true"><use :xlink:href="iconName" /></svg>
</template>
<script>
export default {
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ''
    }
  },
  computed: {
    iconName() {
      return `#icon-${this.iconClass}`
    },
    svgClass() {
      if (this.className) {
        return 'svg-icon ' + this.className
      } else {
        return 'svg-icon'
      }
    }
  }
}
</script>
<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
```

在 **src/** 下创建 **icons/svg** 文件夹，放入 **svg** 文件，并创建 **index.js** 作为入口文件

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190118192417.png)

**index.js** 代码为

```js
import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon.vue' // svg组件

// 全局注册
Vue.component('svg-icon', SvgIcon)

const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./svg', false, /\.svg$/)
requireAll(req)
```

使用了 **svg** 的文件，**webpack** 是不会识别的，需要一个依赖去处理

使用 `svg-sprite-loader` 依赖对项目中使用的 **svg** 进行处理：

```sh
npm install svg-sprite-loader --save-dev
```

修改默认的 **webpack** 配置， 在项目根目录创建 **vue.config.js**，代码如下

```js
const path = require('path')
function resolve(dir) {
  return path.join(__dirname, './', dir)
}
module.exports = {
  chainWebpack: config => {
    // svg loader
    const svgRule = config.module.rule('svg') // 找到 svg-loader
    svgRule.uses.clear() // 清除已有的 loader, 如果不这样做会添加在此loader之后
    svgRule.exclude.add(/node_modules/) // 正则匹配排除 node_modules 目录
    svgRule // 添加 svg 新的 loader 处理
      .test(/\.svg$/)
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
    // 修改 images loader 添加 svg 处理
    const imagesRule = config.module.rule('images')
    imagesRule.exclude.add(resolve('src/icons'))
    config.module.rule('images').test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
  }
}
```

最后，在 **main.js**  中引入 **import '@/icons'** 即可

使用示例：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190118192732.png)

### axios 封装 api

项目中安装 **axios**：

```bash
npm install axios
```

在 **src** 目录下创建 **utils/**， 并创建 **request.js** 用来封装 **axios**，上代码：

```js
import axios from 'axios'
// 创建axios 实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 5000 // 请求超时时间
})
// request 拦截器
service.interceptors.request.use(
  config => {
    // 这里可以自定义一些 config 配置
    return config
  },
  error => {
    // 这里处理一些请求出错的情况
    console.log(error)
    Promise.reject(error)
  }
)
// response 拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    // 这里处理一些 response 正常返回时的逻辑
    return res
  },
  error => {
    // 这里处理一些 response 出错时的逻辑
    return Promise.reject(error)
  }
)
export default service
```

在 **vue.config.js** 中配置别名，之后在项目中引入文件更加方便

```js
const path = require('path')
function resolve(dir) {
  return path.join(__dirname, './', dir)
}
module.exports = {
  chainWebpack: config => {
    // 配置别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('api', resolve('src/api'))
      .set('static', resolve('src/static'))

    // svg loader
    const svgRule = config.module.rule('svg') // 找到 svg-loader
    svgRule.uses.clear() // 清除已有的 loader, 如果不这样做会添加在此loader之后
    svgRule.exclude.add(/node_modules/) // 正则匹配排除 node_modules 目录
    svgRule // 添加 svg 新的 loader 处理
      .test(/\.svg$/)
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
    // 修改 images loader 添加 svg 处理
    const imagesRule = config.module.rule('images')
    imagesRule.exclude.add(resolve('src/icons'))
    config.module.rule('images').test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
  }
}
```

在 **src** 目录下新建一个 **api** 文件，里面按模块存放 **api** 接口，如新建一个 **login.js** 文件

```js
import request from '@/utils/request' // 引入对 axios 封装的 request 文件

export function login(username, password) {
  return request({
    url: '/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}
```

具体在 **vue** 组件中使用，则：

```js
import { login } from 'api/login' // 引入 login 方法

export default {
  created() {
    let username = 'root'
    let password = 123456
    // 调用 login 方法
    login(username, password).then(res => {
      console.log(res)
    })
  }
}
```

既然要使用 **axios** ，必不可少的需要配置环境变量以及需要请求的地址，这里可以简单的修改 **poackage.json**:

```json
"scripts": {
  "dev": "vue-cli-service serve --project-mode dev",
  "test": "vue-cli-service serve --project-mode test",
  "build": "vue-cli-service build",
  "build:dev": "vue-cli-service build --project-mode dev",
  "build:test": "vue-cli-service build --project-mode test",
  "lint": "vue-cli-service lint"
}
```

同时修改 **vue.config.js**：

```js
const path = require('path')
function resolve(dir) {
  return path.join(__dirname, './', dir)
}
module.exports = {
  chainWebpack: config => {
    // 配置别名
    config.resolve.alias
      .set('@$', resolve('src'))
      .set('api', resolve('src/api'))
      .set('static', resolve('src/static'))

    // 这里是对环境的配置，不同环境对应不同的 BASE_API，以便 axios 的请求地址不同
    config.plugin('define').tap(args => {
      const argv = process.argv
      const mode = argv[argv.indexOf('--project-mode') + 1]
      args[0]['process.env'].MODE = `"${mode}"`
      switch (args[0]['process.env'].MODE) {
        case '"test"':
          args[0]['process.env'].BASE_API = '"/test"' // 测试环境前缀
          break
        case '"dev"':
          args[0]['process.env'].BASE_API = '"/api"' // 开发环境前缀
          break
      }
      console.log(args) // 输出后没问题记得注释掉
      return args
    })

    // svg loader
    const svgRule = config.module.rule('svg') // 找到 svg-loader
    svgRule.uses.clear() // 清除已有的 loader, 如果不这样做会添加在此loader之后
    svgRule.exclude.add(/node_modules/) // 正则匹配排除 node_modules 目录
    svgRule // 添加 svg 新的 loader 处理
      .test(/\.svg$/)
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
    // 修改 images loader 添加 svg 处理
    const imagesRule = config.module.rule('images')
    imagesRule.exclude.add(resolve('src/icons'))
    config.module.rule('images').test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
  }
}
```

这里可以输出个 `console.log(args)` 在终端看看输出结果

运行 `npm run build:dev` 就会打包 **dev** 环境下的 **BASE_API**

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190118200735.png)

运行 `npm run build:test` 就会打包 **test** 环境下的 **BASE_API**

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190118200752.png)

同理 `npm run dev` 也只会运行 **dev** 模式下的 **BASE_API** ，这样就能结合 **axios** ，来配置不同环境下的后端地址

### webpack4 拆分代码段

全局引入 **element-ui** ，👉[传送门](http://element-cn.eleme.io/#/zh-CN/component/installation)

引入前的大小

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190118201138.png)

引入后

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190118201119.png)

由于代码没有拆分，可以看到 **chunk-vendors** 这个 js 文件相当的大

使用 **webpack4** 新特性来拆分代码段，在 **vue.config.js** 中配置

```js
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, './', dir)
}

module.exports = {
  chainWebpack: config => {
    // 配置别名
    config.resolve.alias
      .set('@$', resolve('src'))
      .set('api', resolve('src/api'))
      .set('static', resolve('src/static'))

    // 这里是对环境的配置，不同环境对应不同的 BASE_API，以便 axios 的请求地址不同
    config.plugin('define').tap(args => {
      const argv = process.argv
      const mode = argv[argv.indexOf('--project-mode') + 1]
      args[0]['process.env'].MODE = `"${mode}"`
      switch (args[0]['process.env'].MODE) {
        case '"test"':
          args[0]['process.env'].BASE_API = '"/test"'
          break
        case '"dev"':
          args[0]['process.env'].BASE_API = '"/api"'
          break
      }
      return args
    })

    // svg loader
    const svgRule = config.module.rule('svg') // 找到 svg-loader
    svgRule.uses.clear() // 清除已有的 loader, 如果不这样做会添加在此loader之后
    svgRule.exclude.add(/node_modules/) // 正则匹配排除 node_modules 目录
    svgRule // 添加 svg 新的 loader 处理
      .test(/\.svg$/)
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })

    // 修改 images loader 添加 svg 处理
    const imagesRule = config.module.rule('images')
    imagesRule.exclude.add(resolve('src/icons'))
    config.module.rule('images').test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)

    // 使用 webpack4 新特性来拆分代码
    config.optimization.splitChunks({
      chunks: 'all',
      cacheGroups: {
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial' // 只打包初始时依赖的第三方
        },
        elementUI: {
          name: 'chunk-elementUI', // 单独将 elementUI 拆包
          priority: 20, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
          test: /[\\/]node_modules[\\/]element-ui[\\/]/
        },
        commons: {
          name: 'chunk-commons',
          test: resolve('src/components'), // 可自定义拓展你的规则
          minChunks: 3, // 最小公用次数
          priority: 5,
          reuseExistingChunk: true // 公共模块必开启
        }
      }
    })
    config.optimization.runtimeChunk('single')
  }
}
```

:::tip
在 webpack4 之前是使用 **commonsChunkPlugin** 来拆分公共代码，v4 之后被废弃，并使用 **splitChunksPlugins**
:::

在使用 **splitChunksPlugins** 之前，首先要知道 **splitChunksPlugins** 是 **webpack** 主模块中的一个细分模块，**无需 npm 引入**

| 配置项             | 说明                                                     | 示例                                                        |
| ------------------ | -------------------------------------------------------- | ----------------------------------------------------------- |
| chunks             | 匹配的块的类型                                           | initial（初始块），async（按需加载的异步块），all（所有块） |
| name               | 用以控制分离后代码块的命名                               | chunk-libs                                                  |
| test               | 用于规定缓存组匹配的文件位置                             | /[\\/]node_modules[\\/]/                                    |
| priority           | 分离规则的优先级，优先级越高，则优先匹配                 | priority: 20                                                |
| minChunks          | 分割前必须共享模块的最小块数                             | minChunks: 3                                                |
| reuseExistingChunk | 如果当前块已从主模块拆分出来，则将重用它而不是生成新的块 | true                                                        |

叫做 **cacheGroup** 的原因是 **webpack** 会将规则放置在 **cache** 流中，为对应的块文件匹配对应的流，从而生成分离后的块

其他配置具体详情见[官网](https://webpack.js.org/plugins/split-chunks-plugin/#splitchunks-cachegroups-cachegroup-reuseexistingchunk)

现在再看看打包后的体积大小

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190118202740.png)

可以看到 **element** 的 **js** 和 **css** 被拆分了出来，还拆分了**公共库**，如 **vue/vuex/axios** 这类第三方依赖包

### vuex

如果创建项目的时候，选择了 **vuex**，那么默认会在 **src** 目录下有一个 **store.js** 作为仓库文件。先看下默认代码

```js
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {}
})
```

先划分出 **app** 和 **user** 两个模块，在 **src** 下新建 **store** 文件夹，把 **src** 下的 **store.js** 的代码复制到 **store** 文件夹下的 **index.js** 中，并把 **store.js** 删除，按照下图来创建

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190118203143.png)

在 index.js 中将模块引入，并导出，这样做就是将模块拆分，每个模块负责各自的功能，再统一引入、导出

```js
import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app
  },
  getters
})

export default store
```

**app** 可以用来存储全局的应用状态，比如 element ui 中的全局组件 size；

**user** 用来存储当前用户的信息，**Cookie**、**SessionStorage**、**LocalStorage** 都可以，这里使用的是 **js-cookie**

### beforeEach 路由守卫

**vue-router** 提供了非常方便的钩子，可以让我们在做路由跳转的时候做一些操作，比如常见的**权限验证**。

安装 **js-cookie** 依赖

```bash
npm i js-cookie
```

首先，需要在 **src/utils/** 下创建 **auth.js**，用于存储 **token**

```js
import Cookies from 'js-cookie'
const TokenKey = 'token'
export function getToken() {
  return Cookies.get(TokenKey)
}
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
export function removeToken() {
  return Cookies.remove(TokenKey)
}
```

在 **store/modules/user.js** 中可以这样写

```js
import { login } from 'api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken()
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo.userName, userInfo.password)
          .then(response => {
            const data = response.data
            setToken(data.token)
            // 将 token 存入 vuex 的 state 中
            commit('SET_TOKEN', data.token)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
```

安装进度条插件 **nprogress**

```bash
npm i nprogress
```

在 **src/utils/** 下创建 **permission.js**:

```js
import router from '@/router'
import { getToken } from './auth' // 引入 token
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
import { Message } from 'element-ui'
const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  // 通过 token 来做拦截
  if (getToken()) {
    if (to.path === '/login') {
      next({
        path: '/'
      })
      NProgress.done()
    } else {
      next()
    }
  } else {
    // 判断要进的路由是否在不重定向的白名单内
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})
router.afterEach(() => {
  NProgress.done() // 结束Progress
})
```

### nginx 部署

先下载 **nginx**，点击 👉[传送门](https://nginx.org/)

解压完如下：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190118222259.png)

新建一个文件夹 **vue-cli3**，名字随便取，但是要**记住，后面要用到**

运行打包命令

```bash
npm run build
```

将工程里的 **dist** 目录下的所有文件复制到 **nginx** 里的 **vue-cli3** 中

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190118222340.png)

接着就是去配置 **config** 文件

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190118222635.png)

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190118222617.png)

这里监听的是 **80** 端口，把 **server** 这一大段拷贝出来，**listen** 设置 **8080** 端口，项目路径设置成 **vue-cli3** ，就是之前存放 **vue** 打包项目的地方，删除多余无用的信息

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190118222507.png)

之后运行 **nginx.exe** 文件，访问 **http://localhost:8080**

如果出现了以下界面，则表示部署成功

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190118222840.png)

## CDN、Gzip 优化

### 使用 CDN 减少文件打包体积

在 **vue.config.js** 中配置

```js
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, './', dir)
}

// cdn 预加载使用
const externals = {
  vue: 'Vue',
  'vue-router': 'VueRouter',
  vuex: 'Vuex',
  axios: 'axios',
  'element-ui': 'ELEMENT',
  'js-cookie': 'Cookies',
  nprogress: 'NProgress'
}

const cdn = {
  // 开发环境
  dev: {
    css: [
      'https://unpkg.com/element-ui/lib/theme-chalk/index.css',
      'https://cdn.bootcss.com/nprogress/0.2.0/nprogress.min.css'
    ],
    js: []
  },
  // 生产环境
  build: {
    css: [
      'https://unpkg.com/element-ui/lib/theme-chalk/index.css',
      'https://cdn.bootcss.com/nprogress/0.2.0/nprogress.min.css'
    ],
    js: [
      'https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.min.js',
      'https://cdn.jsdelivr.net/npm/vue-router@3.0.1/dist/vue-router.min.js',
      'https://cdn.jsdelivr.net/npm/vuex@3.0.1/dist/vuex.min.js',
      'https://cdn.jsdelivr.net/npm/axios@0.18.0/dist/axios.min.js',
      'https://unpkg.com/element-ui/lib/index.js',
      'https://cdn.bootcss.com/js-cookie/2.2.0/js.cookie.min.js',
      'https://cdn.bootcss.com/nprogress/0.2.0/nprogress.min.js'
    ]
  }
}

module.exports = {
  chainWebpack: config => {
    // 配置别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('api', resolve('src/api'))
      .set('static', resolve('src/static'))

    // 这里是对环境的配置，不同环境对应不同的 BASE_API，以便 axios 的请求地址不同
    config.plugin('define').tap(args => {
      const argv = process.argv
      const mode = argv[argv.indexOf('--project-mode') + 1]
      args[0]['process.env'].MODE = `"${mode}"`
      switch (args[0]['process.env'].MODE) {
        case '"test"':
          args[0]['process.env'].BASE_API = '"/test"'
          break
        case '"dev"':
          args[0]['process.env'].BASE_API = '"/api"'
          break
      }
      return args
    })

    /**
     * 添加 CDN 参数到 htmlWebpackPlugin 配置中，详见 public/index.html 修改
     */
    config.plugin('html').tap(args => {
      if (process.env.NODE_ENV === 'production') {
        args[0].cdn = cdn.build
      }
      if (process.env.NODE_ENV === 'development') {
        args[0].cdn = cdn.dev
      }
      return args
    })

    // svg loader
    const svgRule = config.module.rule('svg') // 找到 svg-loader
    svgRule.uses.clear() // 清除已有的 loader, 如果不这样做会添加在此loader之后
    svgRule.exclude.add(/node_modules/) // 正则匹配排除 node_modules 目录
    svgRule // 添加 svg 新的 loader 处理
      .test(/\.svg$/)
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })

    // 修改 images loader 添加 svg 处理
    const imagesRule = config.module.rule('images')
    imagesRule.exclude.add(resolve('src/icons'))
    config.module.rule('images').test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)

    // 使用 webpack4 新特性来拆分代码
    config.optimization.splitChunks({
      chunks: 'all',
      cacheGroups: {
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial' // 只打包初始时依赖的第三方
        },
        elementUI: {
          name: 'chunk-elementUI', // 单独将 elementUI 拆包
          priority: 20, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
          test: /[\\/]node_modules[\\/]element-ui[\\/]/
        },
        commons: {
          name: 'chunk-commons',
          test: resolve('src/components'), // 可自定义拓展你的规则
          minChunks: 3, // 最小公用次数
          priority: 5,
          reuseExistingChunk: true
        }
      }
    })
    config.optimization.runtimeChunk('single')
  },

  // 修改 webpack config, 使其不打包 externals 下的资源
  configureWebpack: () => {
    const myConfig = {}
    if (process.env.NODE_ENV === 'production') {
      // 1. 生产环境 npm 包转 CDN
      myConfig.externals = externals
    }
    if (process.env.NODE_ENV === 'development') {
      /**
       * 关闭 host check，方便使用 ngrok 之类的内网转发工具
       */
      myConfig.devServer = {
        disableHostCheck: true,
        hot: true,
        port: 8081, // 端口号
        host: '0.0.0.0',
        https: false,
        open: false, // 是否自动启动浏览器
        compress: true, // 是否启用 gzip 压缩
        // 代理跨域
        proxy: {
          '/api': {
            target: 'http://10.18.72.30:20080/',
            ws: true,
            changeOrigin: true,
            pathRewrite: {
              '^/api': ''
            }
          }
        }
      }
    }
    return myConfig
  }
}
```

在 pubilc/index.html 中修改

```html
<!-- public/index.html -->
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <link rel="icon" href="<%= BASE_URL %>favicon.ico" />

    <!-- 使用CDN加速的CSS文件，配置在vue.config.js下 -->
    <% for (var i in
    htmlWebpackPlugin.options.cdn&&htmlWebpackPlugin.options.cdn.css) { %>
    <link
      href="<%= htmlWebpackPlugin.options.cdn.css[i] %>"
      rel="preload"
      as="style"
    />
    <link href="<%= htmlWebpackPlugin.options.cdn.css[i] %>" rel="stylesheet" />
    <% } %>

    <!-- 使用CDN加速的JS文件，配置在vue.config.js下 -->
    <% for (var i in
    htmlWebpackPlugin.options.cdn&&htmlWebpackPlugin.options.cdn.js) { %>
    <link
      href="<%= htmlWebpackPlugin.options.cdn.js[i] %>"
      rel="preload"
      as="script"
    />
    <% } %>

    <title>vue-cli3-learn</title>
  </head>

  <body>
    <noscript>
      <strong
        >We're sorry but vue-project-demo doesn't work properly without
        JavaScript enabled. Please enable it to continue.</strong
      >
    </noscript>
    <div id="app"></div>
    <!-- 使用CDN加速的JS文件，配置在vue.config.js下 -->
    <% for (var i in
    htmlWebpackPlugin.options.cdn&&htmlWebpackPlugin.options.cdn.js) { %>
    <script src="<%= htmlWebpackPlugin.options.cdn.js[i] %>"></script>
    <% } %>
    <!-- built files will be auto injected -->
  </body>
</html>
```

最后去除 **main.js**  中引入的 `import 'element-ui/lib/theme-chalk/index.css'`

再打包一次

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190118224309.png)

使用 cdn 之前的体积是 967kb

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190118224328.png)

使用 cdn 以后

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190118224341.png)

体积减小了 **3.5** 倍

:::warning 注意！
使用 CDN 要慎重，如果项目部署在局域网或者**网络很不好**的地方，使用 CDN 就踩坑了
:::

### 使用 Gzip 加速

引入 **compression-webpack-plugin**

点击 👉[传送门](https://www.webpackjs.com/plugins/compression-webpack-plugin/)

```bash
npm i -D compression-webpack-plugin
```

修改 **vue.config.js** 配置

```js
const path = require('path')

// 引入开启 Gzip 的插件
const CompressionWebpackPlugin = require('compression-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, './', dir)
}

// cdn 预加载使用
const externals = {
  vue: 'Vue',
  'vue-router': 'VueRouter',
  vuex: 'Vuex',
  axios: 'axios',
  'element-ui': 'ELEMENT',
  'js-cookie': 'Cookies',
  nprogress: 'NProgress'
}

const cdn = {
  // 开发环境
  dev: {
    css: [
      'https://unpkg.com/element-ui/lib/theme-chalk/index.css',
      'https://cdn.bootcss.com/nprogress/0.2.0/nprogress.min.css'
    ],
    js: []
  },
  // 生产环境
  build: {
    css: [
      'https://unpkg.com/element-ui/lib/theme-chalk/index.css',
      'https://cdn.bootcss.com/nprogress/0.2.0/nprogress.min.css'
    ],
    js: [
      'https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.min.js',
      'https://cdn.jsdelivr.net/npm/vue-router@3.0.1/dist/vue-router.min.js',
      'https://cdn.jsdelivr.net/npm/vuex@3.0.1/dist/vuex.min.js',
      'https://cdn.jsdelivr.net/npm/axios@0.18.0/dist/axios.min.js',
      'https://unpkg.com/element-ui/lib/index.js',
      'https://cdn.bootcss.com/js-cookie/2.2.0/js.cookie.min.js',
      'https://cdn.bootcss.com/nprogress/0.2.0/nprogress.min.js'
    ]
  }
}

// 是否使用 gzip
const productionGzip = true
// 需要 gzip 压缩的文件后缀
const productionGzipExtensions = ['js', 'css']

module.exports = {
  chainWebpack: config => {
    // 配置别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('api', resolve('src/api'))
      .set('static', resolve('src/static'))

    // 这里是对环境的配置，不同环境对应不同的 BASE_API，以便 axios 的请求地址不同
    config.plugin('define').tap(args => {
      const argv = process.argv
      const mode = argv[argv.indexOf('--project-mode') + 1]
      args[0]['process.env'].MODE = `"${mode}"`
      switch (args[0]['process.env'].MODE) {
        case '"test"':
          args[0]['process.env'].BASE_API = '"/test"'
          break
        case '"dev"':
          args[0]['process.env'].BASE_API = '"/api"'
          break
      }
      return args
    })

    /**
     * 添加 CDN 参数到 htmlWebpackPlugin 配置中，详见 public/index.html 修改
     */
    config.plugin('html').tap(args => {
      if (process.env.NODE_ENV === 'production') {
        args[0].cdn = cdn.build
      }
      if (process.env.NODE_ENV === 'development') {
        args[0].cdn = cdn.dev
      }
      return args
    })

    // svg loader
    const svgRule = config.module.rule('svg') // 找到 svg-loader
    svgRule.uses.clear() // 清除已有的 loader, 如果不这样做会添加在此loader之后
    svgRule.exclude.add(/node_modules/) // 正则匹配排除 node_modules 目录
    svgRule // 添加 svg 新的 loader 处理
      .test(/\.svg$/)
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })

    // 修改 images loader 添加 svg 处理
    const imagesRule = config.module.rule('images')
    imagesRule.exclude.add(resolve('src/icons'))
    config.module.rule('images').test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)

    // 使用 webpack4 新特性来拆分代码
    config.optimization.splitChunks({
      chunks: 'all',
      cacheGroups: {
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial' // 只打包初始时依赖的第三方
        },
        elementUI: {
          name: 'chunk-elementUI', // 单独将 elementUI 拆包
          priority: 20, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
          test: /[\\/]node_modules[\\/]element-ui[\\/]/
        },
        commons: {
          name: 'chunk-commons',
          test: resolve('src/components'), // 可自定义拓展你的规则
          minChunks: 3, // 最小公用次数
          priority: 5,
          reuseExistingChunk: true
        }
      }
    })
    config.optimization.runtimeChunk('single')
  },

  // 修改 webpack config, 使其不打包 externals 下的资源
  configureWebpack: () => {
    const myConfig = {}
    if (process.env.NODE_ENV === 'production') {
      // 1. 生产环境 npm 包转 CDN
      myConfig.externals = externals

      myConfig.plugins = []
      // 2. 构建时开启 gzip，降低服务器压缩对 CPU 资源的占用，服务器也要相应开启 gzip
      productionGzip &&
        myConfig.plugins.push(
          new CompressionWebpackPlugin({
            test: new RegExp(
              '\\.(' + productionGzipExtensions.join('|') + ')$' // 处理所有匹配此 {RegExp} 的资源
            ),
            threshold: 1024, // 1k, 只处理比这个值大的资源。按字节计算
            minRatio: 0.8 // 只有压缩后的压缩率比这个值小的资源才会被处理
          })
        )
    }
    if (process.env.NODE_ENV === 'development') {
      /**
       * 关闭 host check，方便使用 ngrok 之类的内网转发工具
       */
      myConfig.devServer = {
        disableHostCheck: true,
        hot: true,
        port: 8081, // 端口号
        host: '0.0.0.0',
        https: false,
        open: false, // 是否自动启动浏览器
        compress: true, // 是否启用 gzip 压缩
        // 代理跨域
        proxy: {
          '/api': {
            target: 'http://10.18.72.30:20080/',
            ws: true,
            changeOrigin: true,
            pathRewrite: {
              '^/api': ''
            }
          }
        }
      }
    }
    return myConfig
  }
}
```

再次打包，会发现 dist/ 下超过 1k 的 **.js** 和 **.css** 会多出一个 **.js.gz**、**.css.gz** 的文件

这个 1K 是我们自己设置的

**CompressionWebpackPlugin** 插件中有一个属性是 **threshold**

| 选项      | 描述                                         | 示例              |
| --------- | -------------------------------------------- | ----------------- |
| test      | 匹配文件                                     | /\.js(\?.\*)?\$/i |
| threshold | 只处理大于此大小的资源，按字节计算           | threshold: 1024   |
| minRatio  | 只有压缩后的压缩率比这个值小的资源才会被处理 | minRatio: 0.8     |

具体配置详情见[官网](https://webpack.js.org/plugins/compression-webpack-plugin/#src/components/Sidebar/Sidebar.jsx)

在 **dist** 中可以看到，**.gz** 就是我们需要的 **gzip** 压缩文件

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190118224803.png)

本地压缩好了 Gzip 还**不够**，要将 **nginx** 中的**配置开启**才行

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190118224822.png)

```xml
gzip on; // 开启 gzip
gzip_static on;
gzip_min_length 1024; // 超过这个值的都压缩，按字节计算，这里就是 1k
gzip_buffers 4 16k;
gzip_comp_level 6; // 压缩的等级
gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php application/vnd.ms-fontobject font/ttf font/opentype font/x-woff image/svg+xml;
gzip_vary off; gzip_disable "MSIE [1-6]\.";
```

配置完**重启 nginx**：

**windows** 下通过命令行，进入到 nginx 目录下，使用 `nginx.exe -s reload` 就重启完成了

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190118224853.png)

开启成功

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190118224901.png)

:::tip
其实不使用 **CompressionWebpackPlugin** 插件，直接在 **nginx** 中开启 **gzip** 也是可以的，但是会消耗服务器的 CPU 资源
:::

## 第三方 webpack 插件使用

### size-plugin 插件

导入  [size-plugin](https://github.com/GoogleChromeLabs/size-plugin)  插件，使得在构建应用之时，可打印 Webpack 资产的 gzip 大小，以及自上次构建以来的变更。
安装

```bash
npm i -D size-plugin
```

在 vue.config.js 中引入并配置

```js
const path = require('path')
const SizePlugin = require('size-plugin')

// 引入开启 Gzip 的插件
const CompressionWebpackPlugin = require('compression-webpack-plugin')

// 只在生产环境下调用 size-plugin 插件
const isProductionEnvFlag = process.env.NODE_ENV === 'production'

function resolve(dir) {
  return path.join(__dirname, './', dir)
}

// cdn预加载使用
const externals = {
  vue: 'Vue',
  'vue-router': 'VueRouter',
  vuex: 'Vuex',
  axios: 'axios',
  'element-ui': 'ELEMENT',
  'js-cookie': 'Cookies',
  nprogress: 'NProgress'
}

const cdn = {
  // 开发环境
  dev: {
    css: [
      'https://unpkg.com/element-ui/lib/theme-chalk/index.css',
      'https://cdn.bootcss.com/nprogress/0.2.0/nprogress.min.css'
    ],
    js: []
  },
  // 生产环境
  build: {
    css: [
      'https://unpkg.com/element-ui/lib/theme-chalk/index.css',
      'https://cdn.bootcss.com/nprogress/0.2.0/nprogress.min.css'
    ],
    js: [
      'https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.min.js',
      'https://cdn.jsdelivr.net/npm/vue-router@3.0.1/dist/vue-router.min.js',
      'https://cdn.jsdelivr.net/npm/vuex@3.0.1/dist/vuex.min.js',
      'https://cdn.jsdelivr.net/npm/axios@0.18.0/dist/axios.min.js',
      'https://unpkg.com/element-ui/lib/index.js',
      'https://cdn.bootcss.com/js-cookie/2.2.0/js.cookie.min.js',
      'https://cdn.bootcss.com/nprogress/0.2.0/nprogress.min.js'
    ]
  }
}

// 是否使用gzip
const productionGzip = true
// 需要gzip压缩的文件后缀
const productionGzipExtensions = ['js', 'css']

module.exports = {
  chainWebpack: config => {
    // 配置别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('api', resolve('src/api'))
      .set('static', resolve('src/static'))

    // 这里是对环境的配置，不同环境对应不同的 BASE_API，以便 axios 的请求地址不同
    config.plugin('define').tap(args => {
      const argv = process.argv
      const mode = argv[argv.indexOf('--project-mode') + 1]
      args[0]['process.env'].MODE = `"${mode}"`
      switch (args[0]['process.env'].MODE) {
        case '"test"':
          args[0]['process.env'].BASE_API = '"/test"'
          break
        case '"dev"':
          args[0]['process.env'].BASE_API = '"/api"'
          break
      }
      return args
    })

    /**
     * 添加 CDN 参数到 htmlWebpackPlugin 配置中，详见 public/index.html 修改
     */
    config.plugin('html').tap(args => {
      if (process.env.NODE_ENV === 'production') {
        args[0].cdn = cdn.build
      }
      if (process.env.NODE_ENV === 'development') {
        args[0].cdn = cdn.dev
      }
      return args
    })

    // svg loader
    const svgRule = config.module.rule('svg') // 找到 svg-loader
    svgRule.uses.clear() // 清除已有的 loader, 如果不这样做会添加在此loader之后
    svgRule.exclude.add(/node_modules/) // 正则匹配排除 node_modules 目录
    svgRule // 添加 svg 新的 loader 处理
      .test(/\.svg$/)
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })

    // 修改 images loader 添加 svg 处理
    const imagesRule = config.module.rule('images')
    imagesRule.exclude.add(resolve('src/icons'))
    config.module.rule('images').test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)

    // 使用 webpack4 新特性来拆分代码
    config.optimization.splitChunks({
      chunks: 'all',
      cacheGroups: {
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial' // 只打包初始时依赖的第三方
        },
        elementUI: {
          name: 'chunk-elementUI', // 单独将 elementUI 拆包
          priority: 20, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
          test: /[\\/]node_modules[\\/]element-ui[\\/]/
        },
        commons: {
          name: 'chunk-commons',
          test: resolve('src/components'), // 可自定义拓展你的规则
          minChunks: 3, // 最小公用次数
          priority: 5,
          reuseExistingChunk: true
        }
      }
    })
    config.optimization.runtimeChunk('single')
  },

  // 修改 webpack config, 使其不打包 externals 下的资源
  configureWebpack: () => {
    const myConfig = {}
    if (process.env.NODE_ENV === 'production') {
      // 1. 生产环境 npm 包转 CDN
      myConfig.externals = externals

      myConfig.plugins = []
      // 2. 构建时开启gzip，降低服务器压缩对CPU资源的占用，服务器也要相应开启gzip
      productionGzip &&
        myConfig.plugins.push(
          new CompressionWebpackPlugin({
            test: new RegExp(
              '\\.(' + productionGzipExtensions.join('|') + ')$' // 处理所有匹配此 {RegExp} 的资源
            ),
            threshold: 1024, // 1k, 只处理比这个值大的资源。按字节计算
            minRatio: 0.8 // 只有压缩率比这个值小的资源才会被处理
          })
        )

      // 配置 size-plugin 插件
      myConfig.plugins.push(isProductionEnvFlag ? new SizePlugin() : () => {})
    }
    if (process.env.NODE_ENV === 'development') {
      /**
       * 关闭 host check，方便使用 ngrok 之类的内网转发工具
       * 配置跨域
       */
      myConfig.devServer = {
        disableHostCheck: true,
        hot: true,
        port: 8081, // 端口号
        host: '0.0.0.0',
        https: false,
        open: false, // 是否自动启动浏览器
        compress: true, // 是否启用 gzip 压缩
        // 代理跨域
        proxy: {
          '/api': {
            target: 'http://10.18.72.30:20080/',
            ws: true,
            changeOrigin: true,
            pathRewrite: {
              '^/api': ''
            }
          }
        }
      }
    }
    return myConfig
  }
}
```

打包后可以看到 gzip 体积的变化

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190118225344.png)
