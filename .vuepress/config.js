const { mdConf, themeConf } = require('./config/')
console.log('process.env.clientSecret', process.env.clientSecret)
module.exports = {
  theme: 'reco',
  //网站标题
  title: `Zsh's Blog`,
  // 主页描述
  description: 'Learn Web development together',
  // 要部署的仓库名字
  base: '/',
  // dest: './docs/.vuepress/dist',
  head: [
    ['link', { rel: 'icon', href: '/avatar.jpg' }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'theme-color', content: '#4b8bf5' }],
    [
      'meta',
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'black-translucent'
      }
    ],
    [
      'link',
      { rel: 'apple-touch-icon', href: `/icons/apple-touch-icon-152x152.png` }
    ]
  ],
  markdown: mdConf,
  // 主题配置
  themeConfig: themeConf,
  plugins: [
    require('./plugins/my-router'),
    [
      '@vuepress-reco/vuepress-plugin-kan-ban-niang',
      {
        theme: ['whiteCat'],
        clean: true,
        modelStyle: {
          position: 'fixed',
          right: '40px',
          bottom: '0px',
          opacity: '0.9',
          zIndex: 99999
        }
      }
    ],
    '@vuepress-reco/vuepress-plugin-back-to-top',
    ['@vuepress-reco/vuepress-plugin-screenfull', false], // disabled
    '@vuepress/medium-zoom',
    ['@vuepress/google-analytics', { ga: 'UA-144131352-1' }],
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
    // 'vuepress-plugin-cat'
  ]
}
