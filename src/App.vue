<script setup>
import { onMounted, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const route = useRoute()
const isAdminRoute = computed(() => route.path === '/admin')

const locale = zhCn

onMounted(() => {
  // 加载jQuery
  const jqueryScript = document.createElement('script')
  jqueryScript.src = '/scripts/jquery-3.2.1.min.js'
  document.head.appendChild(jqueryScript)
})
</script>

<template>
  <el-config-provider :locale="locale">
    <div id="app" :class="{ 'admin-page': isAdminRoute }">
      <router-view></router-view>
    </div>
  </el-config-provider>
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
