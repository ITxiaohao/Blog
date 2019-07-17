---
title: "tag 使用"
permalink: "git-tag"
---

- 新建一个 tag，默认会打在最新提交的 commit 上

```bash
git tag <tag name>
```

- 查看本地 tag

```bash
git tag -l
```

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190130212216.png)

- 删除本地 tag

```bash
git tag -d <tag name>
```

- 推送到远程仓库

```bash
git push origin <tag name>
```

- 实战

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190130211907.png)

推送完后可以去 **github** 上看看效果

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190130212451.png)

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190130212520.png)

- 点击对应的 **tag** 进行更详细的编辑

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190130212646.png)

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190130213009.png)

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190130213137.png)

- 查看远程 tag

```bash
git ls-remote --tags origin
```

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190130212005.png)

- 删除远程 tag

```bash
git push origin :<tag name>
```
