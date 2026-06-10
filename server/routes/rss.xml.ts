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

function buildRssXml(
  docs: { title?: string; en_title?: string; date: string; _path: string; description?: string; tags?: string[] }[],
): string {
  const siteUrl = 'https://www.hutiger.men'
  const now = new Date().toUTCString()

  const items = docs.map((doc) => {
    const title = doc.title || ''
    const link = `${siteUrl}${doc._path}`
    const pubDate = doc.date ? new Date(doc.date).toUTCString() : now
    const description = doc.description || ''
    const tags = doc.tags?.map(t => `      <category>${escapeXml(t)}</category>`).join('\n') || ''

    return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(description)}</description>
${tags}
    </item>`
  }).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
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
  const docs = await serverQueryContent(event, 'blog')
    .sort({ date: -1 })
    .find()

  const feed = buildRssXml(docs)
  event.node.res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8')
  return feed
})
