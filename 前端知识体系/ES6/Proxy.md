---
title: "proxy"
permalink: "es6-proxy"
---

Proxy 是 ES6 中新增的功能，可以理解成，在目标对象之前架设一层 **「拦截」**，外界对该对象的访问，都必须先通过这层**拦截**，因此提供了一种机制，可以对外界的访问进行**过滤**和**改写**。

Proxy 这个词的原意是代理，用在这里表示由它来 **「代理」** 某些操作，可以译为 **「代理器」**

```js {4,8}
var obj = new Proxy(
  {},
  {
    get: function(target, key, receiver) {
      console.log(`getting ${key}!`);
      return Reflect.get(target, key, receiver);
    },
    set: function(target, key, value, receiver) {
      console.log(`setting ${key}!`);
      return Reflect.set(target, key, value, receiver);
    }
  }
);

obj.count = 1;
//  setting count!
++obj.count;
//  getting count!
//  setting count!
console.log(obj.count);
//  getting count!
//  2
```

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123110725.png)

往下走

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123110743.png)

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123110754.png)

**key** 表示的是要进行设置的属性

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123110805.png)

**value** 表示要设置的值

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123110816.png)

**receiver** 将 **count: 1** 设置到 **Proxy** 对象中

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123110831.png)

之后运行 `++obj.count`

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123110854.png)

要运行 **++** 之前，先要**读取**到 **obj.count** 属性的值，所以这里触发了 **get** 方法

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123110934.png)

这时的 **target** 目标对象中，**count** 的属性值为 **1**

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123110956.png)

get 方法**读取**到 count 的值之后，就执行 **++** 操作，就触发了 set 方法，同时可以发现，在 set 方法里的 value 参数从 1 变为了 2

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123111023.png)

往后走，到了 console.log ，输出 obj.count 的值，这时就触发了 get 方法，**只要读取值就会被 get 方法代理拦截**

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123111048.png)

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123111058.png)

这就是一个简单的 Proxy 代理器，上面的代码对一个空对象架设了一层拦截，重定义了属性的读取（get）和设置（set）行为，ES6 原生提供 Proxy 构造函数，用来生成 Proxy 实例。

`var proxy = new Proxy(target, handler);`

Proxy 对象的所有用法，都是上面这种形式，不同的只是 handler 参数的写法。

其中，**new Proxy()** 表示生成一个 Proxy 实例，**target** 参数表示所要拦截的**目标对象**，**handler** 参数也是一个对象，用来**定制拦截行为**。

下面是一个拦截读取属性的例子

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123111111.png)

这里我们在 get 方法中全部返回 35

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123111124.png)

> 只要是访问 proxy 对象下的属性，都会触发 get 方法拦截

所以这里访问 proxy 下的任何属性全部返回 35

:::warning
注意，要使得 Proxy 起作用，必须针对 Proxy 实例（上例是 proxy 对象）进行操作，而不是针对目标对象（上例是空对象）进行操作。

如果 handler 没有设置任何拦截，那就等同于直接通向原对象。
:::

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123111138.png)

上面代码中，**handler 是一个空对象，没有任何拦截效果**，访问 proxy 就等同于访问 target

一个技巧是将 Proxy 对象，设置到 object.proxy 属性，从而可以在 object 对象上调用

具体详情看 [ES6 入门](https://es6.ruanyifeng.com/#docs/proxy)

如果要实现一个 Vue 中的响应式，还要在 get 中做**收集依赖**，在 set 里**派发更新**

:::tip
**proxy** 可以监听到任何方式的数据改变，唯一缺陷可能就是浏览器的 **兼容性** 不好了
:::
