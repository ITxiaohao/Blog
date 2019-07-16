---
title: "二十四：编写 Bundle"
date: 2019-03-20
permalink: "webpack4-bundle"
---

[demo24 源码地址](https://github.com/ITxiaohao/webpack4-learn/tree/master/demo24)

## 模块分析

在 src 目录下新建三个文件 `word.js`、`message.js`、`index.js`，对应的代码：

```js
// word.js
export const word = "hello";

// message.js
import { word } from "./word.js";

const message = `say ${word}`;

export default message;

// index.js
import message from "./message.js";

console.log(message);
```

新建 `bundle.js`

```js
const fs = require("fs");

const moduleAnalyser = filename => {
  const content = fs.readFileSync(filename, "utf-8");
  console.log(content);
};

moduleAnalyser("./src/index.js");
```

使用 node 的 **fs** 模块，读取文件信息，并在控制台输出，这里全局安装一个插件，来显示代码高亮，`npm i cli-highlight -g`，运行 `node bundle.js | highlight`

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190326151614.png)

index.js 中的代码已经被输出到控制台上，而且代码有高亮，方便阅读，读取入口文件信息就完成了

现在我们要读取 index.js 文件中使用的 message.js 依赖，`import message from './message.js'`

安装一个第三方插件 `npm i @babel/parser`

[@babel/parser](https://babeljs.io/docs/en/babel-parser) 是 Babel 中使用的 JavaScript 解析器。

官网也提供了相应的示例代码，根据示例代码来仿照，修改我们的文件

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190327094416.png)

```js
const fs = require("fs");
const parser = require("@babel/parser");

const moduleAnalyser = filename => {
  const content = fs.readFileSync(filename, "utf-8");
  console.log(
    parser.parse(content, {
      sourceType: "module"
    })
  );
};

moduleAnalyser("./src/index.js");
```

我们使用的是 es6 的 module 语法，所以 `sourceType: 'module'`

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190327094244.png)

保存后运行，输出了 [AST (抽象语法树)](https://segmentfault.com/a/1190000016231512)，里面有一个 body 字段，我们输出这个字段

```js
const fs = require("fs");
const parser = require("@babel/parser");

const moduleAnalyser = filename => {
  const content = fs.readFileSync(filename, "utf-8");
  const ast = parser.parse(content, {
    sourceType: "module"
  });
  console.log(ast.program.body);
};

moduleAnalyser("./src/index.js");
```

打印出了两个 Node 节点，第一个节点的 type 是 **ImportDeclaration**(引入的声明)，对照我们在 index.js 中写的 `import message from './message.js'`，第二个节点的 type 是 **ExpressionStatement** (表达式的声明)，对照我们写的 `console.log(message)`

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190327101614.png)

使用 babel 来帮我们生成抽象语法树，我们再导入 `import message1 from './message1.js'` 再运行

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190327101753.png)

抽象语法树将我们的 js 代码转成了对象的形式，现在就可以遍历抽象语法树生成的节点对象中的 type，是否为 `ImportDeclaration`，就能找到代码中引入的依赖了

再借助一个工具 `npm i @babel/traverse`

```js
const fs = require("fs");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const moduleAnalyser = filename => {
  const content = fs.readFileSync(filename, "utf-8");
  const ast = parser.parse(content, {
    sourceType: "module"
  });
  traverse(ast, {
    ImportDeclaration({ node }) {
      console.log(node);
    }
  });
};

moduleAnalyser("./src/index.js");
```

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190327102638.png)

只打印了两个 **ImportDeclaration**，遍历结束，我们只需要取到依赖的文件名，在打印的内容中，每个节点都有个 `source` 属性，里面有个 `value` 字段，表示的就是文件路径及文件名

```js
const fs = require("fs");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const moduleAnalyser = filename => {
  const content = fs.readFileSync(filename, "utf-8");
  const ast = parser.parse(content, {
    sourceType: "module"
  });
  const dependencise = [];
  traverse(ast, {
    ImportDeclaration({ node }) {
      dependencise.push(node.source.value);
    }
  });
  console.log(dependencise);
};

moduleAnalyser("./src/index.js");
```

保存完重新运行，输出结果：

```md
['./message.js', './message1.js']
```

这样就对入口文件的依赖分析就分析出来了，现在把 index.js 中引入的 `message1.js` 的依赖给删除，这里有个注意点，打印出来的文件路径是**相对路径**，相对于 `src/index.js` 文件，但是我们打包的时候不能是入口文件(index.js)的相对路径，而应该是**根目录的相对路径**(或者说是**绝对路径**)，借助 node 的 api，引入一个 path

```js
const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const moduleAnalyser = filename => {
  const content = fs.readFileSync(filename, "utf-8");
  const ast = parser.parse(content, {
    sourceType: "module"
  });
  const dependencise = [];
  traverse(ast, {
    ImportDeclaration({ node }) {
      const dirname = path.dirname(filename);
      console.log(dirname);
      dependencise.push(node.source.value);
    }
  });
  // console.log(dependencise)
};

moduleAnalyser("./src/index.js");
```

输出为 `./src`，继续修改

```js
ImportDeclaration({ node }) {
  const dirname = path.dirname(filename)
  const newFile = path.join(dirname, node.source.value)
  console.log(newFile)
  dependencise.push(node.source.value)
}
```

输出为 `src\message.js`

:::warning

windows 和 类 Unix(linux/mac)，路径是有区别的。windows 是用反斜杠 \ 分割目录或者文件的，而在类 Unix 的系统中是用的 /。

:::

由于我是 windows 系统，所以这里输出为 `src\message.js`，而类 Unix 输出的为 `src/message.js`

`.\src\message.js` 这个路径是我们真正打包时要用到的路径

```bash
newFile .\src\message.js
[ '.\\src\\message.js' ]
```

既存一个相对路径，又存一个绝对路径

```js
const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const moduleAnalyser = filename => {
  const content = fs.readFileSync(filename, "utf-8");
  const ast = parser.parse(content, {
    sourceType: "module"
  });
  const dependencise = {};
  traverse(ast, {
    ImportDeclaration({ node }) {
      const dirname = path.dirname(filename);
      const newFile = ".\\" + path.join(dirname, node.source.value);
      console.log("newFile", newFile);
      dependencise[node.source.value] = newFile;
    }
  });
  console.log(dependencise);
  return {
    filename,
    dependencise
  };
};

moduleAnalyser("./src/index.js");
```

```js
newFile .\src\message.js
{ './message.js': '.\\src\\message.js' }
```

因为我们写的代码是 es6，浏览器无法识别，还是需要 babel 来做转换

`npm i @babel/core @babel/preset-env`

```js
"use strict";

var _message = _interopRequireDefault(require("./message.js"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

console.log(_message.default);
```

```js
const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const babel = require("@babel/core");

const moduleAnalyser = filename => {
  const content = fs.readFileSync(filename, "utf-8");
  const ast = parser.parse(content, {
    sourceType: "module"
  });
  const dependencise = {};
  traverse(ast, {
    ImportDeclaration({ node }) {
      const dirname = path.dirname(filename);
      const newFile = ".\\" + path.join(dirname, node.source.value);
      dependencise[node.source.value] = newFile;
    }
  });
  const { code } = babel.transformFromAst(ast, null, {
    presets: ["@babel/preset-env"]
  });
  return {
    filename,
    dependencise,
    code
  };
};

const moduleInfo = moduleAnalyser("./src/index.js");
console.log(moduleInfo);
```

分析的结果就在控制台上打印了

```bash
{ filename: './src/index.js',
  dependencise: { './message.js': '.\\src\\message.js' },
  code:
   '"use strict";\n\nvar _message = _interopRequireDefault(require("./message.js"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nconsole.log(_message.default);' }
```

目前我们只对一个模块进行分析，接下来要对整个项目进行分析，所以我们先分析了入口文件，再分析入口文件中所使用的依赖

## 依赖图谱

创建一个函数来循环依赖并生成图谱

```js
// 依赖图谱
const makeDependenciesGraph = entry => {
  const entryModule = moduleAnalyser(entry);
  const graphArray = [entryModule];
  for (let i = 0; i < graphArray.length; i++) {
    const item = graphArray[i];
    const { dependencise } = item;
    // 如果入口文件有依赖就去做循环依赖，对每一个依赖做分析
    if (dependencise) {
      for (const j in dependencise) {
        if (dependencise.hasOwnProperty(j)) {
          graphArray.push(moduleAnalyser(dependencise[j]));
        }
      }
    }
  }
  console.log("graphArray = ", graphArray);
};
```

将入口的依赖，依赖中的依赖全部都分析完放到 **graphArray** 中，控制台输出的打印结果

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190402234152.png)

可以看到 **graphArray** 中一共有三个对象，就是我们在项目中引入的三个文件，全部被分析出来了，为了方便阅读，我们创建一个 graph 对象，将分析的结果依次放入

```js
// 依赖图谱
const makeDependenciesGraph = entry => {
  const entryModule = moduleAnalyser(entry);
  const graphArray = [entryModule];
  for (let i = 0; i < graphArray.length; i++) {
    const item = graphArray[i];
    const { dependencise } = item;
    // 如果入口文件有依赖就去做循环依赖，对每一个依赖做分析
    if (dependencise) {
      for (const j in dependencise) {
        if (dependencise.hasOwnProperty(j)) {
          graphArray.push(moduleAnalyser(dependencise[j]));
        }
      }
    }
  }
  // console.log('graphArray = ', graphArray)

  // 创建一个对象，将分析后的结果放入
  const graph = {};
  graphArray.forEach(item => {
    graph[item.filename] = {
      dependencise: item.dependencise,
      code: item.code
    };
  });
  console.log("graph = ", graph);
  return graph;
};
```

输出的 **graph** 为:

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190402234116.png)

最后在 `makeDependenciesGraph` 函数中将 **graph** 返回，赋值给 **graphInfo**，输出的结果和 graph 是一样的

```js
const graghInfo = makeDependenciesGraph("./src/index.js");
console.log(graghInfo);
```

## 生成代码

现在已经拿到了所有代码生成的结果，现在我们借助 **DependenciesGraph(依赖图谱)** 来生成真正能在浏览器上运行的代码

最好放在一个大的闭包中来执行，**避免污染全局环境**

```js
const generateCode = entry => {
  // makeDependenciesGraph 返回的是一个对象，需要转换成字符串
  const graph = JSON.stringify(makeDependenciesGraph(entry));
  return `
    (function (graph) {

    })(${graph})
  `;
};

const code = generateCode("./src/index.js");
console.log(code);
```

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190402235615.png)

我这里先把输出的 graph 代码格式化了一下，可以发现在 `index.js` 用到了 `require` 方法，`message.js` 中不仅用了 `require` 方法，还用 `exports` 对象，但是在浏览器中，这些都是不存在的，如果我们直接去执行，是会报错的

```js {6}
let graph = {
  "./src/index.js": {
    dependencise: { "./message.js": ".\\src\\message.js" },
    code: `
      "use strict";\n\n
       var _message = _interopRequireDefault(require("./message.js"));\n\n
       function _interopRequireDefault(obj){ return obj && obj.__esModule ? obj : { default: obj }; } \n\n
       console.log(_message.default);
      `
  },
  ".\\src\\message.js": {
    dependencise: { "./word.js": ".\\src\\word.js" },
    code:
      '"use strict";\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\nexports.default = void 0;\n\nvar _word = require("./word.js");\n\nvar message = "say ".concat(_word.word);\nvar _default = message;\nexports.default = _default;'
  },
  ".\\src\\word.js": {
    dependencise: {},
    code:
      '"use strict";\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\nexports.word = void 0;\nvar word = \'hello\';\nexports.word = word;'
  }
};
```

接下来要去构造 require 方法和 exports 对象

```js
const generateCode = entry => {
  console.log(makeDependenciesGraph(entry));
  // makeDependenciesGraph 返回的是一个对象，需要转换成字符串
  const graph = JSON.stringify(makeDependenciesGraph(entry));
  return `
    (function (graph) {
      // 定义 require 方法
      function require(module) {

      };
      require('${entry}')
    })(${graph})
  `;
};

const code = generateCode("./src/index.js");
console.log(code);
```

graph 是依赖图谱，拿到 entry 后去执行 `./src/index.js` 中的 code，也就是下面高亮部分的代码，为了直观我把前面输出的 graph 代码拿下来参考：

```js {5,6,7,8}
let graph = {
  "./src/index.js": {
    dependencise: { "./message.js": ".\\src\\message.js" },
    code: `
      "use strict";\n\n
       var _message = _interopRequireDefault(require("./message.js"));\n\n
       function _interopRequireDefault(obj){ return obj && obj.__esModule ? obj : { default: obj }; } \n\n
       console.log(_message.default);
      `
  }
};
```

为了让 code 中的代码执行，这里**再使用一个闭包**，让每一个模块里的代码放到闭包里来执行，这样模块的变量就不会影响到外部的变量

```js
return `
    (function (graph) {
      // 定义 require 方法
      function require(module) {
        (function (code) {
          eval(code)
        })(graph[module].code)
      };
      require('${entry}')
    })(${graph})
  `;
```

闭包里传递的是 `graph[module].code`，现在 entry 也就是 `./src/index.js` 这个文件，会传给 require 中的 module 变量，实际上去找依赖图谱中 `./src/index.js` 对应的对象，然后再去找到 code 中对应的代码，也就是下面这段代码，被我格式化过，为了演示效果

```js
"use strict";
var _message = _interopRequireDefault(require("./message.js"));
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
console.log(_message.default);
```

但是我们会发现，这里 `_interopRequireDefault(require('./message.js'))` 引入的是 `./message.js` 相对路径，等到第二次执行的时候，`require(module)` 这里的 `module` 对应的就是 `./message.js`

它会到 graph 中去找 `./message.js` 下对应的 code，可是我们在 graph 中存的是 `'.\\src\\message.js'` 绝对路径，这样就会找不到对象

因为我们之前写代码的时候引入的是相对路径，现在我们要把相对路径转换成绝对路径才能正确执行，定义一个 localRequire 方法，这样当下次去找的时候就会走我们自己定义的 localRequire，其实就是一个相对路径转换的方法

```js
return `
    (function (graph) {
      // 定义 require 方法
      function require(module) {
        // 相对路径转换
        function localRequire(relativePath) {
          return require(graph[module].dependencise[relativePath])
        }
        (function (require, code) {
          eval(code)
        })(localRequire, graph[module].code)
      };
      require('${entry}')
    })(${graph})
  `;
```

我们定义了 localRequire 方法，并把它传递到闭包里，当执行了 `eval(code)` 时执行了 `require` 方法，就不是执行外部的 `require(module)` 这个方法，而是执行我们传递进去的 localRequire 方法

我们在分析出的代码中是这样引入 `message.js` 的

`var _message = _interopRequireDefault(require('./message.js'))`

这里调用了 `require('./message.js')`，就是我们上面写的 `require` 方法，也就是 `localRequire(relativePath)`

所以 relativePath 就是 `'./message.js'`

这个方法返回的是 `require(graph[module].dependencise[relativePath])`

这里我把参数带进去，就是这样：

`graph('./src/index.js').dependencise['./message.js']`

```js {3}
let graph = {
  "./src/index.js": {
    dependencise: { "./message.js": ".\\src\\message.js" },
    code: `
      "use strict";\n\n
       var _message = _interopRequireDefault(require("./message.js"));\n\n
       function _interopRequireDefault(obj){ return obj && obj.__esModule ? obj : { default: obj }; } \n\n
       console.log(_message.default);
      `
  }
};
```

对照着图谱就能发现最终返回的就是 `'.\\src\\message.js'` 绝对路径，返回绝对路径后，我们再调用 `require(graph('./src/index.js').dependencise['./message.js'])` 就是执行外部定义的 `require(module)` 这个方法，重新递归的去执行，光这样还不够，这只是实现了 require 方法，还差 exports 对象，所以我们再定义一个 exports 对象

```js
return `
    (function (graph) {
      // 定义 require 方法
      function require(module) {
        // 相对路径转换
        function localRequire(relativePath) {
          return require(graph[module].dependencise[relativePath])
        }
        var exports = {};
        (function (require, exports, code) {
          eval(code)
        })(localRequire, exports, graph[module].code)
        return exports
      };
      require('${entry}')
    })(${graph})
  `;
```

最后要记得 `return exports` 将 exports 导出，这样下一个模块在引入这个模块的时候才能拿到导出的结果，现在代码生成的流程就写完了，最终返回的是一个大的字符串，保存再次运行 `node bundle.js | highlight`

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190403010330.png)

这里我是 windows 环境，将输出完的代码直接放到浏览器里不行，我就把压缩的代码格式化成下面这种样子，再放到浏览器里就能输出成功了

```js
(function(graph) {
  function require(module) {
    function localRequire(relativePath) {
      return require(graph[module].dependencise[relativePath]);
    }
    var exports = {};
    (function(require, exports, code) {
      eval(code);
    })(localRequire, exports, graph[module].code);
    return exports;
  }
  require("./src/index.js");
})({
  "./src/index.js": {
    dependencise: { "./message.js": ".\\src\\message.js" },
    code:
      '"use strict";\n\nvar _message = _interopRequireDefault(require("./message.js"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nconsole.log(_message.default);'
  },
  ".\\src\\message.js": {
    dependencise: { "./word.js": ".\\src\\word.js" },
    code:
      '"use strict";\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\nexports.default = void 0;\n\nvar _word = require("./word.js");\n\nvar message = "say ".concat(_word.word);\nvar _default = message;\nexports.default = _default;'
  },
  ".\\src\\word.js": {
    dependencise: {},
    code:
      '"use strict";\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\nexports.word = void 0;\nvar word = \'hello\';\nexports.word = word;'
  }
});
```

将上面代码放入浏览器的控制台中，回车就能输出 `say hello`

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190403012019.png)

## 总结

这就是打包工具打包后的内容，期间涉及了 node 知识，使用 babel 来转译 ast(抽象语法树)，最后的 generateCode 函数涉及到了**递归**和**闭包**，**形参**和**实参**，需要大家多看几遍，加深理解
