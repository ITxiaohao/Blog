const { generateFileName, generateOrderFileName } = require('./utils')

let webpack4Files = generateOrderFileName('/webpack4')

let leetCodeEasy = generateFileName('/数据结构与算法/leetCode/easy').map(
  v => `easy/${v}`
)
// console.log('leetCodeEasy', leetCodeEasy)

const node = [
  {
    title: '基础',
    collapsable: false,
    children: ['基础/modules.md', '基础/event.md']
  }
]

const server = [
  {
    title: '服务器部署',
    collapsable: false,
    children: ['Jenkins.md', 'Nginx.md']
  }
]

const git = [
  {
    title: 'Git',
    collapsable: false,
    children: ['从 commit 规范化到发布自定义 CHANGELOG 模版.md', 'tag.md']
  }
]

const frontendFrame = [
  {
    title: 'Vue',
    collapsable: false,
    children: ['Vue/Vue-Cli3.md']
  },
  {
    title: '小程序',
    collapsable: false,
    children: [
      '小程序/注意事项及踩过的坑.md',
      '小程序/多张图片上传及表单提交.md',
      '小程序/小程序更新机制.md',
      '小程序/用 Promise 封装 wx-request.md'
    ]
  }
]

const frontend = [
  {
    title: 'JavaScript',
    collapsable: false,
    children: ['JS/JavaScript 基础-上.md']
  },
  {
    title: 'ES6',
    collapsable: false,
    children: ['ES6/Promise.md', 'ES6/Proxy.md']
  }
]

const webpack4 = [
  {
    title: 'webpack4',
    collapsable: false,
    children: webpack4Files
  }
]

const testSecond = '2：Jest 前端自动化测试框架基础入门'
const testThird = '3：Jest 难点进阶'

const test = [
  {
    title: '前端自动化测试',
    collapsable: false,
    children: ['1：前端自动化测试/前言.md']
  },
  {
    title: '2. Jest 测试框架基础入门',
    collapsable: false,
    children: [
      `${testSecond}/2-1：自动化测试产生的背景及原理.md`,
      `${testSecond}/2-2：前端自动化测试框架.md`,
      `${testSecond}/2-3：使用 Jest 修改自动化测试样例.md`,
      `${testSecond}/2-4：Jest 的简单配置.md`,
      `${testSecond}/2-5：Jest 中的匹配器.md`,
      `${testSecond}/2-6：Jest 命令行工具的使用.md`,
      `${testSecond}/2-7：异步代码的测试方法1.md`,
      `${testSecond}/2-8：异步代码的测试方法2.md`,
      `${testSecond}/2-9：Jest 中的钩子函数.md`,
      `${testSecond}/2-10：钩子函数的作用域.md`,
      `${testSecond}/2-11：Jest 中的 Mock1.md`,
      `${testSecond}/2-12：Jest 中的 Mock2.md`
    ]
  },
  {
    title: '3. Jest 难点进阶',
    collapsable: false,
    children: [
      `${testThird}/3-1：Snapshot 快照测试.md`,
      `${testThird}/3-2：mock 深入学习.md`,
      `${testThird}/3-3：mock times.md`,
      `${testThird}/3-4：ES6 中类的测试.md`,
      `${testThird}/3-5：Jest 中对 DOM 节点操作的测试.md`
    ]
  }
]

const LeetCode = [
  {
    title: 'LeetCode',
    collapsable: false,
    children: ['前言.md']
  },
  {
    title: 'easy',
    collapsable: false,
    children: leetCodeEasy
    // children: [
    //   'easy/001.两数之和.md',
    //   'easy/007.整数反转.md',
    //   'easy/009.回文数.md',
    //   'easy/013.罗马数字转整数.md',
    //   'easy/014.最长公共前缀.md',
    //   'easy/020.有效的括号.md',
    //   'easy/021.合并两个有序链表.md',
    //   'easy/026.删除排序数组中的重复项.md',
    //   'easy/027.移除元素.md',
    //   'easy/028.实现-str-str.md',
    //   'easy/035.搜索插入位置.md'
    // ]
  }
]

module.exports = {
  '/服务器部署/': server,
  '/Git/': git,
  '/前端知识体系/': frontend,
  '/前端框架/': frontendFrame,
  '/NodeJS/': node,
  '/webpack4/': webpack4,
  '/前端自动化测试/': test,
  '/数据结构与算法/LeetCode/': LeetCode
}
