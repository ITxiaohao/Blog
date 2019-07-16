const { mdConf, themeConf } = require('./config/')

module.exports = {
  //网站标题
  title: `Zsh's Blog`,
  // 主页描述
  description: 'Learn Web development together',
  // 要部署的仓库名字
  base: '/',
  // dest: './docs/.vuepress/dist',
  head: [['link', { rel: 'icon', href: '/avatar.jpg' }]],
  markdown: mdConf,
  // 主题配置
  themeConfig: themeConf,
  plugins: [
    require('./plugins/my-router'),
    [
      '@vuepress/pwa',
      {
        serviceWorker: true,
        updatePopup: {
          message: '发现页面有新内容',
          buttonText: '刷新'
        }
      }
    ]
  ]
}
