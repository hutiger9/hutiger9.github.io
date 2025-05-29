export function useViewCount(slug: string) {
    const views = ref<number | null>(null)
  
    const getCount = async () => {
      try {
        const key = `qiu-blog-${slug}`
        const res = await fetch(`https://api.countapi.xyz/get/qiu-blog/${key}`)
        const data = await res.json()
        views.value = data.value
      } catch (e) {
        views.value = null
      }
    }
  
    const increaseCount = async () => {
      try {
        const key = `qiu-blog-${slug}`
        const res = await fetch(`https://api.countapi.xyz/hit/qiu-blog/${key}`)
        const data = await res.json()
        views.value = data.value
      } catch (e) {
        views.value = null
      }
    }
  
    return {
      views,
      getCount,
      increaseCount,
    }
  }