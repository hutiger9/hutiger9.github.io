---
date: 2026-06-04 12:00:00
url:
tags:
  - Nuxt
  - UnoCSS
  - code
  - 构建
title: 解决 Nuxt generate 时 Google Fonts 拉取失败
en-title: Fix Google Fonts Fetch Failure in Nuxt Generate
---

# 解决 Nuxt generate 时 Google Fonts 拉取失败

摘要：在 Nuxt 静态生成过程中，如果 UnoCSS 的 Web Fonts 预设需要从 Google Fonts 下载字体 CSS，离线环境、国内网络或 CI DNS 异常都可能触发 `Failed to fetch web fonts`。本文记录问题现象、原因定位和几种可落地的解决方案。

---

## 问题现象

执行静态生成命令：

```bash
pnpm run generate
```

构建过程中出现类似提示：

```text
Failed to fetch web fonts
FetchError: [GET] "https://fonts.googleapis.com/css2?family=Inter&family=Noto+Sans+Simplified+Chinese&display=swap": <no response> fetch failed
getaddrinfo ENOTFOUND fonts.googleapis.com
```

如果项目配置了静态托管，Nuxt 最后可能仍然生成 `.output/public`，但这类错误会让 CI 日志变得不稳定，也会导致字体样式无法按预期内联。

## 为什么会发生

常见原因有三个：

1. 构建机无法访问 `fonts.googleapis.com`
2. CI 环境禁用了外网请求或 DNS 解析不稳定
3. UnoCSS 在构建阶段尝试下载远程字体 CSS

问题不在 Nuxt Content，也不是 Markdown 文件格式错误。真正触发网络请求的通常是 `@unocss/preset-web-fonts` 或 UnoCSS 配置中的字体预设。

可以先检查 `uno.config.ts` 里是否存在类似配置：

```ts
presetWebFonts({
  provider: 'google',
  fonts: {
    sans: 'Inter',
    cn: 'Noto Sans Simplified Chinese',
  },
})
```

只要构建阶段依赖 Google Fonts，网络不可用时就有概率复现。

## 方案一：改成本地字体

最稳定的方式是把字体文件放进 `public/fonts`，再通过 CSS 声明 `@font-face`。这样构建不需要访问外网。

目录示例：

```text
public/
  fonts/
    Inter-Regular.woff2
    NotoSansSC-Regular.woff2
```

在全局样式里声明：

```scss
@font-face {
  font-family: 'Inter Local';
  src: url('/fonts/Inter-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Noto Sans SC Local';
  src: url('/fonts/NotoSansSC-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

body {
  font-family: 'Inter Local', 'Noto Sans SC Local', system-ui, sans-serif;
}
```

这个方案适合部署到 GitHub Pages、Vercel、Netlify 或任何静态托管平台。字体文件会随站点一起发布，不依赖第三方服务。

## 方案二：移除构建期字体下载

如果不想维护字体文件，可以直接使用系统字体栈。Nuxt 博客类项目通常不需要在构建阶段强依赖远程字体。

可以在 `uno.config.ts` 中移除 `presetWebFonts`，保留普通的 UnoCSS 预设：

```ts
import { defineConfig, presetUno, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons(),
  ],
})
```

然后在 CSS 中使用系统字体：

```scss
body {
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    'Segoe UI', sans-serif;
}
```

这样做的优点是最轻量，缺点是不同系统上的字体观感会有一点差异。

## 方案三：只在可联网环境启用 Web Fonts

如果本地开发希望继续使用 Google Fonts，而 CI 或自动化生成环境要保持稳定，可以用环境变量控制配置。

```ts
const enableWebFonts = process.env.ENABLE_WEB_FONTS === 'true'

export default defineConfig({
  presets: [
    presetUno(),
    enableWebFonts
      ? presetWebFonts({
          provider: 'google',
          fonts: {
            sans: 'Inter',
          },
        })
      : null,
  ].filter(Boolean),
})
```

本地联网开发时运行：

```bash
ENABLE_WEB_FONTS=true pnpm run dev
```

CI 或定时生成时不设置这个变量，就不会触发远程字体下载。

## 如何验证

修改后重新生成：

```bash
pnpm run generate
```

重点看三件事：

1. 日志里不再出现 `Failed to fetch web fonts`
2. `.output/public` 正常生成
3. 打开页面后中文、英文和代码字体都可读

如果项目已经有发布流水线，还可以再看一次部署日志，确认静态生成阶段没有访问 Google Fonts 失败的错误。

## 总结

`nuxt generate` 里的 Google Fonts 报错，本质是构建阶段依赖远程资源。对静态博客来说，最稳妥的处理方式是本地化字体，或者退回系统字体栈。

字体属于展示增强，不应该成为文章发布失败的原因。把外部依赖从构建链路里拿掉，自动化发布才会更可靠。
