---
date: 2026-06-10 20:00:00
url:
tags:
  - 博客
  - RSS
  - Nuxt
  - 踩坑
title: 修复 RSS Feed 中的 Shiki 样式污染问题
en-title: Fixing Shiki Style Pollution in RSS Feed
---

# 修复 RSS Feed 中的 Shiki 样式污染问题

摘要：给博客加了 RSS 全文输出后，发现某些文章的 Feed 里混入了大量 CSS 代码。排查后发现是 Shiki 语法高亮的产物——本文记录问题原因和修复过程。

---

## 背景

之前博客的 RSS 只输出标题和摘要，内容不够完整。我改成了直接输出文章全文 HTML，让 RSS 阅读器能直接展示完整的文章内容。

实现思路是通过解析 Nuxt Content 的 AST（抽象语法树），将 `body.children` 递归转换为简单的 HTML 标签，然后通过 CDATA 包裹输出到 RSS 的 `<description>` 字段。

```ts
// RSS 正文生成：遍历 AST 节点，映射为 HTML
function bodyToHtml(node) {
  switch (node.tag) {
    case 'p':   return `<p>${children}</p>`
    case 'h1':  return `<h1>${children}</h1>`
    case 'code': return `<code>${children}</code>`
    // ... 更多标签映射
  }
}
```

看起来没什么问题。

## 问题现象

上线后查看 RSS 源，发现某些文章底部跟了一大段奇怪的 CSS 代码：

```css
html .default .shiki span {
  color: var(--shiki-default);
  background: var(--shiki-default-bg);
}
html .dark .shiki span {
  color: var(--shiki-dark);
  background: var(--shiki-dark-bg);
}
/* ... 重复多组 */
```

显然，这是语法高亮引擎 Shiki 的 CSS 样式定义，不应该出现在 RSS 里。

## 排查

Nuxt Content 默认使用 Shiki 做代码块语法高亮。在构建时，Shiki 会对 markdown 中的代码块进行处理，给每个 `<span>` 加上行内颜色样式，同时在文档中插入 `<style>` 标签来定义高亮主题的 CSS 变量。

问题在于，我的 `bodyToHtml` 函数是一个通用的 AST 遍历器——**它不区分内容节点和样式节点**。当遍历到 `<style>` 标签时，`default` 分支直接返回了它的子节点（即 CSS 文本内容），这些内容就被当作正文输出了。

## 修复

修复很简单：在递归遍历时跳过 `<style>` 和 `<span>` 标签，同时对代码块 ( `<pre>` ) 直接提取纯文本，不做样式渲染。

```ts
function bodyToHtml(node) {
  // ... 基础节点处理 ...

  // 跳过 Shiki 注入的样式标签
  if (node.tag === 'style' || node.tag === 'span') return ''

  // 代码块直接提取纯文本，不要 Shiki 的高亮结构
  if (node.tag === 'pre') {
    const text = extractPlainText(node)
    return `<pre><code>${escapeXml(text)}</code></pre>`
  }

  // ... 其他标签映射 ...
}
```

同时还有一个隐藏的问题：之前的 RSS description 对整个 HTML 做了 `escapeXml` 转义，导致所有标签都变成了 `&lt;p&gt;` 这样的实体。正确的做法是用 CDATA 包裹 HTML 内容：

```ts
const description = contentHtml
  ? `<![CDATA[${contentHtml}]]>`
  : escapeXml(doc.description || title)
```

## 最终效果

修复后的 RSS Feed：

- 文章正文干净输出，没有 Shiki CSS 污染
- 代码块显示为纯文本，阅读器友好
- 所有分类文章（blog、life、record）均包含
- 全文 CDATA 包裹，RSS 阅读器正常解析

查看 RSS：https://www.hutiger.men/rss.xml

## 小结

这次踩坑的本质是**对框架内部机制不够了解**——Shiki 对代码块的加工是 Nuxt Content 的默认行为，但在自己实现 AST 遍历时，忘记考虑它会在文档中插入额外的 `<style>` 节点。

对于静态站点生成来说，留意"构建时运行的代码"会往数据里注入什么，是减少这类问题的关键。
