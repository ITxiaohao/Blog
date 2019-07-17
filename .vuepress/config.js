const { mdConf, themeConf } = require('./config/')
console.log('process.env.clientSecret', process.env.clientSecret)
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
    ],
    [
      'vuepress-plugin-comment',
      {
        choosen: 'gitalk',
        options: {
          clientID: '3cc86f34770ab7a66bb1',
          clientSecret: process.env.clientSecret || '',
          repo: 'Blog',
          owner: 'ITxiaohao',
          admin: ['ITxiaohao'],
          id: '<%- frontmatter.commentid || frontmatter.permalink %>', // Ensure uniqueness and length less than 50
          distractionFreeMode: false, // Facebook-like distraction free mode
          labels: ['Gitalk', 'Comment'],
          title: '「评论」<%- frontmatter.title %>',
          body:
            '<%- frontmatter.title %>：<%- window.location.origin %><%- frontmatter.to.path || window.location.pathname %>'
        }
      }
    ]
  ]
}
