export function useViewCount(slug: string) {
  const views = ref<number | null>(null)

  const getCount = async () => {
    try {
      const url = `https://hutiger9.github.io/p${slug}`
      const res = await fetch(`https://api.vercount.one/api/v1/count?url=${encodeURIComponent(url)}`)
      const data = await res.json()
      views.value = data.count ?? null
    } catch {
      views.value = null
    }
  }

  const increaseCount = async () => {
    try {
      const url = `https://hutiger9.github.io/p${slug}`
      const res = await fetch('https://api.vercount.one/api/v1/count', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      views.value = data.count ?? null
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
