import { serverQueryContent } from '#content/server'

function escapeXml(str: string): string {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/** Extract plain text from Nuxt Content AST body */
function extractText(node: any): string {
  if (!node) return ''
  if (typeof node === 'string') return node
  if (node.type === 'text' || node.type === 'inlineCode') return node.value || ''
  if (node.children) return node.children.map(extractText).join(' ')
  return ''
}

/** Convert Nuxt Content AST body to simple HTML for RSS */
function bodyToHtml(node: any): string {
  if (!node) return ''
  if (typeof node === 'string') return escapeXml(node)
  if (node.type === 'text') return escapeXml(node.value || '')
  if (node.type === 'inlineCode') return `<code>${escapeXml(node.value || '')}</code>`
  if (node.type === 'code') {
    const lang = node.lang ? ` class="language-${escapeXml(node.lang)}"` : ''
    return `<pre><code${lang}>${escapeXml(node.value || '')}</code></pre>`
  }

  const children = (node.children || []).map(bodyToHtml).join('')

  switch (node.tag) {
    case 'p': return `<p>${children}</p>`
    case 'h1': return `<h1>${children}</h1>`
    case 'h2': return `<h2>${children}</h2>`
    case 'h3': return `<h3>${children}</h3>`
    case 'ul': return `<ul>${children}</ul>`
    case 'ol': return `<ol>${children}</ol>`
    case 'li': return `<li>${children}</li>`
    case 'strong': return `<strong>${children}</strong>`
    case 'em': return `<em>${children}</em>`
    case 'a': return `<a href="${escapeXml(node.props?.href || '')}">${children}</a>`
    case 'img': return `<img src="${escapeXml(node.props?.src || '')}" alt="${escapeXml(node.props?.alt || '')}" />`
    case 'blockquote': return `<blockquote>${children}</blockquote>`
    case 'hr': return '<hr />'
    default: return children
  }
}

function buildRssXml(
  docs: {
    title?: string
    date: string
    _path: string
    description?: string
    body?: any
    tags?: string[]
    category?: string
  }[],
): string {
  const siteUrl = 'https://www.hutiger.men'
  const now = new Date().toUTCString()

  const items = docs.map((doc) => {
    const title = doc.title || ''
    const link = `${siteUrl}/p${doc._path}`
    const pubDate = doc.date ? new Date(doc.date).toUTCString() : now

    // Full article HTML from body, fallback to description
    let contentHtml = ''
    if (doc.body?.children) {
      contentHtml = doc.body.children.map(bodyToHtml).join('\n')
    }
    const description = escapeXml(contentHtml || doc.description || title)

    const tags = doc.tags?.map(t => `      <category>${escapeXml(t)}</category>`).join('\n') || ''

    return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
${tags}
      <source url="${siteUrl}/rss.xml">Hutiger's Blog</source>
    </item>`
  }).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Hutiger's Blog</title>
    <description>My blog site.</description>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>zh-CN</language>
    <lastBuildDate>${now}</lastBuildDate>
${items}
  </channel>
</rss>`
}

export default defineEventHandler(async (event) => {
  const docs = await serverQueryContent(event)
    .sort({ date: -1 })
    .find()

  // Filter: must have a real title & date, exclude translations, readme, about, 404
  const articles = docs.filter(d =>
    d.title &&
    d.date &&
    !d.translation &&
    !d._file?.match(/(readme|about|404)\.md$/i)
  )

  const feed = buildRssXml(articles)
  event.node.res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8')
  return feed
})
