---
date: 2026-06-06 16:00:00
url:
tags:
  - 博客
  - 评论
  - Waline
title: 为自己的博客加一套轻量评论系统
en-title: Add a Lightweight Comment System to Your Blog
---

# 为自己的博客加一套轻量评论系统

摘要：不再依赖 GitHub 登录，也不用嵌入第三方 iframe——用 Waline + Neon PostgreSQL 自建一套支持昵称、邮箱、网址的评论系统，部署在 Vercel 上免费运行。

---

## 为什么换掉 Giscus

之前博客用的 Giscus，基于 GitHub Discussions。虽然配置简单，但有几个痛点：

- 访客必须登录 GitHub 才能评论，门槛太高
- 评论和 Issues/讨论混在一起，不好管理
- 想自定义样式和字段比较受限

理想中的评论系统应该是：填个昵称和邮箱就能发言，像论坛一样自然。

## 选型：Waline

[Waline](https://waline.js.org/) 是一个轻量评论系统，后端可部署在 Vercel（免费），数据库支持 PostgreSQL、MySQL、MongoDB 等。前端是一个 JS 组件，嵌入到任何静态站点中。

它的核心优势：

- **开箱即用的表单**：昵称、邮箱、网址（就是你现在看到的这三栏）
- **无需第三方登录**
- **反垃圾机制**：验证码 + 关键词过滤
- **管理后台**：审核、删除、置顶评论
- **全平台兼容**：Vue、React、静态 HTML 都能用

## 架构

```
┌──────────────────────┐       ┌───────────────────────┐
│  博客 (GitHub Pages)  │       │  Waline (Vercel)      │
│  静态 HTML + JS       │  ←→   │  评论 API              │
│  @waline/client       │       │  Neon PostgreSQL        │
└──────────────────────┘       └───────────────────────┘
```

博客本身还是纯静态的，部署在 GitHub Pages 上。评论功能由 Waline 客户端在浏览器端发起到 Vercel 后端，不需要博客有服务器。

## 部署步骤

### 1. 在 Vercel 部署 Waline 后端

一键部署：[Waline Vercel 部署](https://vercel.com/import/walinejs/waline)，然后绑定自己域名。

### 2. 配置数据库

Waline 支持多种数据库，我这里用了 **Neon PostgreSQL**（有免费 500MB 额度），在 Vercel 项目设置里添加环境变量：

```env
PG_HOST=ep-xxx.aws.neon.tech
PG_PORT=5432
PG_DB=neondb
PG_USER=xxx
PG_PASSWORD=xxx
PG_SSL=true
```

也可以用 MongoDB Atlas、TiDB Cloud 等，都是一样的配置流程。

### 3. 前端接入

在 Nuxt 项目中安装客户端：

```bash
pnpm add @waline/client
```

然后在文章页面加一段客户端初始化代码：

```ts
onMounted(async () => {
  const { init } = await import('@waline/client')
  await import('@waline/client/style')
  init({
    el: '#waline',
    serverURL: 'https://comments.hutiger.men',
    lang: 'zh-CN',
    emoji: true,
  })
})
```

模板里加一个容器就行：

```html
<div id="waline" />
```

整个替换过程就改一个文件，Waline 会自动渲染出完整的评论表单和列表。

## 自定义样式

Waline 的默认样式已经很干净了，但如果想让它和博客主题更融合，可以用 CSS 变量覆盖：

```css
#waline {
  --waline-font-size: 0.95rem;
  --waline-theme-color: var(--accent);
  --waline-active-color: var(--accent-soft);
}
```

我给评论区加了分隔线和卡片背景，看起来像是博客正文的自然延伸。

## 管理后台

部署完成后，访问 `你的域名/ui` 就是管理后台。可以：

- 查看、删除、置顶所有评论
- 配置反垃圾规则
- 邮件通知

## 小结

从 Giscus 换到 Waline，最直观的感受是评论区的氛围更轻松了——访客不用跳转 GitHub 授权，直接填昵称就能开口。对于个人博客来说，降低评论门槛比强绑定一个平台账号更重要。

如果你也在用静态博客，且觉得现有评论方案不太顺手，值得试试这套组合。
