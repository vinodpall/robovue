<template>
  <div class="page-content">
    <div class="robot-showcase">
      <div class="carousel-container">
        <div class="carousel-wrapper">
          <div 
            v-for="(robot, index) in displayRobots" 
            :key="robot.id" 
            class="robot-card"
            :class="getCardPosition(index)"
          >
            <div class="card-title">
              <div class="title-content">
                <span>{{ robot.name }}</span>
                <div class="subtitle">{{ robot.subtitle }}</div>
              </div>
            </div>
            <div class="robot-image">
              <img :src="robot.image" :alt="robot.name">
            </div>
            <div class="specs-section">
              <div class="section-title">设备参数</div>
              <div class="specs-list">
                <div v-for="(spec, idx) in robot.specs" :key="idx" class="spec-item">
                  <span class="spec-icon">◆</span>
                  <span class="spec-text">{{ spec }}</span>
                </div>
              </div>
            </div>
            <div class="awards-section">
              <div class="section-title">获得荣誉</div>
              <div class="awards-list">
                <div v-for="(award, idx) in robot.awards" :key="idx" class="award-item">
                  <span class="award-icon">🏆</span>
                  <span class="award-text">{{ award }}</span>
                </div>
              </div>
            </div>
            <div class="reason-section">
              <div class="section-title">推荐理由</div>
              <div class="reason-text">{{ robot.reason }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="earth-bg">
      <img :src="earthBg" alt="earth background" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import robotPerson from '../assets/robo-person.png'
import robotDog from '../assets/robo-dog.png'
import robotCar from '../assets/robo-car.png'
import earthBg from '../assets/earth_bg.png'

const currentIndex = ref(0)
const autoPlayInterval = ref(null)

const robots = [
  {
    id: 1,
    name: '宇树 G1',
    subtitle: '人形机器人',
    image: robotPerson,
    specs: [
      '折叠尺寸: 690 × 450 × 300mm',
      '站立尺寸(最高度): 1270 × 450 × 200mm',
      '整机带电池重量: 59kg'
    ],
    awards: [
      '可持续发展先锋奖',
      '仿生运动突破奖',
      '机器人行业卓越奖'
    ],
    reason: '宇树G1的技术突破标志着国产人形机器人在动态运动与控制领域已达到国际领先水平。'
  },
  {
    id: 2,
    name: '绝影 X30 Pro',
    subtitle: '四足机器人',
    image: robotDog,
    specs: [
      '趴地尺寸: 1130mm × 470mm × 195mm',
      '站立尺寸: 1000mm × 470mm × 585mm',
      '整机重量: 59kg'
    ],
    awards: [
      '2024年度创新科技奖',
      '2023国际机器人技术大赛金奖',
      '2022最佳产品奖',
      '工业设计奖',
      '杰出创新设计奖',
      '机器人行业卓越奖'
    ],
    reason: '先进最新的人工智能技术，机器狗能够进行自主导航与环境感知，适应各种复杂的操作环境，集成多种功能，包括空中取物运输、自动任务执行等，机器狗大大提升了工作效率。'
  },
  {
    id: 3,
    name: 'DXR-C3950',
    subtitle: '光伏运维',
    image: robotCar,
    specs: [
      '外形尺寸: < 1400 × 900 × 1640mm',
      '整备重量: 400kg'
    ],
    awards: [
      '最具商业价值奖',
      '光伏运维先锋奖',
      '机器人行业卓越奖'
    ],
    reason: '除雪机器人以创新、精准、环保为核心优势，适应恶劣环境下的光伏板检修与可持续发展需求。'
  }
]

const displayRobots = computed(() => {
  const arr = []
  const total = robots.length
  
  // 左侧卡片
  arr.push({
    ...robots[(currentIndex.value - 1 + total) % total],
    position: 'left'
  })
  
  // 中间卡片
  arr.push({
    ...robots[currentIndex.value],
    position: 'center'
  })
  
  // 右侧卡片
  arr.push({
    ...robots[(currentIndex.value + 1) % total],
    position: 'right'
  })
  
  return arr
})

const getCardPosition = (index) => {
  const positions = ['left', 'center', 'right']
  return positions[index]
}

const goToSlide = (index) => {
  if (index === currentIndex.value) return
  currentIndex.value = index
}

const startAutoPlay = () => {
  autoPlayInterval.value = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % robots.length
  }, 5000)
}

const stopAutoPlay = () => {
  if (autoPlayInterval.value) {
    clearInterval(autoPlayInterval.value)
  }
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<style scoped>
.page-content {
  height: 100%;
  position: relative;
  overflow: hidden;
}

.robot-showcase {
  height: 100%;
  position: relative;
  z-index: 2;
  padding: 0 40px;
  perspective: 1000px;
}

.carousel-container {
  width: 100%;
  height: calc(100% - 60px);
  overflow: visible;
  position: relative;
  perspective: 2000px;
  transform-style: preserve-3d;
  padding: 0;
  margin-top: -60px;
}

.carousel-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
}

.robot-card {
  position: absolute;
  width: 460px;
  height: 850px;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-color: #0A184B;
  border: 1px solid #00FFFF;
  border-radius: 4px;
  transition: all 0.5s ease;
  transform-style: preserve-3d;
  transform-origin: center;
}

.robot-card.left {
  left: 2%;
  transform: translateX(-10%) rotateY(-15deg) scale(0.85);
  z-index: 1;
}

.robot-card.center {
  left: 50%;
  width: 614px;
  height: 811px;
  transform: translateX(-50%) rotateY(0deg) scale(1);
  z-index: 2;
}

.robot-card.right {
  right: 2%;
  transform: translateX(10%) rotateY(15deg) scale(0.85);
  z-index: 1;
}

.robot-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 255, 255, 0.1) 0%, transparent 100%);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.robot-card.center::before {
  opacity: 1;
}

.card-title {
  position: relative;
  margin-bottom: 20px;
}

.title-content {
  display: inline-block;
  padding: 8px 30px;
  color: #00FFFF;
  font-size: 24px;
  font-weight: bold;
  position: relative;
  border: 2px solid #00FFFF;
  background: rgba(0, 255, 255, 0.1);
  clip-path: polygon(0 0, 100% 0, 95% 100%, 5% 100%);
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
  white-space: nowrap;
}

.subtitle {
  font-size: 16px;
  opacity: 0.8;
  margin-top: 4px;
  text-align: center;
}

.robot-image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
  position: relative;
  overflow: hidden;
}

.robot-image img {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  filter: drop-shadow(0 0 10px rgba(0, 255, 255, 0.3));
  transition: transform 0.5s ease;
}

.robot-card.center .robot-image img {
  max-width: 95%;
  max-height: 95%;
}

.specs-section,
.awards-section,
.reason-section {
  margin-bottom: 20px;
}

.section-title {
  color: #00FFFF;
  font-size: 18px;
  margin-bottom: 10px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-title::before {
  content: '';
  width: 4px;
  height: 18px;
  background: #00FFFF;
  display: inline-block;
}

.specs-list,
.awards-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  background: rgba(0, 255, 255, 0.05);
  padding: 10px;
  border-radius: 4px;
}

.spec-item,
.award-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #FFFFFF;
  font-size: 14px;
  position: relative;
  padding-left: 15px;
}

.spec-icon,
.award-icon {
  color: #00FFFF;
  font-size: 12px;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}

.reason-text {
  color: #FFFFFF;
  font-size: 14px;
  line-height: 1.5;
  padding: 10px;
  background: rgba(0, 255, 255, 0.05);
  border-radius: 4px;
}

.carousel-controls {
  display: none;
}

.control-dots {
  display: none;
}

.dot {
  display: none;
}

.earth-bg {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 300px;
  z-index: 1;
}

.earth-bg img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: blur(1px);
}
</style>