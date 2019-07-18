---
title: "Nginx"
permalink: "server-nginx"
---

## 基本命令

Windows 下 Nginx 的基本命令

```bash
# 启动
start nginx 或 nginx.exe

# 停止
nginx.exe -s stop 或 nginx.exe -s quit # stop 是快速停止 nginx，可能不会保存相关信息，quit 是有序的停止 nginx，会保存信息

# 重启
nginx.exe -s reload # 替换静态资源不需要重启，只有修改 nginx config 才需要重启

# 重新打开日志文件
nginx.exe -s reopen

# 查看版本
nginx.exe -v
```

## 静态资源配置

这里以 Vue 项目为例

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/nginx/20190717142614.png)

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/nginx/20190717142651.png)

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/nginx/20190717142754.png)

## 开启跨越

配置前缀路径，当请求路径包含前缀的时候被 nginx 转发到 proxy_pass 里配置的后端服务地址

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/nginx/20190717143027.png)

## 开启 Gzip 压缩

nginx 默认是关闭 Gzip，

```xml
# 开启和关闭gzip模式
gzip on;
# gizp 压缩起点，文件大于 1k 才进行压缩
gzip_min_length 1k;
# gzip 压缩级别，1-9，数字越大压缩的越好，也越占用 CPU
gzip_comp_level 6;
# 进行压缩的文件类型。
gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php application/vnd.ms-fontobject font/ttf font/opentype;
# nginx 对于静态文件的处理模块，开启后会寻找以 .gz 结尾的文件，直接返回，不会占用cpu 进行压缩，如果找不到则进行压缩
gzip_static on
# 是否在 http header 中添加 Vary: Accept-Encoding，建议开启
gzip_vary on;
# 设置gzip压缩针对的HTTP协议版本
gzip_http_version 1.1;
```

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/nginx/20190717143520.png)

## 405 报错

仔细看看是不是后台代理没写好，最好和 Vue 里面配置的跨域地址一样，少一个斜杠多一个斜杠都会匹配不到，例如一下这四种情况，具体怎么配置根据实际项目来：

```xml
location /api {
    proxy_pass http://192.168.65.74:8888;
}

location /api/ {
    proxy_pass http://192.168.65.74:8888;
}

location /api {
    proxy_pass http://192.168.65.74:8888/;
}

location /api/ {
    proxy_pass http://192.168.65.74:8888/;
}
```

## 无外网环境下配置域名地址会报错

如果 nginx.conf 文件里配置的跨域地址是域名地址，而服务器却不能访问外网，则 nginx 启动不起来，会报错

## 上传文件超过 1M 报错

上传到后台的文件超过 1M 的时候，客户端文件无法正常上传

解决方案：

修改跨域到后端的配置

```xml
location /api {
    proxy_pass http://192.168.65.74:8888;
    client_max_body_size    10m; # 表示最大上传10M，需要多大设置多大
}
```

## 页面缓存

一般缓存是针对不常发生变化的内容来做的缓存，比如图片，如果每次访问都请求加载很多图片资源的话，是非常浪费服务器资源的

由于浏览器缓存静态文件的时间不可控，可以在 nginx 上自己配置 expires 1M（1 个月）

```xml
location ~* \.(gif|jpg|jpeg|png|css|js|ico|eot|otf|fon|font|ttf|ttwoff|woff2)$ {
    root /vue;
    expires 1M;
}
```

该配置表示：所有在 /vue 目录下的以.jpg、.png、.gif、.jpeg 为后缀 (不区分大小写) 的文件缓存 1 个月。

## windows 下设置成服务并开机启动

载 Windows Service Wrapper 工具

https://github.com/kohsuke/winsw

下载这个版本的文件 WinSW.NET4.exe

将 Nginx 转换为 Windows 服务，这样就可以在开机时自动启动 Nginx 了

下载后将该工具放入 Nginx 的安装目录下，并且将其重命名为 nginx-service.exe ，在该目录下新建 nginx-service.xml 文件，写入配置信息，配置好了之后就可以通过这个将 Nginx 注册为 Windows 服务。

```xml
<!-- nginx-service.xml -->
<service>
    <id>nginx</id>
    <name>nginx</name>
    <description>nginx</description>
    <logpath>D:\nginx-app\nginx-1.12.2</logpath>
    <logmode>roll</logmode>
    <depend></depend>
    <executable>D:\nginx-app\nginx-1.12.2\nginx.exe</executable>
    <stopexecutable>D:\nginx-app\nginx-1.12.2\nginx.exe -s stop</stopexecutable>
</service>
```

将上面配置的路径改为实际 nginx 路径即可

如果报错：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/nginx/20190717145359.png)

解决方案：

微软官网下载 https://www.microsoft.com/zh-CN/download/confirmation.aspx?id=48137

以上内容配置好了之后，在 nginx 安装目录下以管理员运行命令：.\nginx-service.exe install 就成功将其注册为 Windows 服务了，然后运行 .\nginx-service.exe start 启动服务。这时我们可以在 Windows 任务管理器的服务中查看该是否成功启动。

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/nginx/20190717145451.png)

```bash
nginx-service.exe install # 命令可注册对应的系统服务
nginx-service.exe uninstall # 命令可删除对应的系统服务
nginx-service.exe stop # 命令可停止对应的系统服务
nginx-service.exe start # 命令可启动对应的系统服务
```
