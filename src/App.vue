<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // 设置全屏
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen()
  }

  // 加载jQuery
  const jqueryScript = document.createElement('script')
  jqueryScript.src = '/scripts/jquery-3.2.1.min.js'
  document.head.appendChild(jqueryScript)
})
</script>

<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #000B2A;
}

#app {
  width: 1600px;
  height: 1400px;
  margin: 0;
  padding: 0;
  position: absolute;
  left: 0;
  top: 0;
}

.app-container {
  width: 100%;
  height: 100vh;
  background-color: #0a1929;
  color: #fff;
}
</style>
