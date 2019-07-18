---
title: "Jenkins"
permalink: "server-jenkins"
---

Jenkins 是一个独立的开源自动化服务器，可用于自动执行与构建，测试，交付或部署软件相关的各种任务。

Jenkins 可以通过本机系统软件包，Docker 安装，甚至可以由安装了 Java Runtime Environment（JRE）的任何机器独立运行

## Windows 下安装

首先确保系统中有安装过 **Java8**，👉[传送门](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)

在官网下载 **windows** 安装包，👉[传送门](https://jenkins.io/download/)

安装完会自动跳转到 http://localhost:8080/login?from=%2F 该路径下

由于 **8080** 端口十分常用，容易造成端口冲突，这里我们先修改 Jenkins 的默认端口

- 打开任务管理器，关闭服务

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/20190119154803.png)

- 找到 **Jenkins** 的安装目录下，找到 **Jenkins.xml** 文件

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/%E6%9B%B4%E6%94%B9Jenkins%E7%AB%AF%E5%8F%A3.png)

- 访问你更改端口后的页面 localhost:**9080**/login?from=%2F

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/20190119154846.png)

- 需要管理员密码才能登录，在 Jenkins 根目录下找到文件，并复制密码

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/20190119154859.png)

- 点击继续后安装插件

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/20190119154914.png)

- 选择左边的推荐安装

:::danger 安装失败报错
Jenkins An error occurred during installation: No such plugin: cloudbees-folder 
:::

上面的错误显示是，安装插件 **cloudbees-folder** 失败，是因为 **Jenkins.war** 里没有 **cloudbees-folder** 插件

需要去网上下载该插件，👉[传送门](http://ftp.icm.edu.pl/packages/jenkins/plugins/cloudbees-folder/)

下载  **cloudbees-folder.hpi**  放在 **jenkins-2.150.2\war\WEB-INF\detached-plugins**  即可

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/20190119154925.png)

**重启 Jenkins 服务**

再访问 **http://localhost:9080/login?from=%2F** 登录后安装插件

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/20190119154953.png)

安装插件完之后,输入用户密码，也可以使用 admin 继续

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190119154513.png)

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/20190119155432.png)

- **保存**

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/20190119155512.png)

:::danger
这里我第一次打开网页是空白的，暂时不知道是什么原因，**重启服务后正常**。
:::

回到登录页，账号我这里选的是 admin ，**密码就是前面那个文件里的密码**

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/20190119155613.png)

可以在**系统管理**里面添加用户

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/20190119155650.png)

## 开始配置 Jenkins

### 安装 Node 插件

如果是跑其他项目就要装对应的插件

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/20190119162228.png)

:::danger 安装失败
原因是插件源地址访问不到，解析错误
:::

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/20190119162817.png)

- 更改下载源，在 Advanced 的选项中更新站点：**http://mirror.esuni.jp/jenkins/updates/update-center.json**

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/%E6%9B%B4%E6%96%B0%E7%AB%99%E7%82%B9.png)

- 安装成功

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/20190119163053.png)

### 配置 NodeJS

- 在**系统设置**中选择**全局工具配置**

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/%E9%85%8D%E7%BD%AEnode.png)

- 选择版本并保存

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/%E9%80%89%E6%8B%A9%E7%89%88%E6%9C%AC.png)

### 配置 Github

- 在 Github 上的项目中设置

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/github1.png)

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/20190119164708.png)

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/20190119164755.png)

- 生成 **Personal access tokens**

**Jenkins** 访问 GitHub 工程的时候，有的操作是需要**授权**的，所以我们要在 GitHub 上生成**授权的 token** 给 Jenkins 使用，这就是 **Personal access tokens**，生成步骤如下：

1. 登录 GitHub，进入在 「Settings」 页面，点击左下角的 「Developer settings」，如下图：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/20190119165057.png)

2. 跳转到「Developer settings」页面后，点击左下角的 「Personal access tokens」，如下图：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/%E7%94%9F%E6%88%90token.png)

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/20190119165444.png)

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/20190119170731.png)

:::warning
生成后的 token 一定要保存，之后再想看是看不到的，只能重新生成
:::

回到 Jenkins 中

3. 在 「系统管理 -> 管理插件」位置检查 GitHub Plugin 插件是否已经安装，没有的话请先安装

4. 配置 GitHub，点击「系统管理 -> 系统设置」，如下图：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/20190119171033.png)

找到 GitHub 服务器并添加

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/20190119171136.png)

在系统设置页面找到 「GitHub」，配置一个「GitHub Server」，如下图，「API URL」 填写「https://api.github.com」，「Credentials」 位置如下图红框所示，选择「Add->Jenkins」：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/20190119171249.png)

弹出的页面中，「类型」 选择「Secret text」

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/20190119171331.png)

**Secret** 中填入前面在 GitHub 上生成的 **Personal access tokens**，Description 随便写一些描述信息，如下图

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/20190119171349.png)

填写完毕后，点击右侧的「测试连接」按钮，如果信息没有填错，显示的内容如下图所示：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/20190119171408.png)

**没有错的话记得保存配置**

## 构建项目

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/20190119172450.png)

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/20190119172600.png)

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/20190119172619.png)

源代码管理选择 Git

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/20190119225622.png)

选择刚刚配置的 github 上的远程仓库，以及配置用户名和密码

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/20190119225824.png)

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/20190119225849.png)

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/20190119225912.png)

构建触发器

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/20190119225934.png)

构建环境

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/20190119230041.png)

部署之前需要对项目进行构建，在**构建环境**配置项可以指定项目的构建环境（编译方式）。

**Vue** 项目基于 **Node** 进行包管理，编译使用 **webpack** 进行打包，那么选中 **Node** 驱动项，指定 **Node** 版本（如果服务器上安装了多个 **Node** 版本）

保存完，就可以开启构建

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/20190119230221.png)

点击详情可以看到结果

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/20190119230329.png)

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/20190119230315.png)

这个时候我们提交一次代码

提交代码成功后，**Jenkins** 会自动去拉取 **Github** 上的源码，来重新构建项目

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/20190119230427.png)

可以看到我们提交到 **Github** 的 **message**

在 **Workspace** 里可以看到具体的项目列表

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/20190119230521.png)

**Jenkins + github 自动构建化完成！！！**

## 配合 nginx 进行自动化部署

因为我们现在是在 **windows** 环境下安装 **Jenkins**，这里选择运行 **windows** 的命令

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/20190119230634.png)

添加命令，分成了多次执行，**确保**中途不会终止

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/20190119230801.png)

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/20190119230925.png)

最关键的就是最后这行命令，将 **Jenkins** 项目中打包后的文件全部复制到 **nginx** 对应的文件中

```bash
xcopy /y /e "C:\Program Files (x86)\Jenkins\workspace\vue-cli3\dist" "C:\Users\Administrator\Desktop\nginx-Jenkins\nginx-1.14.2\vue-cli3"
```

这里要用 **nginx** 代理对应的文件，如：这里我是将 Jenkins 工作区的 vue-cli3 下的 dist 复制出来，vue-cli3 就是前面构建项目时的命名，复制到 nginx 中，nginx 也有一个目录是 vue-cli3

nginx 只改变静态资源是不用重启的，只有改变了 config 文件才需要重启 nginx

所以自动化部署的原理其实就是：

1. 本地写好代码，测试没问题后，发布到 github 上
2. github 接收到 push 命令后，通知你服务器上的 Jenkins
3. Jenkins 拉取 github 上的代码来进行项目构建
4. 构建完后执行你配置在项目里的 **shell** 命令，打包项目，并将打包后的文件复制到 nginx 中进行替换
5. nginx 里的静态资源变更了，项目也就部署完了

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/server/%E8%87%AA%E5%8A%A8%E5%8C%96%E9%83%A8%E7%BD%B2%E6%B5%81%E7%A8%8B%E5%9B%BE.png)

如果没有这种自动化部署的方式，平时写完代码，在本地打包，打包完后连接远程服务器，将打包完的文件替换到 nginx 对应的文件中

一两次还好，如果版本更新迭代快，每次都要去远程服务器比较麻烦，而且如果其他人也在用服务器还需要等待，使用 Jenkins 自动化的好处显而易见

## 配合 github 图床将图片同步至服务器

由于我写博客经常喜欢截图，使用 [PicGo](https://github.com/Molunerfinn/PicGo) 图床工具非常方便，将截图上传至 **github** 仓库，利用 **github** 做图床，但同时我也想备份一份，以防止 github 图床失效或者 404 等原因，我就想到利用 **Jenkins** 来自动同步相册

步骤请参考构建项目那一节，基本就只要更换一下 github 仓库地址，windows 的批处理命令都不用配置

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190317133815.png)

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190317133836.png)

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190317133848.png)

最后保存就可以了，之后立刻构建，因为图片比较多，所以第一次构建的时间比较长，因为要从 github 上 clone 代码

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190317133928.png)

第一次构建成功后就可以使用 PicGo 进行测试了，上传图片成功后，Jenkins 就自动开始构建，拉取图片了

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190317134135.png)

之后去 workspace 中查看是否同步相册成功

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190317134237.png)

相册同步成功，这下你在自己的服务器上也备份了一份相册~

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190317134210.png)

可以发现 **Jenkins** 能做的事还有很多很多，一起去挖掘吧~😄
