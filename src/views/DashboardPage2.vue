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
            <div class="corner-line corner-line-tl"></div>
            <div class="corner-line corner-line-tr"></div>
            <div class="corner-line corner-line-bl"></div>
            <div class="corner-line corner-line-br"></div>
            <div class="card-title">
              <div class="title-content">
                <span>{{ robot.name }}</span>
                <div class="subtitle">{{ robot.subtitle }}</div>
              </div>
            </div>
            <div class="robot-image">
              <img :src="robot.image" :alt="robot.name">
            </div>
            <div class="card-content">
              <div class="specs-section">
                <div class="section-title">设备参数</div>
                <div class="specs-list">
                  <div v-for="(spec, idx) in robot.specs" :key="idx" class="spec-item">
                    <span class="spec-icon" style="color: #66FFFF;">◆</span>
                    <span class="spec-text">{{ spec }}</span>
                  </div>
                </div>
              </div>
              <div class="awards-section">
                <div class="section-title">获得荣誉</div>
                <div class="awards-list">
                  <div v-for="(award, idx) in robot.awards" :key="idx" class="award-item">
                    <span class="award-icon">🏅</span>
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
import earthBg from '../assets/earth_bg.svg'

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
  transition: all 0.5s ease;
  transform-style: preserve-3d;
  transform-origin: center;
}

.robot-card.left {
  left: 2%;
  transform: translateX(-10%) rotateY(-15deg) scale(0.85);
  z-index: 1;
  height: 850px;
}

.robot-card.center {
  left: 50%;
  width: 614px;
  height: 850px;
  transform: translateX(-50%) rotateY(0deg) scale(1);
  z-index: 2;
}

.robot-card.right {
  right: 2%;
  transform: translateX(10%) rotateY(15deg) scale(0.85);
  z-index: 1;
  height: 850px;
}

/* 主要边框和背景 */
.robot-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #0A184B;
  border: 2px solid #66FFFF;
  clip-path: polygon(
    12px 0,
    calc(100% - 12px) 0,
    100% 12px,
    100% calc(100% - 12px),
    calc(100% - 12px) 100%,
    12px 100%,
    0 calc(100% - 12px),
    0 12px
  );
  z-index: -1;
}

/* 切角处的边线 */
.robot-card .corner-line {
  position: absolute;
  width: 17px; /* 12px * √2 */
  height: 2px;
  background: #66FFFF;
  pointer-events: none;
}

/* 左上角 */
.robot-card .corner-line-tl {
  top: 0;
  left: 0;
  transform-origin: top left;
  transform: translate(0.5px, 11.5px) rotate(-45deg);
}

/* 右上角 */
.robot-card .corner-line-tr {
  top: 0;
  right: 0;
  transform-origin: top right;
  transform: translate(-0.5px, 11.5px) rotate(45deg);
}

/* 左下角 */
.robot-card .corner-line-bl {
  bottom: 0;
  left: 0;
  transform-origin: bottom left;
  transform: translate(0.5px, -11.5px) rotate(45deg);
}

/* 右下角 */
.robot-card .corner-line-br {
  bottom: 0;
  right: 0;
  transform-origin: bottom right;
  transform: translate(-0.5px, -11.5px) rotate(-45deg);
}

.robot-card .corner {
  display: none;
}

.card-title {
  position: relative;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.title-content {
  width: 320px;
  height: 66px;
  padding: 0;
  color: #66FFFF;
  font-size: 26px;
  font-weight: bold;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: transparent;
}

/* 内层背景 */
.title-content::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  background: #0A184B;
  clip-path: polygon(25px 0, calc(100% - 25px) 0, 100% 50%, calc(100% - 25px) 100%, 25px 100%, 0 50%);
  z-index: -1;
}

/* 外层发光边框 */
.title-content::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #66FFFF;
  clip-path: polygon(25px 0, calc(100% - 25px) 0, 100% 50%, calc(100% - 25px) 100%, 25px 100%, 0 50%);
  z-index: -2;
  box-shadow: 0 0 5px #66FFFF;
}

/* 添加额外的发光层 */
.title-content {
  filter: drop-shadow(0 0 2px #66FFFF);
}

.subtitle {
  font-size: 14px;
  opacity: 0.8;
  margin-top: 2px;
  text-align: center;
  position: relative;
  z-index: 1;
  color: #66FFFF;
}

.robot-image {
  height: 284px;
  min-height: 284px;
  margin: 10px auto;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.robot-image img {
  width: 332px;
  height: 284px;
  object-fit: contain;
  filter: drop-shadow(0 0 10px rgba(0, 255, 255, 0.3));
  transition: transform 0.5s ease;
}

/* 确保所有卡片的图片容器和图片大小一致 */
.robot-card.left .robot-image,
.robot-card.center .robot-image,
.robot-card.right .robot-image {
  height: 284px;
  min-height: 284px;
  margin: 10px auto;
}

.robot-card.left .robot-image img,
.robot-card.center .robot-image img,
.robot-card.right .robot-image img {
  width: 332px;
  height: 284px;
  max-width: none;
  max-height: none;
  object-fit: contain;
}

/* 卡片内容区布局 */
.card-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-top: 10px;
}

.specs-section,
.awards-section,
.reason-section {
  padding: 10px 20px;
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 顶部分隔线 */
.specs-section::before {
  content: '';
  position: absolute;
  left: -20px;
  right: -20px;
  top: 0;
  height: 1px;
  background: #66FFFF;
}

/* 中间和底部分隔线 */
.specs-section::after,
.awards-section::after {
  content: '';
  position: absolute;
  left: -20px;
  right: -20px;
  bottom: 0;
  height: 1px;
  background: #66FFFF;
}

.section-title {
  color: #FFFFFF;
  font-size: 15px;
  font-weight: bold;
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  margin-top: 5px;
}

/* 设备参数标题前的红色图钉 */
.specs-section .section-title::before {
  content: '📌';
  display: inline-block;
  margin-right: 8px;
  font-size: 14px;
}

/* 获得荣誉和推荐理由标题前的奖杯 */
.awards-section .section-title::before,
.reason-section .section-title::before {
  content: '🏆';
  display: inline-block;
  margin-right: 8px;
  font-size: 14px;
}

.specs-list,
.awards-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  flex: 1;
}

.spec-item,
.award-item {
  display: flex;
  align-items: center;
  color: #FFFFFF;
  font-size: 13px;
  position: relative;
}

/* 左右两侧卡片的样式 */
.robot-card.left .spec-item,
.robot-card.right .spec-item,
.robot-card.left .award-item,
.robot-card.right .award-item {
  padding-left: 18px;
}

.robot-card.left .spec-icon,
.robot-card.right .spec-icon,
.robot-card.left .award-icon,
.robot-card.right .award-icon {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  margin-right: 4px;
}

.robot-card.left .spec-text,
.robot-card.right .spec-text,
.robot-card.left .award-text,
.robot-card.right .award-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
  text-align: left;
  color: #FFFFFF;
  font-size: 13px;
}

/* 中间卡片的样式 */
.robot-card.center .spec-item,
.robot-card.center .award-item {
  padding-left: 22px;
}

.robot-card.center .spec-icon,
.robot-card.center .award-icon {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  margin-right: 6px;
}

.robot-card.center .spec-text,
.robot-card.center .award-text {
  text-align: left;
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
  max-width: none;
  color: #FFFFFF;
  font-size: 13px;
}

/* 推荐理由文本样式 */
.reason-text {
  color: #FFFFFF;
  font-size: 13px;
  line-height: 1.6;
  text-align: left;
}

.robot-card.left .reason-text,
.robot-card.right .reason-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.robot-card.center .reason-text {
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
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
  height: 131px;
  z-index: 1;
  transform: translateY(-85px);
}

.earth-bg img {
  width: 1377px;
  height: 131px;
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
}
</style>