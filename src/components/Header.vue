<template>
  <div class="header">
    <div class="logo-container">
      <img src="../assets/logo.svg" alt="公司logo" class="logo">
    </div>
    <div class="title">
      <div class="main-title">嘉定区具身智能机器人训练场</div>
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
      <div class="icon">
        <img src="../assets/tool_full.svg" alt="全屏">
      </div>
      <div class="icon">
        <img src="../assets/tool_set.svg" alt="设置">
      </div>
      <div class="icon">
        <img src="../assets/tool_off.png" alt="关机">
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const currentTime = ref('')
const currentWeekday = ref('')
const currentDate = ref('')

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
}

.icon img {
  width: 19px;
  height: 17px;
  object-fit: contain;
}
</style> 