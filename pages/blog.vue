<script setup lang="ts">
import { getIncludedYearPosts } from '@/utils'
import { onMounted } from 'vue'
const posts = await getIncludedYearPosts('blog')
const route = useRoute()
const { data: post } = await useAsyncData(
  () => `/api/posts/${route.params.slug}`, // 假设你有这个 API
  () => $fetch(`/api/posts/${route.params.slug}`)
)

onMounted(() => {
  if (!document.getElementById("busuanzi-script")) {
    const script = document.createElement("script");
    script.src = "//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js";
    script.async = true;
    script.id = "busuanzi-script";
    document.body.appendChild(script);
  }
});

</script>
<template>
  <sub-nav />

  <post-list :posts="posts" />
      <!-- 放页面其他内容 -->
      <div style="margin-top: 6rem;" /> <!-- 拉开间距 -->
      <div id="busuanzi-container" style="text-align: center; margin-top: 2rem; color: #888;">
        <span id="busuanzi_container_site_uv">
          <span id="busuanzi_value_site_uv"></span> 访客
        </span>
        &nbsp;&nbsp;
        <span id="busuanzi_container_site_pv">
          <span id="busuanzi_value_site_pv"></span> 访问
        </span>
      </div>
</template>


