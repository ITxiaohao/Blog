---
title: "Promise"
permalink: "es6-promise"
---

优势：多个异步等待合并，可以解决回调地狱的问题，可以 return

Promise 是一个对象，不是一个函数，对象是可以保存状态的

Promise 有三种状态：`pending（进行中）`、`fulfilled（已成功）`和 `rejected（已失败）`

在 `new Promise` 的时候就是处于 `pending` 状态，通过 `reslove` 和 `reject` 把一个进行中的 `promise` 修改为**已成功**或者**已失败**的状态

一旦将状态修改为已成功或者已失败， **promise** 的状态就凝固了，不能再改变

```js
const promise = new Promise(function(resolve, reject) {
  // ... some code

  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});
```

当我们在构造 `Promise` 的时候，构造函数内部的代码是**立即执行**的

```js
new Promise((resolve, reject) => {
  console.log("new Promise");
  resolve("success");
});
console.log("finifsh");
// 先输出 new Promise 再输出 finifsh
```

`Promise` 实现了链式调用，也就是说每次调用 `then` 之后返回的都是一个 `Promise`，并且是一个**全新**的 `Promise`，原因也是因为状态不可变。如果你在 `then` 中 使用了 `return`，那么 `return` 的值会被 `Promise.resolve()` 包装

```js
function promiseTest(val) {
  return new Promise((reslove, reject) => {
    setTimeout(() => {
      reslove(val);
    }, 1000);
  });
}

promiseTest("JavaScript")
  .then(val => {
    console.log(val);
    return promiseTest("Vue");
  })
  .then(val => {
    console.log(val);
    return promiseTest("React");
  })
  .then(val => {
    console.log(val);
  });
```

then 方法可以传递两个函数，一个是成功后的回调函数，一个是失败后的回调

`Promise.prototype.then(onFulfilled, onRejected);`

:::warning
onFulfilled 将接收一个参数，参数值由当前 Promise 实例内部的 resolve() 方法传值决定

onRejected 将接收一个参数，参数值由当前 Promise 实例内部的 reject() 方法传值决定。
:::

```js
const p = function() {
  let num = Math.random();
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      num > 0.8 ? resolve(num) : reject(num);
    }, 1000);
  });
};

p().then(
  val => {
    console.info(`Status switches to fulfilled, and the value is ${val}`);
  },
  err => {
    console.info(`Status switches to reject, and the value is ${err}`);
  }
);
```

上面的例子是创建一个随机数，如果大于 0.8 则返回 resolve() 成功，否则 reject() 失败

下面是一个用 promise 对象实现 Ajax 操作的例子

```js {8,10}
const getJSON = function(url) {
  const promise = new Promise((resolve, reject) => {
    const handler = function() {
      if (this.readyState !== 4) {
        return;
      }
      if (this.status === 200) {
        resolve(this.response);
      } else {
        reject(new Error(this.statusText));
      }
    };
    const client = new XMLHttpRequest();
    client.open("GET", url);
    client.onreadystatechange = handler;
    client.responseType = "json";
    client.setRequestHeader("Accept", "application/json");
    client.send();
  });

  return promise;
};

getJSON("/posts.json").then(
  function(json) {
    console.log("Contents: " + json);
  },
  function(error) {
    console.error("出错了", error);
  }
);
```

`Promise` 通过链式调用很好地解决了回调地狱的问题

`Promise` 还有一些方法很好用

promise.all ：等待所有 promise 完成之后才会触发回调函数

```js
function promiseTest(val) {
  return new Promise((reslove, reject) => {
    setTimeout(() => {
      reslove(val);
    }, 2000);
  });
}

Promise.all([
  promiseTest("JavaScript"),
  promiseTest("Vue"),
  promiseTest("React")
]).then(val => {
  console.log(val);
});
// [ 'JavaScript', 'Vue', 'React' ]
```

在小程序中使用 promise.all 的具体实例：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190214173313.png)

接口返回的结果：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190214173345.png)

将之前 `this.setData` 绑定操作全部整合在一起

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190214174043.png)

promise 还有 `.race` 的竞争方法，当某个 promise 率先完成后就触发，放在实际请求中就是当某个请求率先完成后就触发回调函数

promise 的 catch 方法，用于指定发生错误时的回调函数

```js
getJSON("/posts.json")
  .then(function(posts) {
    // ...
  })
  .catch(function(error) {
    // 处理 getJSON 和 前一个回调函数运行时发生的错误
    console.log("发生错误！", error);
  });
```

上面代码中，`getJSON` 方法返回一个 `Promise` 对象，如果该对象状态变为 `resolved`，则会调用 `then` 方法指定的回调函数；**如果异步操作抛出错误**，状态就会变为 `rejected`，就会调用 `catch` 方法指定的回调函数，处理这个错误

将之前随机数的例子进行改造

```js
const p = function() {
  let num = Math.random();
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      num > 0.8 ? resolve(num) : reject(num);
    }, 1000);
  });
};

p()
  .then(
    val => {
      console.info(`Status switches to fulfilled, and the value is ${val}`);
    },
    err => {
      console.info(`Status switches to reject, and the value is ${err}`);
    }
  )
  .catch(err => {
    console.log("catch", err);
  });
```

如果这样写，则不会触发 catch 方法，而是返回 then 中的 err 回调

```js
const p = function() {
  let num = Math.random();
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      num > 0.8 ? resolve(num) : reject(num);
    }, 1000);
  });
};

p()
  .then(val => {
    console.info(`Status switches to fulfilled, and the value is ${val}`);
  })
  .catch(err => {
    console.log("catch", err);
  });
```

如果将 then 中的 err 回调去掉，则会被 catch 方法捕获

一般在实战中，调用后端接口的时候，如果只是一个接口，就可以使用 .then().catch() 这种方式来捕获接口报错的异常，因为全部堆在 .then() 中会把代码变得很冗余，写在 .catch() 中也比较直观

一般来说，不要在 then 方法里面定义 Reject 状态的回调函数（即 then 的第二个参数），总是使用 `catch` 方法。

```js
// bad
promise.then(
  function(data) {
    // success
  },
  function(err) {
    // error
  }
);

// good
promise
  .then(function(data) {
    //cb
    // success
  })
  .catch(function(err) {
    // error
  });
```

那么如果调用多个接口，使用到了多个 .then() 方法来处理，该怎么办？

Promise 对象的错误具有 “冒泡” 性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个 catch 语句捕获。

```js
getJSON("/post/1.json")
  .then(function(post) {
    return getJSON(post.commentURL);
  })
  .then(function(comments) {
    // some code
  })
  .catch(function(error) {
    // 处理前面三个 Promise 产生的错误
  });
```

另外，then 方法指定的回调函数，如果运行中抛出错误，也会被 catch 方法捕获。

```js
p.then(val => console.log("fulfilled:", val)).catch(err =>
  console.log("rejected", err)
);

// 等同于
p.then(val => console.log("fulfilled:", val)).then(null, err =>
  console.log("rejected:", err)
);
```

**.catch 其实是一个语法糖**

```js {2}
Promise.prototype.catch = function(fn) {
  return this.then(null, fn);
};
```

在之前的随机数例子中改造一下

```js
const p = function() {
  let num = Math.random();
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      num > 0.1 ? resolve(num) : reject(num);
    }, 1000);
  });
};

const p1 = function() {
  let num = Math.random();
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      num > 0.5 ? resolve(num) : reject(num);
    }, 2000);
  });
};

const p2 = function() {
  let num = Math.random();
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      num > 0.2 ? resolve(num) : reject(num);
    }, 3000);
  });
};

p()
  .then(val => {
    console.info(`P is fulfilled, and the value is ${val}`);
    return p1();
  })
  .then(val => {
    console.info(`P1 is fulfilled, and the value is ${val}`);
    return p2();
  })
  .then(val => {
    console.info(`P2 is fulfilled, and the value is ${val}`);
  })
  .catch(err => {
    console.log("catch", err);
  });
```

:::warning
如果第一个 then 出错，抛出错误，则会被 catch 捕获，之后第二个 then 和第三个 then 则不会执行，如果调用后端请求 API 接口也是这样，则需要谨慎测试
:::

但是 `Promise` 也有缺点，比如错误需要通过回调函数捕获，无法取消 Promise，一旦新建它就会立即执行，无法中途取消。
