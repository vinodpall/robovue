<script setup>
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isAdminRoute = computed(() => route.path === '/admin')

onMounted(() => {
  // 加载jQuery
  const jqueryScript = document.createElement('script')
  jqueryScript.src = '/scripts/jquery-3.2.1.min.js'
  document.head.appendChild(jqueryScript)
})
</script>

<template>
  <div id="app" :class="{ 'admin-page': isAdminRoute }">
    <router-view></router-view>
  </div>
</template>

<style>
#app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #000B2A;
}

#app.admin-page {
  background-color: #fff;
}

/* 确保dashboard页面的背景色 */
.dashboard-container {
  background-color: #000B2A;
}
</style>
