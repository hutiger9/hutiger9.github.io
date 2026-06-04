import { format, parseISO } from 'date-fns'

export function formattedDate(date: string) {
  if (!date) return ''
  const dateObject = parseISO(date)
  const formattedResult = format(dateObject, 'yyyy/MM/dd')
  return formattedResult
}

export function insertYearToPosts(posts: any) {
  let currentYear = -1
  return posts.reduce(
    (posts: any, post: any) => {
      const year = new Date(post.date).getFullYear()
      if (year !== currentYear && !isNaN(year)) {
        posts.push({
          isMarked: true,
          year,
        })
        currentYear = year
      }
      posts.push(post)
      return posts
    },
    [],
  )
}

export async function getIncludedYearPosts(dirName: string) {
  const result = await queryContent(dirName).sort({ date: -1 }).find()
  return insertYearToPosts(result)
}

/**
 * 估算阅读时间（中/英混合）
 */
export function getReadingTime(content: string): number {
  if (!content) return 1
  const cn = (content.match(/[一-龥]/g) || []).length
  const en = content.replace(/[一-龥]/g, '').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(cn / 300 + en / 150))
}

/**
 * 根据标签名生成对应的颜色
 */
const TAG_COLORS = [
  { bg: '#f0f9f0', text: '#2d6a4f', darkBg: '#1a3a2a', darkText: '#95d5b2' }, // 绿
  { bg: '#f0f4ff', text: '#1e40af', darkBg: '#1e2a4a', darkText: '#93b4f8' }, // 蓝
  { bg: '#fef3f0', text: '#b45309', darkBg: '#3a2a1a', darkText: '#fcd34d' }, // 橙
  { bg: '#faf0ff', text: '#7c3aed', darkBg: '#2a1a3a', darkText: '#c084fc' }, // 紫
  { bg: '#fef0f0', text: '#b91c1c', darkBg: '#3a1a1a', darkText: '#fca5a5' }, // 红
  { bg: '#f0faff', text: '#0f766e', darkBg: '#1a3a3a', darkText: '#5eead4' }, // 青
  { bg: '#fff8f0', text: '#92400e', darkBg: '#3a2e1a', darkText: '#f6ad55' }, // 琥珀
]

export function getTagColor(tag: string) {
  let hash = 0
  for (let i = 0; i < tag.length; i++) hash = tag.charCodeAt(i) + ((hash << 5) - hash)
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length]
}
