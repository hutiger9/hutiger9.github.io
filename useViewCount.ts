export function useViewCount(slug: string) {
  const views = ref<number | null>(null)

  const apiUrl = 'https://events.vercount.one/api/v2/log'

  const getCount = async () => {
    try {
      const url = `https://hutiger9.github.io/p${slug}`
      const res = await fetch(`${apiUrl}?url=${encodeURIComponent(url)}`)
      const data = await res.json()
      views.value = data.data?.page_pv ?? null
    } catch {
      views.value = null
    }
  }

  const increaseCount = async () => {
    try {
      const url = `https://hutiger9.github.io/p${slug}`
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      views.value = data.data?.page_pv ?? null
    } catch {
      views.value = null
    }
  }

  return {
    views,
    getCount,
    increaseCount,
  }
}
