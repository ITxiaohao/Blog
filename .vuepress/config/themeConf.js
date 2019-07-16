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
  editLinkText: '在 GitHub 上编辑此页',
  lastUpdated: '更新于',
  sidebar,
  sidebarDepth: 2,
  nav: [
    { text: '导航', link: '/guide/' },
    {
      text: '大前端',
      items: [
        {
          text: '框架工具',
          items: [
            {
              text: 'Webpack4教程',
              link: '/passages/webpack4-learn-introduction/'
            }
          ]
        }
      ]
    }
  ]
}
