# Hutiger's Blog

基于 **Nuxt 3** 的个人博客站点，使用 `@nuxt/content` 作为内容管理，UnoCSS 构建样式，静态生成后部署到 GitHub Pages。

## 技术栈

| 类别       | 技术                                                         |
| ---------- | ------------------------------------------------------------ |
| 框架       | Nuxt 3.17（Vue 3 + TypeScript）                              |
| 样式       | UnoCSS + Sass                                                |
| 内容       | @nuxt/content 2（Markdown 驱动）                             |
| 构建       | `pnpm generate` → 静态站点导出（Nitro preset: static）        |
| 部署       | GitHub Actions → GitHub Pages                                |
| 评论       | Giscus（基于 GitHub Discussions）                             |
| 图标       | FontAwesome 6 + Iconify（icon-park-outline, simple-icons）   |
| 工具库     | VueUse, date-fns                                             |

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器（默认 http://localhost:3000）
pnpm dev

# 构建静态站点
pnpm generate

# 预览构建结果
pnpm preview
```

## 目录结构

```
nuxt-blog/
├── app.vue                  # 根组件
├── nuxt.config.ts           # Nuxt 配置
├── uno.config.ts            # UnoCSS 配置
├── site.config.ts           # 站点元数据 & 导航/社交/项目链接
├── content/                 # Markdown 文章源
│   ├── me.md                # 个人介绍
│   ├── 404.md               # 404 页面
│   ├── blog/                # 技术博客
│   ├── life/                # 生活随记
│   └── record/              # 记录
├── pages/                   # 页面路由
│   ├── index.vue            # 首页
│   ├── blog.vue             # 博客列表
│   ├── life.vue             # 生活列表
│   ├── record.vue           # 记录列表
│   ├── search.vue           # 搜索
│   ├── links.vue            # 友链
│   ├── tags/                # 标签体系
│   └── p/[...post].vue      # 文章详情
├── components/              # Vue 组件
│   ├── Cell.vue             # 文章列表项
│   ├── PostList.vue         # 文章列表容器
│   ├── SubNav.vue           # 分类子导航
│   ├── content/             # Markdown 渲染组件
│   └── doc/                 # 文章文档组件
├── layouts/                 # 布局组件
├── assets/styles/           # 全局样式
├── server/routes/           # 服务端路由（RSS）
├── middleware/              # 路由中间件
├── utils/                   # 工具函数
└── .github/workflows/       # CI/CD
```

## 特色功能

- **多分类**：博客 / 生活 / 记录三分类文章体系
- **标签筛选**：按标签聚合文章
- **全文搜索**：实时搜索标题、描述、标签（600ms 防抖）
- **深色模式**：支持切换，class 策略适配
- **文章目录**：文章详情页自动生成 TOC
- **阅读统计**：站点 UV/PV + 单篇文章阅读次数
- **评论系统**：基于 GitHub Discussions 的 Giscus 评论
- **RSS**：服务端路由生成 RSS Feed
- **代码高亮**：浅色/深色模式各自适配主题
- **页面过渡**：CSS 滑动入场动画

## 自定义配置

站点元数据、导航链接、社交链接在 `site.config.ts` 中集中管理，修改后全局生效。

## 部署

每次推送 `main` 分支时，GitHub Actions 自动执行：

1. `pnpm install`
2. `pnpm generate` 构建静态站点
3. 部署到 GitHub Pages

## License

MIT
