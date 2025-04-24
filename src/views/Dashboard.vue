<template>
  <div class="dashboard-container">
    <div class="dashboard" @keydown="handleKeydown" tabindex="0" ref="dashboardRef">
      <Header />
      <div class="content">
        <div class="carousel-container">
          <div class="carousel-items">
            <div 
              v-for="(_, index) in 3" 
              :key="index"
              class="carousel-item"
              :class="{ active: currentPage === index }"
              :style="{ 
                opacity: currentPage === index ? 1 : 0,
                visibility: currentPage === index ? 'visible' : 'hidden'
              }"
            >
              <component :is="pages[index]" />
            </div>
          </div>
          <div class="carousel-controls">
            <div 
              v-for="(_, index) in 3" 
              :key="index"
              class="control-dot"
              :class="{ active: currentPage === index }"
              @click="goToPage(index)"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Header from '../components/Header.vue'
import DashboardPage1 from './DashboardPage1.vue'
import DashboardPage2 from './DashboardPage2.vue'
import DashboardPage3 from './DashboardPage3.vue'

const pages = [DashboardPage1, DashboardPage2, DashboardPage3]
const currentPage = ref(0)
const dashboardRef = ref(null)

const goToPage = (index) => {
  currentPage.value = index
}

const nextPage = () => {
  currentPage.value = (currentPage.value + 1) % 3
}

const prevPage = () => {
  currentPage.value = (currentPage.value - 1 + 3) % 3
}

const handleKeydown = (e) => {
  if (e.key === 'ArrowLeft') {
    prevPage()
  } else if (e.key === 'ArrowRight') {
    nextPage()
  }
}

onMounted(() => {
  dashboardRef.value?.focus()
})

onUnmounted(() => {
  // No need to clean up any resources as there's no auto-play functionality
})
</script>

<style scoped>
.dashboard-container {
  width: 100%;
  height: 100vh;
  background-color: #000B2A;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

.dashboard {
  width: 1600px;
  height: 1200px;
  background-color: #0A184B;
  position: absolute;
  left: 0;
  top: 0;
  outline: none;
}

.content {
  position: absolute;
  top: 100px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.carousel-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.carousel-items {
  width: 100%;
  height: 100%;
  position: relative;
}

.carousel-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: opacity 0.8s ease;
}

.carousel-controls {
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 10;
}

.control-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-dot:hover {
  background-color: rgba(0, 255, 255, 0.5);
}

.control-dot.active {
  background-color: #00FFFF;
  transform: scale(1.2);
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}
</style>