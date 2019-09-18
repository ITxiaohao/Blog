const sidebar = require('./sidebar')

module.exports = {
  //网站标题
  title: `Zsh's Blog`,
  // 主页描述
  description: 'Learn Web development together',
  // 要部署的仓库名字
  base: '/',
  // dest: './docs/.vuepress/dist',
  head: [['link', { rel: 'icon', href: '/avatar.jpg' }]],
  navbar: true,
  editLinks: true,
  repo: 'ITxiaohao/blog',
  editLinkText: '在 GitHub 上编辑此页',
  lastUpdated: '更新于',
  sidebar,
  docsDir: 'docs',
  sidebarDepth: 2,
  nav: [
    { text: '导航', link: '/guide/' },
    {
      text: '大前端',
      items: [
        {
          text: '基础',
          items: [
            {
              text: 'JavaScript',
              link: '/passages/javascript-first/'
            },
            { text: 'ES6', link: '/passages/es6-promise/' }
          ]
        },
        {
          text: '框架',
          items: [
            {
              text: 'Vue',
              link: '/passages/vue-cli3/'
            },
            {
              text: '小程序',
              link: '/passages/miniprogram-note/'
            }
          ]
        },
        {
          text: 'Node',
          items: [
            {
              text: '基础',
              link: '/passages/node-modules/'
            }
          ]
        },
        {
          text: '构建工具',
          items: [
            {
              text: 'Webpack4教程',
              link: '/passages/webpack4-learn-introduction/'
            }
          ]
        },
        {
          text: '自动化测试',
          items: [
            {
              text: 'Jest',
              link: '/passages/automated-testing-learn-introduction/'
            }
          ]
        }
      ]
    },
    {
      text: '工具',
      items: [
        {
          text: '版本管理',
          items: [
            {
              text: 'Git',
              link: '/passages/git-commit/'
            }
          ]
        },
        {
          text: '服务器部署',
          items: [
            {
              text: 'Jenkins',
              link: '/passages/server-jenkins/'
            },
            {
              text: 'Nginx',
              link: '/passages/server-nginx/'
            }
          ]
        }
      ]
    },
    {
      text: '数据结构与算法',
      items: [
        {
          text: '数据结构',
          items: [
            {
              text: 'data-structures',
              link: '/passages/data-structures-introduction/'
            }
          ]
        },
        {
          text: '算法',
          items: [
            {
              text: 'LeetCode',
              link: '/passages/LeetCode-introduction/'
            }
          ]
        }
      ]
    },
    {
      text: '关于我',
      link: '/about/'
    }
  ]
}
