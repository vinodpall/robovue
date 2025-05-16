<template>
  <div class="header">
    <div class="logo-container">
      <img :src="logoUrl" alt="公司logo" class="logo">
    </div>
    <div class="title">
      <div class="main-title">{{ configData?.name || '嘉定区具身智能机器人训练场' }}</div>
      <div class="sub-title">EMBODIED AI & ROBOTICS TRAINING HUB</div>
    </div>
    <div class="datetime">
      <div class="time">{{ currentTime }}</div>
      <div class="date">
        <div>{{ currentWeekday }}</div>
        <div>{{ currentDate }}</div>
      </div>
    </div>
    <div class="icons">
      <div class="icon" @click="toggleFullscreen">
        <img src="../assets/tool_full.svg" alt="全屏">
      </div>
      <div class="icon" @click="toggleCarousel">
        <img src="../assets/tool_set.svg" alt="轮播控制">
        <div v-if="showCarouselMessage" class="message-tooltip" :class="{ 'message-success': isSuccess, 'message-error': !isSuccess }">
          {{ carouselMessage }}
        </div>
      </div>
      <div class="icon">
        <img src="../assets/tool_off.png" alt="关机">
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import api from '../api'
import { ElMessage } from 'element-plus'

const currentTime = ref('')
const currentWeekday = ref('')
const currentDate = ref('')
const configData = ref(null)
const showCarouselMessage = ref(false)
const carouselMessage = ref('')
const isSuccess = ref(true)

// 计算logo的URL
const logoUrl = computed(() => {
  if (configData.value?.icon_url) {
    return `${import.meta.env.VITE_API_BASE_URL}${configData.value.icon_url}`
  }
  return '../assets/logo.svg'
})

// 显示消息提示
const showMessage = (message, success = true) => {
  carouselMessage.value = message
  isSuccess.value = success
  showCarouselMessage.value = true
  setTimeout(() => {
    showCarouselMessage.value = false
  }, 2000)
}

// 切换全屏
const toggleFullscreen = async () => {
  try {
    if (!document.fullscreenElement) {
      // 进入全屏
      await document.documentElement.requestFullscreen()
    } else {
      // 退出全屏
      if (document.exitFullscreen) {
        await document.exitFullscreen()
      }
    }
  } catch (error) {
    console.error('全屏切换失败:', error)
  }
}

// 切换轮播状态
const toggleCarousel = async () => {
  try {
    if (!configData.value) return
    
    const newStatus = !configData.value.page_carousel
    showMessage('正在处理...', true)
    
    await api.put(`/web-configs/${configData.value.id}`, {
      ...configData.value,
      page_carousel: newStatus
    })
    
    // 更新本地状态
    configData.value.page_carousel = newStatus
    
    // 发送自定义事件通知 Dashboard 组件
    window.dispatchEvent(new CustomEvent('carousel-status-changed', {
      detail: { enabled: newStatus }
    }))
    
    showMessage(newStatus ? '已开启页面轮播' : '已关闭页面轮播', true)
  } catch (error) {
    console.error('切换轮播状态失败:', error)
    showMessage('切换轮播状态失败', false)
  }
}

// 获取配置数据
const fetchConfig = async () => {
  try {
    const response = await api.get('/web-configs')
    if (response.items && response.items.length > 0) {
      configData.value = response.items[0]
    }
  } catch (error) {
    console.error('获取配置数据失败:', error)
  }
}

const updateTime = () => {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  currentTime.value = `${hours}:${minutes}`
  
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  currentWeekday.value = weekdays[now.getDay()]
  
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  currentDate.value = `${year}年${month}月${day}日`
}

onMounted(() => {
  updateTime()
  fetchConfig()
  const timer = setInterval(updateTime, 60000)
  onUnmounted(() => clearInterval(timer))
})
</script>

<style scoped>
.header {
  width: 100%;
  height: 91px;
  background: url('../assets/title_bg.png') no-repeat;
  background-size: 1600px 91px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  position: absolute;
  top: 0;
  left: 0;
}

.logo-container {
  border-width: 0px;
  position: absolute;
  left: 25px;
  top: 15px;
  display: flex;
  align-items: center;
  width: 244px;
  height: 80px;
}

.logo {
  width: 244px;
  height: 80px;
  object-fit: contain;
  border-width: 0px;
}

.title {
  position: absolute;
  left: 50%;
  top: 30%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
  font-size: 24px;
  white-space: nowrap;
}

.main-title {
  color: #00FFFF;
  font-size: 32px;
  font-weight: bold;
  white-space: nowrap;
}

.sub-title {
  border-width: 0px;
  position: absolute;
  top: 40px;
  width: 442px;
  height: 22px;
  font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑';
  font-weight: 700;
  font-style: normal;
  font-size: 17px;
  letter-spacing: 2px;
  color: #00FFFF;
}

.datetime {
  position: absolute;
  right: 150px;
  top: 55%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 15px;
  color: #fff;
}

.time {
  font-size: 24px;
  font-weight: bold;
}

.date {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-weight: bold;
  font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
  font-size: 14px;
  line-height: 1.5;
}

.date div {
  text-align: left;
  width: 100%;
}

.icons {
  position: absolute;
  right: 25px;
  top: 15px;
  display: flex;
  gap: 5px;
}

.icon {
  width: 19px;
  height: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
}

.icon img {
  width: 19px;
  height: 17px;
  object-fit: contain;
}

.message-tooltip {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  margin-top: 8px;
  z-index: 1000;
}

.message-success {
  background-color: #67C23A;
  color: white;
}

.message-error {
  background-color: #F56C6C;
  color: white;
}

.message-tooltip::before {
  content: '';
  position: absolute;
  top: -4px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 0 4px 4px;
  border-style: solid;
  border-color: transparent transparent currentColor transparent;
}

.message-success::before {
  border-color: transparent transparent #67C23A transparent;
}

.message-error::before {
  border-color: transparent transparent #F56C6C transparent;
}
</style> 