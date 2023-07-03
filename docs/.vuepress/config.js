module.exports = {
  title: 'Tiptap API中文手册',
  description: 'Tiptap API中文手册',
  displayAllHeaders: true,
  themeConfig: {
    sidebarDepth: 1,
    sidebar: [
      ['/', '介绍'],
      {
        title: '安装',
        collapsable: false,
        children: [['/views/installation/react.md', 'React']]
      },
      {
        title: '指导',
        collapsable: false,
        children: [
          ['/views/guide/configuration.md', '配置'],
          ['/views/guide/menus.md', '菜单'],
          ['/views/guide/styling.md', '样式'],
          ['/views/guide/output.md', '输出'],
          ['/views/guide/extensions.md', '自定义扩展'],
          ['/views/guide/interactive-node-views.md', '交互式节点视图'],
          ['/views/guide/javascript-view.md', 'JavaScript的节点视图'],
          ['/views/guide/react-node-view.md', 'React的节点视图']
        ]
      },
      {
        title: 'API',
        collapsable: false,
        children: [
          ['/views/api/editor.md', 'Editor'],
          ['/views/api/commands.md', 'Commands']
        ]
      }
    ]
  }
}
