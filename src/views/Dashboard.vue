<template>
<<<<<<< HEAD
  <div class="dashboard">
    <div class="header">
      <div class="logo-container">
        <img src="../assets/logo.svg" alt="公司logo" class="logo">
      </div>
      <div class="title">
        <div class="main-title">嘉定区具身智能机器人训练场</div>
        <div class="sub-title">EMBODIED AI & ROBOTICS TRAINING HUB</div>
      </div>
      <div class="datetime">
        <div class="time">0:40</div>
        <div class="date">
          <div>星期一</div>
          <div>2025年4月17日</div>
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
    <div class="content">
      <!-- 第二行 -->
      <div class="chart-row">
        <div class="chart-container">
          <div class="chart-item">
            <h3>受训机器人种类分析</h3>
            <div class="pie-charts-container">
              <div class="pie-section">
                <div class="pie-title">累计受训机器人种类分布</div>
                <div ref="pieChart1" class="pie-chart"></div>
                <div class="pie-legend">
                  <div class="legend-item">
                    <span class="legend-text">工业级机器人</span>
                    <span class="legend-value">40%</span>
                  </div>
                  <div class="legend-item">
                    <span class="legend-text">特种机器人</span>
                    <span class="legend-value">30%</span>
                  </div>
                  <div class="legend-item">
                    <span class="legend-text">服务机器人</span>
                    <span class="legend-value">30%</span>
                  </div>
                </div>
              </div>
              <div class="pie-section">
                <div class="pie-title">3月内受训机器人种类分布</div>
                <div ref="pieChart2" class="pie-chart"></div>
                <div class="pie-legend">
                  <div class="legend-item">
                    <span class="legend-text">工业级机器人</span>
                    <span class="legend-value">45%</span>
                  </div>
                  <div class="legend-item">
                    <span class="legend-text">特种机器人</span>
                    <span class="legend-value">25%</span>
                  </div>
                  <div class="legend-item">
                    <span class="legend-text">服务机器人</span>
                    <span class="legend-value">30%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="chart-item">
            <h3>受训机器人场景分布</h3>
            <div ref="barChart" class="chart"></div>
          </div>
          <div class="chart-item">
            <h3>受训机器人技能分布</h3>
            <div class="stats-container">
              <div class="stat-item">
                <div class="stat-label">操作性能</div>
                <div class="stat-value">012<span class="unit">台</span></div>
              </div>
              <div class="stat-item">
                <div class="stat-label">移动性能</div>
                <div class="stat-value">010<span class="unit">台</span></div>
              </div>
              <div class="stat-item">
                <div class="stat-label">交互性能</div>
                <div class="stat-value">016<span class="unit">台</span></div>
              </div>
              <div class="stat-item">
                <div class="stat-label">其他</div>
                <div class="stat-value">031<span class="unit">台</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 第三行 -->
      <div class="chart-row">
        <div class="chart-container second-row">
          <div class="chart-item">
            <h3>受训机器人实时状态</h3>
            <div class="pie-charts">
              <div ref="pieChart3" class="pie-chart"></div>
            </div>
            <div class="legend">
              <div class="legend-item">
                <span class="legend-color online"></span>
                <span>在线</span>
                <span class="legend-value">60</span>
              </div>
              <div class="legend-item">
                <span class="legend-color offline"></span>
                <span>离线</span>
                <span class="legend-value">30</span>
              </div>
              <div class="legend-item">
                <span class="legend-color error"></span>
                <span>故障</span>
                <span class="legend-value">15</span>
              </div>
            </div>
          </div>
          <div class="chart-item wide-item">
            <h3>具身智能入库数据</h3>
            <div class="data-stats">
              <div class="data-stat">总采集：1.2W</div>
              <div class="data-stat">今日采集：0.3K</div>
            </div>
            <div class="data-container">
              <div class="data-list">
                <div class="list-header">
                  <span>机器人名称</span>
                  <span>数据类型</span>
                  <span>采集量（条）</span>
                </div>
                <div class="list-content">
                  <div class="list-item" v-for="(item, index) in displayData" :key="index">
                    <span>{{ item.name }}</span>
                    <span>{{ item.type }}</span>
                    <span>{{ item.value }}</span>
                  </div>
                </div>
              </div>
              <div class="data-chart" ref="lineChart1"></div>
            </div>
          </div>
        </div>
      </div>
      <!-- 第四行 -->
      <div class="chart-row">
        <div class="chart-container">
          <div class="chart-item company-frame">
            <h3>受训机器人企业</h3>
            <div class="company-title">《历史总数量：97家》</div>
            <div class="company-list">
              <div class="company-scroll">
                <div v-for="(company, index) in visibleCompanies" 
                     :key="index" 
                     :class="['company-item', { active: company.isActive }]">
                  {{ company.name }}
                </div>
              </div>
            </div>
          </div>
          <div class="chart-item">
            <h3>训练场荣誉</h3>
            <div class="honor-carousel">
              <div class="carousel-arrow left" @click="prevHonor">
                <img src="../assets/arrow-left.png" alt="上一个">
              </div>
              <div class="carousel-container">
                <div class="carousel-wrapper">
                  <div v-for="(honor, index) in visibleHonors" :key="index" 
                       :class="['honor-item', getItemClass(index)]">
                    <div class="honor-frame">
                      <div class="corner-tl"></div>
                      <div class="corner-tr"></div>
                      <div class="corner-bl"></div>
                      <div class="corner-br"></div>
                      <img :src="honor.image" :alt="honor.title">
                    </div>
                    <div v-if="index === 1" class="honor-title">{{ honor.title }}</div>
                  </div>
                </div>
              </div>
              <div class="carousel-arrow right" @click="nextHonor">
                <img src="../assets/arrow-right.png" alt="下一个">
              </div>
            </div>
          </div>
          <div class="chart-item">
            <h3>入场人数统计</h3>
            <div ref="lineChart3" class="chart"></div>
          </div>
=======
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
>>>>>>> dev
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
<<<<<<< HEAD
import { ref, onMounted, computed } from 'vue'
import * as echarts from 'echarts'

// 导入awards图片
import awardsImg from '../assets/awards.png'

const pieChart1 = ref(null)
const pieChart2 = ref(null)
const pieChart3 = ref(null)
const barChart = ref(null)
const barChart2 = ref(null)
const lineChart1 = ref(null)
const lineChart2 = ref(null)
const lineChart3 = ref(null)

// 修改数据为6条
const robotData = [
  { name: '仿真机器人', type: '运动控制数据', value: '1.3W' },
  { name: '交互机器人', type: '交互行为数据', value: '16.1K' },
  { name: '管道机器人', type: '几何形变数据', value: '17.3K' },
  { name: '机器狗', type: '关节状态数据', value: '19.1K' },
  { name: '除草机器人', type: '导航定位数据', value: '13.1K' },
  { name: '多模态机器人', type: '多模态感知数据', value: '0.2K' },
  { name: '仿真机器人2', type: '运动控制数据', value: '1.5W' },
  { name: '交互机器人2', type: '交互行为数据', value: '18.1K' }
]

// 复制一份数据用于无缝滚动
const displayData = ref([...robotData, ...robotData])

const companies = [
  '上海新时达电气股份有限公司',
  '杭州云深处科技有限公司',
  '帝蛮神（上海）科技有限公司',
  '珞石机器人集团股份有限公司',
  '松灵机器人有限公司',
  '智能机器人科技有限公司',
  '未来机器人研究院',
  '创新智能科技有限公司',
  '先进机器人系统有限公司',
  '智慧机器人工程有限公司'
]

const displayCompanies = ref([])
const currentIndex = ref(0)
const scrollPosition = ref(0)

// 计算要显示的5家公司
const visibleCompanies = computed(() => {
  const total = companies.length
  let result = []
  for (let i = 0; i < 5; i++) {
    const index = (currentIndex.value + i) % total
    result.push({
      name: companies[index],
      isActive: i === 2 // 中间位置的索引为2
    })
  }
  return result
})

const honors = ref([
  {
    title: '上海市首家全场景机器人综合训练场',
    image: awardsImg
  },
  {
    title: '机器人训练示范基地',
    image: awardsImg
  },
  {
    title: '智能机器人创新中心',
    image: awardsImg
=======
import { ref, onMounted, onUnmounted } from 'vue'
import Header from '../components/Header.vue'
import DashboardPage1 from './DashboardPage1.vue'
import DashboardPage2 from './DashboardPage2.vue'
import DashboardPage3 from './DashboardPage3.vue'
import api from '../api'

const pages = [DashboardPage1, DashboardPage2, DashboardPage3]
const currentPage = ref(0)
const dashboardRef = ref(null)
const autoPlayTimer = ref(null)
const pageDurations = ref([5000, 5000, 5000]) // 默认每页5秒

// 获取轮播配置
const fetchCarouselConfig = async () => {
  try {
    const response = await api.get('/web-configs')
    if (response.items && response.items.length > 0) {
      const config = response.items[0]
      if (config.page_carousel) {
        // 分别设置每页的停留时间（单位：毫秒）
        pageDurations.value = [
          (config.first_page_duration ?? 5) * 1000,
          (config.second_page_duration ?? 5) * 1000,
          (config.third_page_duration ?? 5) * 1000
        ]
        console.log('页面停留时间配置:', pageDurations.value)
        startAutoPlay()
      }
    }
  } catch (error) {
    console.error('获取轮播配置失败:', error)
  }
}

// 开始自动轮播
const startAutoPlay = () => {
  stopAutoPlay() // 先清除之前的定时器
  const duration = pageDurations.value[currentPage.value] // 已经是毫秒单位
  console.log(`当前页面 ${currentPage.value} 的停留时间:`, duration)
  autoPlayTimer.value = setTimeout(() => {
    nextPage()
  }, duration)
}

// 停止自动轮播
const stopAutoPlay = () => {
  if (autoPlayTimer.value) {
    clearTimeout(autoPlayTimer.value)
    autoPlayTimer.value = null
  }
}

const goToPage = (index) => {
  if (index === currentPage.value) return
  currentPage.value = index
  // 不再自动重启轮播
}

const nextPage = () => {
  currentPage.value = (currentPage.value + 1) % 3
  startAutoPlay() // 重新启动定时器
}

const prevPage = () => {
  currentPage.value = (currentPage.value - 1 + 3) % 3
  // 不再自动重启轮播
}

const handleKeydown = (e) => {
  if (e.key === 'ArrowLeft') {
    prevPage()
  } else if (e.key === 'ArrowRight') {
    nextPage()
>>>>>>> dev
  }
])

const currentHonorIndex = ref(0)

const nextHonor = () => {
  currentHonorIndex.value = (currentHonorIndex.value + 1) % honors.value.length
}

const prevHonor = () => {
  currentHonorIndex.value = currentHonorIndex.value === 0 
    ? honors.value.length - 1 
    : currentHonorIndex.value - 1
}

const visibleHonors = computed(() => {
  const total = honors.value.length
  let result = []
  for (let i = 0; i < 3; i++) {
    const index = (currentHonorIndex.value + i) % total
    result.push(honors.value[index])
  }
  return result
})

const getItemClass = (index) => {
  if (index === 1) return 'center'
  if (index === 0) return 'left'
  if (index === 2) return 'right'
  return ''
}

onMounted(() => {
<<<<<<< HEAD
  // 初始化时间显示
  updateTime()
  // 每分钟更新一次时间
  setInterval(updateTime, 60000)
  
  // 修改滚动逻辑
  const scrollList = () => {
    const listContent = document.querySelector('.list-content')
    if (!listContent) return
    
    let scrollTop = 0  // 从0开始滚动
    const scrollStep = () => {
      scrollTop += 0.1  // 进一步降低滚动速度
      if (scrollTop >= 34) {  // 当滚动到一行高度时
        scrollTop = 0  // 重置到顶部
        // 将第一条数据移到末尾
        displayData.value.push(displayData.value[0])
        displayData.value.shift()
      }
      listContent.style.transform = `translateY(-${scrollTop}px)`
      requestAnimationFrame(scrollStep)
    }
    requestAnimationFrame(scrollStep)
  }

  setTimeout(scrollList, 1000)  // 延迟1秒开始滚动

  setTimeout(() => {
    // 初始化第一个饼图
    const chart1 = echarts.init(pieChart1.value, null, {
      devicePixelRatio: window.devicePixelRatio * 2
    })
    chart1.setOption({
      tooltip: {
        trigger: 'item'
      },
      series: [{
        type: 'pie',
        radius: ['50%', '75%'],
        avoidLabelOverlap: false,
        label: {
          show: false
        },
        data: [
          { value: 40, name: '工业级机器人' },
          { value: 30, name: '特种机器人' },
          { value: 30, name: '服务机器人' }
        ],
        color: ['rgba(73, 143, 225, 1)', 'rgba(124, 219, 122, 1)', 'rgba(255, 149, 84, 1)']
      }]
    })

    // 初始化第二个饼图
    const chart2 = echarts.init(pieChart2.value, null, {
      devicePixelRatio: window.devicePixelRatio * 2
    })
    chart2.setOption({
      tooltip: {
        trigger: 'item'
      },
      series: [{
        type: 'pie',
        radius: ['50%', '75%'],
        avoidLabelOverlap: false,
        label: {
          show: false
        },
        data: [
          { value: 45, name: '工业级机器人' },
          { value: 25, name: '特种机器人' },
          { value: 30, name: '服务机器人' }
        ],
        color: ['rgba(73, 143, 225, 1)', 'rgba(124, 219, 122, 1)', 'rgba(255, 149, 84, 1)']
      }]
    })

    // 初始化柱状图
    const myBarChart = echarts.init(barChart.value, null, {
      devicePixelRatio: window.devicePixelRatio * 2
    })
    myBarChart.setOption({
      grid: {
        left: '6%',
        right: '5%',
        bottom: '8%',
        top: '2%',
        containLabel: true
      },
      tooltip: { 
        trigger: 'axis',
        axisPointer: { 
          type: 'shadow' 
        }
      },
      xAxis: {
        type: 'category',
        data: [
          '工业一类场景',
          '工业二类场景',
          '工业三类场景',
          '公共商业场景',
          '居家生活场景',
          '医疗康养场景',
          '教育科研场景',
          '市政运维场景',
          '农林野外场景',
          '低空水域场景'
        ],
        axisLabel: {
          color: '#FFFFFF',
          interval: 0,
          fontSize: 6,
          margin: 12,
          fontWeight: 'bold'
        },
        axisTick: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(255,255,255,0.4)'
          }
        }
      },
      yAxis: {
        type: 'value',
        name: '受训机器人数量（台）',
        nameLocation: 'middle',
        nameGap: 30,
        nameRotate: 90,
        nameTextStyle: {
          color: '#FFFFFF',
          fontSize: 9,
          fontWeight: 'bold',
          padding: [0, 0, 0, -15]
        },
        max: 300,
        interval: 50,
        axisLabel: {
          color: '#FFFFFF',
          fontSize: 10,
          fontWeight: 'bold'
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(255,255,255,0.4)'
          }
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgba(255,255,255,0.4)'
          }
        }
      },
      series: [{
        name: '机器人数量',
        type: 'bar',
        barWidth: '35%',
        data: [
          {value: 280, itemStyle: {color: '#2B85E4'}},
          {value: 236, itemStyle: {color: '#308CE8'}},
          {value: 217, itemStyle: {color: '#3593EC'}},
          {value: 217, itemStyle: {color: '#3A9AF0'}},
          {value: 190, itemStyle: {color: '#3FA1F4'}},
          {value: 149, itemStyle: {color: '#44A8F8'}},
          {value: 123, itemStyle: {color: '#49AFFC'}},
          {value: 101, itemStyle: {color: '#4EB6FF'}},
          {value: 75, itemStyle: {color: '#53BDFF'}},
          {value: 53, itemStyle: {color: '#58C4FF'}}
        ],
        label: {
          show: true,
          position: 'top',
          color: '#FFFFFF',
          fontSize: 10,
          fontWeight: 'bold',
          formatter: '{c}台'
        },
        itemStyle: {
          borderRadius: [4, 4, 0, 0]
        }
      }]
    })

    // 初始化折线图
    const chart = echarts.init(lineChart1.value, null, {
      devicePixelRatio: window.devicePixelRatio * 2
    })
    chart.setOption({
      grid: {
        top: '7%',
        left: '3%',
        right: '20%',
        bottom: '2%',
        containLabel: true,
        height: '80%'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}'
      },
      legend: {
        orient: 'vertical',
        right: '7%',
        top: 'center',
        itemWidth: 6,
        itemHeight: 6,
        itemGap: 12,
        textStyle: {
          color: '#fff',
          fontSize: 6,
          fontWeight: 'bold'
        }
      },
      xAxis: {
        type: 'category',
        data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        axisLabel: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(255,255,255,0.3)'
          }
        }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 2500,
        interval: 500,
        axisLabel: {
          color: '#fff',
          fontSize: 10
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(255,255,255,0.1)'
          }
        }
      },
      series: [
        {
          name: '运动控制数据',
          type: 'bar',
          barGap: '-100%',
          barWidth: 20,
          z: 10,
          data: [2000, null, null, null, null, null, null, null, null, null],
          itemStyle: { color: '#FF6B6B' }
        },
        {
          name: '交互行为数据',
          type: 'bar',
          barGap: '-100%',
          barWidth: 20,
          z: 9,
          data: [null, 1600, null, null, null, null, null, null, null, null],
          itemStyle: { color: '#4ECDC4' }
        },
        {
          name: '几何形变数据',
          type: 'bar',
          barGap: '-100%',
          barWidth: 20,
          z: 8,
          data: [null, null, 2200, null, null, null, null, null, null, null],
          itemStyle: { color: '#FFD93D' }
        },
        {
          name: '关节状态数据',
          type: 'bar',
          barGap: '-100%',
          barWidth: 20,
          z: 7,
          data: [null, null, null, 1800, null, null, null, null, null, null],
          itemStyle: { color: '#6C5CE7' }
        },
        {
          name: '导航定位数据',
          type: 'bar',
          barGap: '-100%',
          barWidth: 20,
          z: 6,
          data: [null, null, null, null, 1500, null, null, null, null, null],
          itemStyle: { color: '#95A5A6' }
        },
        {
          name: '多模态感知数据',
          type: 'bar',
          barGap: '-100%',
          barWidth: 20,
          z: 5,
          data: [null, null, null, null, null, 1200, null, null, null, null],
          itemStyle: { color: '#2ECC71' }
        },
        {
          name: '视觉感知数据',
          type: 'bar',
          barGap: '-100%',
          barWidth: 20,
          z: 4,
          data: [null, null, null, null, null, null, 1900, null, null, null],
          itemStyle: { color: '#E74C3C' }
        },
        {
          name: '语音交互数据',
          type: 'bar',
          barGap: '-100%',
          barWidth: 20,
          z: 3,
          data: [null, null, null, null, null, null, null, 1700, null, null],
          itemStyle: { color: '#3498DB' }
        },
        {
          name: '力反馈数据',
          type: 'bar',
          barGap: '-100%',
          barWidth: 20,
          z: 2,
          data: [null, null, null, null, null, null, null, null, 1400, null],
          itemStyle: { color: '#9B59B6' }
        },
        {
          name: '环境感知数据',
          type: 'bar',
          barGap: '-100%',
          barWidth: 20,
          z: 1,
          data: [null, null, null, null, null, null, null, null, null, 2100],
          itemStyle: { color: '#F1C40F' }
        }
      ]
    })

    // 响应式调整
    window.addEventListener('resize', () => {
      chart1.resize({ animation: { duration: 300 } })
      chart2.resize({ animation: { duration: 300 } })
      myBarChart.resize({ animation: { duration: 300 } })
      chart.resize({ animation: { duration: 300 } })
    })

    // 修改企业名称滚动逻辑
    setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % companies.length
    }, 3000) // 每3秒切换一次

    // 自动轮播
    setInterval(() => {
      nextHonor()
    }, 5000)
  }, 100)
})

// 添加时间更新函数
const updateTime = () => {
  const now = new Date()
  const timeEl = document.querySelector('.time')
  const dateEl = document.querySelector('.date')
  if (timeEl && dateEl) {
    const hours = now.getHours().toString().padStart(2, '0')
    const minutes = now.getMinutes().toString().padStart(2, '0')
    timeEl.textContent = `${hours}:${minutes}`
    
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    const weekday = weekdays[now.getDay()]
    const year = now.getFullYear()
    const month = (now.getMonth() + 1).toString().padStart(2, '0')
    const day = now.getDate().toString().padStart(2, '0')
    dateEl.innerHTML = `<div>${weekday}</div><div>${year}年${month}月${day}日</div>`
=======
  dashboardRef.value?.focus()
  fetchCarouselConfig()
  
  // 监听轮播状态变化
  window.addEventListener('carousel-status-changed', handleCarouselStatusChange)
})

onUnmounted(() => {
  stopAutoPlay()
  // 移除事件监听
  window.removeEventListener('carousel-status-changed', handleCarouselStatusChange)
})

// 处理轮播状态变化
const handleCarouselStatusChange = async (event) => {
  if (event.detail.enabled) {
    // 重新获取配置
    await fetchCarouselConfig()
  } else {
    stopAutoPlay()
>>>>>>> dev
  }
}
</script>

<style scoped>
<<<<<<< HEAD
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
=======
.dashboard-container {
  width: 100%;
  height: 100vh;
  background-color: #000B2A;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
>>>>>>> dev
}

.dashboard {
  width: 1600px;
  height: 1200px;
<<<<<<< HEAD
  background: #0A184B;
  position: relative;
}

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
=======
  background-color: #0A184B;
  position: absolute;
  left: 0;
  top: 0;
  outline: none;
>>>>>>> dev
}

.content {
  padding-top: 110px;
}

.chart-row {
  padding: 0;
  margin-bottom: 20px;
}

.chart-container {
  display: grid;
  grid-template-columns: repeat(3, 518px);
  gap: 10px;
  justify-content: center;
}

.chart-item {
  position: relative;
  width: 518px;
  height: 341px;
  padding: 10px;
  color: #fff;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.chart-item:nth-child(1) {
  background-image: url('../assets/frame_1.png');
}

.chart-item:nth-child(2) {
  background-image: url('../assets/frame_2.png');
}

.chart-item:nth-child(3) {
  background-image: url('../assets/frame_3.png');
}

.chart-item h3 {
  font-size: 21px;
  color: #0EE4F9;
  margin: 20px 0 25px 30px;
  text-align: left;
  line-height: 1;
}

.pie-charts-container {
  display: flex;
  justify-content: center;
  gap: 40px;
  height: calc(100% - 61px);
  padding: 0 20px;
  margin-top: -20px;
}

.pie-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 220px;
}

.pie-title {
  color: #F9F7F7;
  font-size: 9px;
  margin-bottom: 5px;
  text-align: center;
  font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑';
  font-style: normal;
  font-weight: bolder;
}

.pie-chart {
  width: 180px;
  height: 180px;
  margin-bottom: 5px;
  margin-top: -10px;
  position: relative;
  z-index: 1;
}

.pie-section:nth-child(2) .pie-legend {
  width: 100%;
  padding-left: 10px;
  margin-top: -8px;
  position: relative;
  z-index: 2;
}

.pie-section:nth-child(2) .legend-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #F1F2F2;
  font-size: 9px;
  margin-bottom: 6px;
  padding: 7px 5px;
  gap: 0px;
  margin-left: 12px;
  margin-top: -10px;
  width: 100%;
}

.pie-section:nth-child(2) .legend-text {
  color: rgba(255, 255, 255, 0.8);
  margin-right: 2px;
}

.pie-section:nth-child(2) .legend-value {
  color: #0EE4F9;
  margin-left: -20px;
  position: relative;
  left: -10px;
  transform: translateX(-20px);
}

.pie-legend {
  width: 100%;
  padding-left: 25px;
  margin-top: -8px;
  position: relative;
  z-index: 2;
}

.legend-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #F1F2F2;
  font-size: 9px;
  margin-bottom: 6px;
  padding: 7px 5px;
  gap: 0px;
  margin-left: 12px;
  margin-top: -10px;
}

.legend-text {
  color: rgba(255, 255, 255, 0.8);
  margin-right: 2px;
}

.legend-value {
  color: #0EE4F9;
  margin-left: 2px;
}

.chart {
  width: 100%;
  height: calc(100% - 61px);
  min-height: 240px;
}

.legend {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 5px;
}

.legend-color {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-right: 5px;
}

.legend-color.industrial {
  background-color: #5470c6;
}

.legend-color.characteristic {
  background-color: #91cc75;
}

.legend-color.service {
  background-color: #fac858;
}

.legend-color.online {
  background-color: #5470c6;
}

.legend-color.offline {
  background-color: #91cc75;
}

.legend-color.error {
  background-color: #fac858;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px 25px;
  padding: 10px 20px;
  flex: 1;
  margin-top: 10px;
}

.stat-item {
  text-align: left;
}

.stat-item:nth-child(odd) {
  margin-left: 60px;
}

.stat-item:nth-child(-n+2) {
  margin-top: -18px;
}

.stat-item:nth-child(n+3) {
  margin-top: -4px;
}

.stat-label {
  color: #00FFFF;
  font-size: 14px;
  margin-bottom: 5px;
  text-align: left;
}

.stat-item:nth-child(odd) .stat-label {
  margin-left: -25px;
  margin-top: 1px;
  font-weight: bold;
}

.stat-item:nth-child(even) .stat-label {
  margin-left: -10px;
  margin-top: 1px;
  font-weight: bold;
}

.stat-value {
  color: #FFFFFF;
  font-size: 58px;
  font-weight: bold;
  font-family: 'Arial';
  letter-spacing: 18px;
  line-height: 1;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70px;
}

.unit {
  font-size: 14px;
  margin-left: -5px;
  margin-top: 35px;
  color: rgba(255, 255, 255, 0.7);
  display: inline-block;
}

.text-content {
  height: calc(100% - 61px);
  padding: 20px;
  overflow-y: auto;
}

.text-content p {
  margin-bottom: 10px;
  color: rgba(255, 255, 255, 0.8);
}

/* 第二行的frame背景 */
.chart-row:nth-child(1) .chart-item:nth-child(1) {
  background-image: url('../assets/frame_1.png');
}

.chart-row:nth-child(1) .chart-item:nth-child(2) {
  background-image: url('../assets/frame_2.png');
}

.chart-row:nth-child(1) .chart-item:nth-child(3) {
  background-image: url('../assets/frame_3.png');
}

/* 第三行的frame背景 */
.chart-row:nth-child(2) .chart-container {
  display: grid;
  grid-template-columns: 518px 1055px;
  gap: 10px;
  justify-content: center;
}

.chart-row:nth-child(2) .chart-item:nth-child(1) {
  background-image: url('../assets/frame_4.png');
  width: 518px;
  height: 341px;
}

.chart-row:nth-child(2) .chart-item:nth-child(2) {
  background-image: url('../assets/frame_5.png');
  width: 1055px;
  height: 341px;
}

/* 第四行的frame背景 */
.chart-row:nth-child(3) .chart-item:nth-child(1) {
  background-image: url('../assets/frame_6.png');
}

.chart-row:nth-child(3) .chart-item:nth-child(2) {
  background-image: url('../assets/frame_7.png');
}

.chart-row:nth-child(3) .chart-item:nth-child(3) {
  background-image: url('../assets/frame_8.png');
}

.data-container {
  display: flex;
  height: calc(100% - 61px);
  gap: 20px;
  padding: 0 10px;
  margin-top: -5px;
}

.data-list {
  width: 405px;
  display: flex;
  flex-direction: column;
  margin-left: 35px;
}

.list-header {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr;
  height: 34px;
  padding: 0 15px;
  color: #FFFFFF;
  font-size: 10px;
  font-weight: bold;
  align-items: center;
  position: relative;
  z-index: 2;
  background: #0A184B;
}

.list-content {
  flex: none;
  height: 238px;
  overflow: hidden;
  position: relative;
  margin-top: -34px;
  padding-top: 34px;  /* 添加上内边距来容纳标题栏 */
}

.list-item {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr;
  height: 34px;
  padding: 0 15px;
  color: #FFFFFF;
  font-size: 10px;
  font-weight: bold;
  align-items: center;
  border-bottom: 1px solid rgba(59, 160, 232, 1);
  transition: transform 0.1s linear;
}

.list-item:last-child {
  border-bottom: none;
}

.data-chart {
  flex: 1;
  height: 100%;
  margin-left: 10px;
}

.data-stats {
  position: absolute;
  top: 55px;
  right: 65px;
  display: flex;
  gap: 20px;
  z-index: 10;
}

.data-stat {
  color: #00FFFF;
  font-size: 12px;
  font-weight: bold;
  font-family: 'Microsoft YaHei';
}

.company-frame {
  position: relative;
  overflow: hidden;
}

.company-list {
  height: 476px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  padding-top: 0;
  margin-top: -130px; /* 整体向上移动 */
}

.company-scroll {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  transition: transform 0.7s ease;
}

.company-item {
  transition: all 0.3s ease;
  text-align: center;
  white-space: nowrap;
  height: 45px;
  line-height: 45px;
  margin: 0px 0;
  color: #1B3673;
}

.company-item:nth-child(1) {
  font-size: 18px;
  color: rgba(27, 54, 115, 0.7);
  font-weight: bold;
}

.company-item:nth-child(2) {
  font-size: 24px;
  color: rgba(27, 54, 115, 0.9);
  font-weight: bold;
}

.company-item:nth-child(3) {
  font-size: 32px;
  color: #FFFFFF;
  font-weight: bold;
}

.company-item:nth-child(4) {
  font-size: 24px;
  color: rgba(27, 54, 115, 0.9);
  font-weight: bold;
}

.company-item:nth-child(5) {
  font-size: 18px;
  color: rgba(27, 54, 115, 0.7);
  font-weight: bold;
}

.company-title {
  position: absolute;
  right: 20px;
  top: 27px;
  color: #57FFFF;
  font-size: 15px;
  font-family: bold;
}

.honor-carousel {
  position: relative;
  width: 100%;
  height: calc(100% - 61px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 0 40px;
  margin-top: 20px;
}

.carousel-container {
  width: 100%;
  height: 220px;
  position: relative;
<<<<<<< HEAD
  overflow: visible;
=======
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
>>>>>>> dev
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0px;
  width: 100%;
  left: 0;
  transform: none;
}

.honor-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.5s ease;
  opacity: 1;
  transform: none;
  margin: 0 -4px; /* 减小图片之间的间距 */
}

.honor-item.left {
  transform: none;
  opacity: 1;
}

.honor-item.center {
  transform: none;
  opacity: 1;
}

.honor-item.right {
  transform: none;
  opacity: 1;
}

.honor-item .honor-frame {
  position: relative;
  width: 120px;
  height: 160px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s ease;
  border: 2px solid #00FFFF;
  background: rgba(0, 255, 255, 0.1);
}

.honor-item .honor-frame img {
  width: 100px;
  height: 140px;
  object-fit: contain;
}

.honor-item.center .honor-frame {
  width: 140px;
  height: 180px;
  margin-top: 20px;
}

.honor-item.center .honor-frame img {
  width: 120px;
  height: 160px;
}

.honor-title {
  color: #FFFFFF;
  font-size: 14px;
  text-align: center;
  margin-top: 5px;
  width: 180px;
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.carousel-arrow {
  position: absolute;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 3;
  top: 50%;
  transform: translateY(-50%);
}

.carousel-arrow.left {
  left: 0px;
}

.carousel-arrow.right {
  right: 0px;
}

.carousel-arrow img {
  width: 17px;
  height: 34px;
}

.corner-tl, .corner-tr, .corner-bl, .corner-br {
  position: absolute;
  width: 12px;
  height: 12px;
  border-color: #00FFFF;
  z-index: 1;
}

.corner-tl {
  top: -2px;
  left: -2px;
  border-left: 2px solid;
  border-top: 2px solid;
}

.corner-tr {
  top: -2px;
  right: -2px;
  border-right: 2px solid;
  border-top: 2px solid;
}

.corner-bl {
  bottom: -2px;
  left: -2px;
  border-left: 2px solid;
  border-bottom: 2px solid;
}

.corner-br {
  bottom: -2px;
  right: -2px;
  border-right: 2px solid;
  border-bottom: 2px solid;
}
</style>