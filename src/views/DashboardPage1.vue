<template>
  <div class="page-content">
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
                  <span class="legend-text">工业机器人</span>
                  <span class="legend-value">{{ robotTypeAnalysis.all_robots[0]?.percentage || 0 }}%</span>
                </div>
                <div class="legend-item">
                  <span class="legend-text">特种机器人</span>
                  <span class="legend-value">{{ robotTypeAnalysis.all_robots[1]?.percentage || 0 }}%</span>
                </div>
                <div class="legend-item">
                  <span class="legend-text">服务机器人</span>
                  <span class="legend-value">{{ robotTypeAnalysis.all_robots[2]?.percentage || 0 }}%</span>
                </div>
              </div>
            </div>
            <div class="pie-section">
              <div class="pie-title">{{ currentMonth }}月内受训机器人种类分布</div>
              <div ref="pieChart2" class="pie-chart"></div>
              <div class="pie-legend">
                <div class="legend-item">
                  <span class="legend-text">工业机器人</span>
                  <span class="legend-value">{{ robotTypeAnalysis.training_robots[0]?.percentage || 0 }}%</span>
                </div>
                <div class="legend-item">
                  <span class="legend-text">特种机器人</span>
                  <span class="legend-value">{{ robotTypeAnalysis.training_robots[1]?.percentage || 0 }}%</span>
                </div>
                <div class="legend-item">
                  <span class="legend-text">服务机器人</span>
                  <span class="legend-value">{{ robotTypeAnalysis.training_robots[2]?.percentage || 0 }}%</span>
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
            <div class="stat-item" v-for="item in robotSkillStats" :key="item.skill">
              <div class="stat-label">{{ item.skill }}</div>
              <div class="stat-value">{{ item.count.toString().padStart(3, '0') }}<span class="unit">台</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="chart-row">
      <div class="chart-container second-row">
        <div class="chart-item">
          <h3>受训机器人实时状态</h3>
          <div class="pie-charts">
            <div ref="pieChart3" class="pie-chart"></div>
            <div class="circle-progress">
              <!-- 外环底色 -->
              <div class="outer-circle-base"></div>
              <!-- 外环旋转部分 -->
              <div class="outer-circle-rotating"></div>
              <!-- 内环底色 -->
              <div class="inner-circle-base"></div>
              <!-- 内环旋转部分 -->
              <div class="inner-circle-rotating"></div>
              <!-- 虚线装饰 -->
              <div class="inner-dashed-circle"></div>
              <!-- 内部蓝色细线 -->
              <div class="inner-line-circle"></div>
              <!-- 内部深色圆圈 -->
              <div class="inner-dark-circle"></div>
              <!-- 中心内容 -->
              <div class="inner-content">
                <div class="label">总数</div>
                <div class="value">{{ robotStatusStats.total }}</div>
              </div>
            </div>
            <div class="legend">
              <div class="legend-item">
                <span class="legend-color online"></span>
                <span>在线</span>
                <span class="legend-value">{{ robotStatusStats.online }}</span>
              </div>
              <div class="legend-item">
                <span class="legend-color offline"></span>
                <span>离线</span>
                <span class="legend-value">{{ robotStatusStats.offline }}</span>
              </div>
              <div class="legend-item">
                <span class="legend-color error"></span>
                <span>故障</span>
                <span class="legend-value">{{ robotStatusStats.fault }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="chart-item wide-item">
          <h3>具身智能入库数据</h3>
          <div class="data-stats">
            <div class="data-stat">总采集：{{ totalCollect }}条</div>
            <div class="data-stat">今日采集：{{ todayCollect }}条</div>
          </div>
          <div class="data-container">
            <div class="data-list">
              <div class="list-header">
                <span>机器人名称</span>
                <span>数据类型</span>
                <span>采集量（条）</span>
              </div>
              <div class="list-content">
                <div class="list-scroll">
                  <div class="list-item" v-for="(item, index) in dataRecords" :key="index">
                    <span>{{ item.name }}</span>
                    <span>{{ item.type }}</span>
                    <span>{{ item.value }}</span>
                  </div>
                  <div class="list-item" v-for="(item, index) in dataRecords" :key="'clone-'+index">
                    <span>{{ item.name }}</span>
                    <span>{{ item.type }}</span>
                    <span>{{ item.value }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="data-chart" ref="lineChart1"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="chart-row">
      <div class="chart-container">
        <div class="chart-item company-frame">
          <h3>受训机器人企业</h3>
          <div class="company-title">《历史总数量：{{ totalCompanies }}家》</div>
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
              <img src="../assets/arrow-left.svg" alt="上一个">
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
              <img src="../assets/arrow-right.svg" alt="下一个">
            </div>
          </div>
        </div>
        <div class="chart-item">
          <h3>入场人数统计</h3>
          <div class="entrance-stats">
            <div class="stats-item">周累计: <span>{{ weeklyCount }}</span></div>
            <div class="stats-item">月累计: <span>{{ monthlyCount }}</span></div>
          </div>
          <div ref="lineChart3" class="entrance-chart"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import * as echarts from 'echarts'
import api from '../api'

// 导入awards图片
import awardsImg from '../assets/awards.png'
import awardsImg2 from '../assets/awards_2.png'
import awardsImg3 from '../assets/awards_3.png'

const pieChart1 = ref(null)
const pieChart2 = ref(null)
const pieChart3 = ref(null)
const barChart = ref(null)
const lineChart1 = ref(null)
const lineChart3 = ref(null)

// 数据
const weeklyCount = ref(0)
const monthlyCount = ref(0)
const companyIndex = ref(0)

// 添加机器人类型分析数据
const robotTypeAnalysis = ref({
  all_robots: [],
  training_robots: []
})

// 添加场景分布数据
const trainingFieldsData = ref([])

// 添加技能分布数据
const robotSkillStats = ref([
  { skill: '操作性能', count: 0 },
  { skill: '移动性能', count: 0 },
  { skill: '交互性能', count: 0 },
  { skill: '其他', count: 0 }
])

// 添加机器人状态数据
const robotStatusStats = ref({
  online: 0,
  offline: 0,
  fault: 0,
  total: 0
})

// 添加数据记录相关数据
const dataTypeStats = ref([])
const dataRecords = ref([])
const totalCollect = ref(0)
const todayCollect = ref(0)

// 添加企业数据
const companies = ref([])
const totalCompanies = ref(0)

// 添加荣誉数据
const honors = ref([])
const currentHonorIndex = ref(0)

// 添加入场人数统计数据
const visitorStats = ref([])

// 获取机器人类型分析数据
const fetchRobotTypeAnalysis = async () => {
  try {
    const response = await api.get('/robot-types/analysis')
    // 确保数据按照固定顺序排列
    const order = ['工业机器人', '特种机器人', '服务机器人']
    robotTypeAnalysis.value = {
      all_robots: order.map(type => 
        response.all_robots.find(item => item.type === type) || { type, count: 0, percentage: 0 }
      ),
      training_robots: order.map(type => 
        response.training_robots.find(item => item.type === type) || { type, count: 0, percentage: 0 }
      )
    }
    // 重新初始化图表
    initCharts()
  } catch (error) {
    console.error('获取机器人类型分析数据失败:', error)
  }
}

// 获取场景分布数据
const fetchTrainingFieldsData = async () => {
  try {
    const response = await api.get('/training-fields/robot-stats')
    trainingFieldsData.value = response
    // 更新柱状图
    updateBarChart()
  } catch (error) {
    console.error('获取场景分布数据失败:', error)
  }
}

// 获取技能分布数据
const fetchRobotSkillStats = async () => {
  try {
    const response = await api.get('/robots/skill-stats')
    // 保证顺序与页面一致
    const order = ['操作性能', '移动性能', '交互性能', '其他']
    robotSkillStats.value = order.map(skill =>
      response.find(item => item.skill === skill) || { skill, count: 0 }
    )
  } catch (error) {
    console.error('获取机器人技能分布数据失败:', error)
  }
}

// 获取机器人状态数据
const fetchRobotStatusStats = async () => {
  try {
    const response = await api.get('/robots/status-stats')
    robotStatusStats.value = response
  } catch (error) {
    console.error('获取机器人状态数据失败:', error)
  }
}

// 获取数据类型统计数据
const fetchDataTypeStats = async () => {
  try {
    const response = await api.get('/data-records/type-stats')
    dataTypeStats.value = response.type_stats
    // 更新总采集量和今日采集量
    totalCollect.value = response.total_count
    todayCollect.value = response.today_count
    // 更新柱状图
    updateDataTypeChart()
  } catch (error) {
    console.error('获取数据类型统计数据失败:', error)
  }
}

// 获取数据记录列表
const fetchDataRecords = async () => {
  try {
    const response = await api.get('/data-records')
    // 只取需要的字段
    dataRecords.value = response.items.map(item => ({
      name: item.robot.name,
      type: item.data_type.name,
      value: item.count
    }))
    // 计算总采集量
    totalCollect.value = response.total
    // 计算今日采集量（假设第一条是今天的）
    todayCollect.value = response.items[0]?.count || 0
  } catch (error) {
    console.error('获取数据记录列表失败:', error)
  }
}

// 获取企业数据
const fetchCompanies = async () => {
  try {
    const response = await api.get('/companies')
    // 保存总数
    totalCompanies.value = response.items.length
    // 只保留is_carousel为true的企业用于滚动显示
    companies.value = response.items.filter(company => company.is_carousel)
    // 开始企业名称滚动
    startCompanyScroll()
  } catch (error) {
    console.error('获取企业数据失败:', error)
  }
}

// 开始企业名称滚动
const startCompanyScroll = () => {
  setInterval(() => {
    if (companies.value.length > 0) {
      companyIndex.value = (companyIndex.value + 1) % companies.value.length
    }
  }, 3000)
}

// 计算要显示的5家公司
const visibleCompanies = computed(() => {
  if (!companies.value.length) return []
  
  const total = companies.value.length
  let result = []
  for (let i = 0; i < 5; i++) {
    const index = (companyIndex.value + i) % total
    result.push({
      name: companies.value[index]?.name || '',
      isActive: i === 2 // 中间位置的索引为2
    })
  }
  return result
})

// 更新饼图
const updatePieCharts = () => {
  if (!pieChart1.value || !pieChart2.value) return
  
  // 更新第一个饼图（累计受训机器人种类分布）
  const chart1 = echarts.init(pieChart1.value, null, {
    devicePixelRatio: window.devicePixelRatio * 2
  })
  
  const allRobotsData = robotTypeAnalysis.value.all_robots.map(item => ({
    value: item.percentage,
    name: item.type
  }))
  
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
      data: allRobotsData,
      color: ['rgba(73, 143, 225, 1)', 'rgba(124, 219, 122, 1)', 'rgba(255, 149, 84, 1)']
    }]
  })

  // 更新第二个饼图（3月内受训机器人种类分布）
  const chart2 = echarts.init(pieChart2.value, null, {
    devicePixelRatio: window.devicePixelRatio * 2
  })
  
  const trainingRobotsData = robotTypeAnalysis.value.training_robots.map(item => ({
    value: item.percentage,
    name: item.type
  }))
  
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
      data: trainingRobotsData,
      color: ['rgba(73, 143, 225, 1)', 'rgba(124, 219, 122, 1)', 'rgba(255, 149, 84, 1)']
    }]
  })

  // 更新图例数据
  updateLegends()
}

// 更新图例数据
const updateLegends = () => {
  const allRobots = robotTypeAnalysis.value.all_robots
  const trainingRobots = robotTypeAnalysis.value.training_robots

  // 更新第一个图表的图例
  const firstLegend = document.querySelector('.pie-section:first-child .pie-legend')
  if (firstLegend) {
    firstLegend.innerHTML = allRobots.map(item => `
      <div class="legend-item">
        <span class="legend-text">${item.type}</span>
        <span class="legend-value">${item.percentage}%</span>
      </div>
    `).join('')
  }

  // 更新第二个图表的图例
  const secondLegend = document.querySelector('.pie-section:nth-child(2) .pie-legend')
  if (secondLegend) {
    secondLegend.innerHTML = trainingRobots.map(item => `
      <div class="legend-item">
        <span class="legend-text">${item.type}</span>
        <span class="legend-value">${item.percentage}%</span>
      </div>
    `).join('')
  }
}

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

// 获取荣誉数据
const fetchHonors = async () => {
  try {
    const response = await api.get('/awards')
    // 只保留is_carousel为true的荣誉
    honors.value = response.items
      .filter(honor => honor.is_carousel)
      .map(honor => ({
        title: honor.name,
        image: import.meta.env.VITE_API_BASE_URL + honor.image_url
      }))
  } catch (error) {
    console.error('获取荣誉数据失败:', error)
  }
}

const nextHonor = () => {
  if (honors.value.length > 0) {
    currentHonorIndex.value = (currentHonorIndex.value + 1) % honors.value.length
  }
}

const prevHonor = () => {
  if (honors.value.length > 0) {
    currentHonorIndex.value = currentHonorIndex.value === 0 
      ? honors.value.length - 1 
      : currentHonorIndex.value - 1
  }
}

const visibleHonors = computed(() => {
  if (!honors.value.length) return []
  
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

// 初始化图表
const initCharts = () => {
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
      data: robotTypeAnalysis.value.all_robots.map(item => ({
        value: item.percentage,
        name: item.type
      })),
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
      data: robotTypeAnalysis.value.training_robots.map(item => ({
        value: item.percentage,
        name: item.type
      })),
      color: ['rgba(73, 143, 225, 1)', 'rgba(124, 219, 122, 1)', 'rgba(255, 149, 84, 1)']
    }]
  })

  // 初始化柱状图
  if (trainingFieldsData.value.length > 0) {
    updateBarChart()
  }

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
      data: dataTypeStats.value.map(item => item.type_name),
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
    series: dataTypeStats.value.map((item, index) => ({
      name: item.type_name,
      type: 'bar',
      barGap: '-100%',
      barWidth: 20,
      z: 10 - index,
      data: Array(dataTypeStats.value.length).fill(null).map((_, i) => 
        i === index ? item.count : null
      ),
      itemStyle: {
        color: [
          '#FF6B6B',
          '#4ECDC4',
          '#FFD93D',
          '#6C5CE7',
          '#95A5A6',
          '#2ECC71',
          '#E74C3C',
          '#3498DB',
          '#9B59B6',
          '#F1C40F'
        ][index]
      }
    }))
  })

  // 初始化入场人数统计图表
  const lineChart3Instance = echarts.init(lineChart3.value, null, { devicePixelRatio: window.devicePixelRatio * 2 })
  const visitorsData = [
    { date: '11/20', value: 10 },
    { date: '11/21', value: 15 },
    { date: '11/22', value: 120 },
    { date: '11/23', value: 130 },
    { date: '11/24', value: 187 },
    { date: '11/25', value: 85 },
    { date: '11/26', value: 4 },
    { date: '11/27', value: 8 },
    { date: '11/28', value: 35 },
    { date: '11/29', value: 15 }
  ]
  const optionLine3 = {
    grid: { 
      left: '6%',
      right: '5%',
      bottom: '8%',
      top: '8%',
      containLabel: true
    },
    xAxis: { 
      type: 'category', 
      boundaryGap: true,
      data: visitorsData.map(i => i.date), 
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.3)' } }, 
      axisLabel: { 
        color: '#fff', 
        fontSize: 12,
        margin: 12,
        interval: 1
      }, 
      splitLine: { 
        show: true, 
        lineStyle: { color: 'rgba(255,255,255,0.1)' },
        interval: 0
      } 
    },
    yAxis: { 
      type: 'value', 
      min: 0, 
      max: 200, 
      interval: 50, 
      axisLabel: { 
        color: '#fff', 
        fontSize: 12,
        margin: 8
      }, 
      splitLine: { 
        show: true, 
        lineStyle: { 
          color: 'rgba(255,255,255,0.1)',
          type: 'dashed'
        } 
      } 
    },
    series: [{
      data: visitorsData.map(i => i.value), type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
      itemStyle: { color: '#00FFFF' }, lineStyle: { color: '#00FFFF', width: 2 }, areaStyle: { color: new echarts.graphic.LinearGradient(0,0,0,1, [{ offset:0, color:'rgba(0,255,255,0.3)' },{ offset:1, color:'rgba(0,255,255,0)' }]) },
      markPoint: { symbol: 'circle', symbolSize: 8, data: [{ type:'max', name:'最大值' }, { type:'min', name:'最小值' }], itemStyle:{ color:'#00FFFF' }, label:{ color:'#fff' }}
    }]
  }
  lineChart3Instance.setOption(optionLine3)
  window.addEventListener('resize', () => { lineChart3Instance.resize() })

  // 响应式调整
  window.addEventListener('resize', () => {
    chart2.resize({ animation: { duration: 300 } })
    chart.resize({ animation: { duration: 300 } })
  })
}

// 更新柱状图
const updateBarChart = () => {
  if (!barChart.value) return
  
  const myBarChart = echarts.init(barChart.value, null, {
    devicePixelRatio: window.devicePixelRatio * 2
  })
  
  const option = {
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
      data: trainingFieldsData.value.map(item => item.field_name),
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
      data: trainingFieldsData.value.map((item, index) => ({
        value: item.robot_count + 250 - (index * 20),
        itemStyle: {
          color: `rgba(${73 + index * 5}, ${143 + index * 5}, ${225 + index * 5}, 1)`
        }
      })),
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
  }

  myBarChart.setOption(option)

  // 响应式调整
  window.addEventListener('resize', () => {
    myBarChart.resize({ animation: { duration: 300 } })
  })
}

// 更新数据类型柱状图
const updateDataTypeChart = () => {
  if (!lineChart1.value) return
  
  const chart = echarts.init(lineChart1.value, null, {
    devicePixelRatio: window.devicePixelRatio * 2
  })
  
  const option = {
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
      data: dataTypeStats.value.map(item => item.type_name),
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
    series: dataTypeStats.value.map((item, index) => ({
      name: item.type_name,
      type: 'bar',
      barGap: '-100%',
      barWidth: 20,
      z: 10 - index,
      data: Array(dataTypeStats.value.length).fill(null).map((_, i) => 
        i === index ? item.count : null
      ),
      itemStyle: {
        color: [
          '#FF6B6B',
          '#4ECDC4',
          '#FFD93D',
          '#6C5CE7',
          '#95A5A6',
          '#2ECC71',
          '#E74C3C',
          '#3498DB',
          '#9B59B6',
          '#F1C40F'
        ][index]
      }
    }))
  }

  chart.setOption(option)
  
  // 响应式调整
  window.addEventListener('resize', () => {
    chart.resize({ animation: { duration: 300 } })
  })
}

// 获取入场人数统计数据
const fetchVisitorStats = async () => {
  try {
    const response = await api.get('/visitor-records/stats')
    // 更新周累计和月累计
    weeklyCount.value = response.week_total
    monthlyCount.value = response.month_total
    // 更新每日统计数据
    visitorStats.value = response.daily_stats.map(item => ({
      date: item.date.split('-').slice(1).join('/'), // 转换为 MM/DD 格式
      value: item.count
    }))
    // 更新图表
    updateVisitorChart()
  } catch (error) {
    console.error('获取入场人数统计数据失败:', error)
  }
}

// 更新入场人数统计图表
const updateVisitorChart = () => {
  if (!lineChart3.value) return
  
  const lineChart3Instance = echarts.init(lineChart3.value, null, { 
    devicePixelRatio: window.devicePixelRatio * 2 
  })
  
  const optionLine3 = {
    grid: { 
      left: '6%',
      right: '5%',
      bottom: '8%',
      top: '8%',
      containLabel: true
    },
    xAxis: { 
      type: 'category', 
      boundaryGap: true,
      data: visitorStats.value.map(i => i.date), 
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.3)' } }, 
      axisLabel: { 
        color: '#fff', 
        fontSize: 12,
        margin: 12,
        interval: 1
      }, 
      splitLine: { 
        show: true, 
        lineStyle: { color: 'rgba(255,255,255,0.1)' },
        interval: 0
      } 
    },
    yAxis: { 
      type: 'value', 
      min: 0, 
      max: Math.max(...visitorStats.value.map(i => i.value)) * 1.2, // 动态设置最大值
      interval: Math.ceil(Math.max(...visitorStats.value.map(i => i.value)) * 1.2 / 4), // 动态设置间隔
      axisLabel: { 
        color: '#fff', 
        fontSize: 12,
        margin: 8
      }, 
      splitLine: { 
        show: true, 
        lineStyle: { 
          color: 'rgba(255,255,255,0.1)',
          type: 'dashed'
        } 
      } 
    },
    series: [{
      data: visitorStats.value.map(i => i.value), 
      type: 'line', 
      smooth: true, 
      symbol: 'circle', 
      symbolSize: 6,
      itemStyle: { color: '#00FFFF' }, 
      lineStyle: { color: '#00FFFF', width: 2 }, 
      areaStyle: { 
        color: new echarts.graphic.LinearGradient(0,0,0,1, [
          { offset:0, color:'rgba(0,255,255,0.3)' },
          { offset:1, color:'rgba(0,255,255,0)' }
        ]) 
      },
      markPoint: { 
        symbol: 'circle', 
        symbolSize: 8, 
        data: [
          { type:'max', name:'最大值' }, 
          { type:'min', name:'最小值' }
        ], 
        itemStyle:{ color:'#00FFFF' }, 
        label:{ color:'#fff' }
      }
    }]
  }
  
  lineChart3Instance.setOption(optionLine3)
  window.addEventListener('resize', () => { lineChart3Instance.resize() })
}

const currentMonth = ref(new Date().getMonth() + 1)

onMounted(() => {
  // 获取机器人类型分析数据
  fetchRobotTypeAnalysis()
  // 获取场景分布数据
  fetchTrainingFieldsData()
  // 获取技能分布数据
  fetchRobotSkillStats()
  // 获取机器人状态数据
  fetchRobotStatusStats()
  // 获取数据类型统计数据
  fetchDataTypeStats()
  // 获取数据记录列表
  fetchDataRecords()
  // 获取企业数据
  fetchCompanies()
  // 获取荣誉数据
  fetchHonors()
  // 获取入场人数统计数据
  fetchVisitorStats()
  
  // 初始化图表
  initCharts()
  
  // 自动轮播荣誉
  setInterval(() => {
    nextHonor()
  }, 5000)
})
</script>

<style scoped>
.page-content {
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chart-row {
  display: flex;
  justify-content: center;
  width: 100%;
}

.chart-container {
  display: grid;
  grid-template-columns: repeat(3, 518px);
  gap: 10px;
  justify-content: center;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
}

.chart-container.second-row {
  grid-template-columns: 518px 1055px;
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

.chart-item.wide-item {
  width: 1055px;
}

.chart-item h3 {
  font-size: 21px;
  color: #0EE4F9;
  margin: 20px 0 25px 30px;
  text-align: left;
  line-height: 1;
}

.chart {
  width: 100%;
  height: calc(100% - 61px);
  min-height: 240px;
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

/* 单独设置第一个图表的图例样式 */
.pie-section:first-child .legend-value {
  color: #FFFFFF;
}

/* 单独设置第二个图表的图例样式 */
.pie-section:nth-child(2) .pie-legend {
  padding-left: 15px;
}

.pie-section:nth-child(2) .legend-item {
  margin-left: 8px;
  display: flex;
  justify-content: flex-start;
  gap: 75px;
}

.pie-section:nth-child(2) .legend-text {
  min-width: 60px;
  text-align: left;
  margin-right: 0;
}

.pie-section:nth-child(2) .legend-value {
  color: #FFFFFF;
  margin-left: 5px;
  text-align: left;
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
  margin-top: 2px;
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
  border-bottom: 1px solid rgba(59, 160, 232, 1);
}

.list-content {
  flex: none;
  height: 204px;
  overflow: hidden;
  position: relative;
  margin-top: 0;
  padding-top: 0;
}

.list-scroll {
  animation: scrollList 15s linear infinite;
  display: flex;
  flex-direction: column;
}

@keyframes scrollList {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(calc(-50% - 17px));
  }
}

.list-scroll:hover {
  animation-play-state: paused;
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
  flex-shrink: 0;
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
  top: 52px;
  right: 78px;
  display: flex;
  gap: 20px;
  z-index: 100;
  pointer-events: none;
}

.data-stat {
  color: #00FFFF;
  font-size: 12px;
  font-family: 'Microsoft YaHei';
  text-shadow: 0 0 2px rgba(0, 255, 255, 0.5);
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
  margin-top: -130px;
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
  overflow: visible;
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
  margin: 0 -4px;
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

.entrance-stats {
  position: absolute;
  top: 25px;
  right: 35px;
  display: flex;
  gap: 20px;
  color: #00FFFF;
  font-size: 14px;
}

.entrance-stats .stats-item span {
  font-weight: bold;
  font-size: 11px;
}

.entrance-chart {
  position: absolute;
  top: 47px;
  left: 0px;
  width: 500px;
  height: 280px;
}

/* 第一行的frame背景 */
.chart-row:nth-child(1) .chart-item:nth-child(1) {
  background-image: url('../assets/frame_1.png');
}

.chart-row:nth-child(1) .chart-item:nth-child(2) {
  background-image: url('../assets/frame_2.png');
}

.chart-row:nth-child(1) .chart-item:nth-child(3) {
  background-image: url('../assets/frame_3.png');
}

/* 第二行的frame背景 */
.chart-row:nth-child(2) .chart-item:nth-child(1) {
  background-image: url('../assets/frame_4.png');
}

.chart-row:nth-child(2) .chart-item:nth-child(2) {
  background-image: url('../assets/frame_5.png');
}

/* 第三行的frame背景 */
.chart-row:nth-child(3) .chart-item:nth-child(1) {
  background-image: url('../assets/frame_6.png');
}

.chart-row:nth-child(3) .chart-item:nth-child(2) {
  background-image: url('../assets/frame_7.png');
}

.chart-row:nth-child(3) .chart-item:nth-child(3) {
  background-image: url('../assets/frame_8.png');
}

.pie-charts {
  position: relative;
  width: 100%;
  height: calc(100% - 61px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.circle-progress {
  position: absolute;
  width: 240px;
  height: 240px;
  z-index: 2;
  transform: translate(-40px, -20px);
}

.outer-circle-base {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 18px solid rgba(0, 0, 0, 0.15);
  border-radius: 50%;
  border-left: 18px solid #74afff;
  border-bottom: 18px solid #74afff;
  transform: rotate(-90deg);
}

.outer-circle-rotating {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 18px solid transparent;
  border-radius: 50%;
  border-top: 18px solid #FF9500;
  transform-origin: center;
  animation: rotateOuter 4s linear infinite;
}

.inner-circle-base {
  position: absolute;
  width: 75%;
  height: 75%;
  left: 12.5%;
  top: 12.5%;
  border: 18px solid rgba(0, 0, 0, 0.15);
  border-radius: 50%;
  border-left: 18px solid #74afff;
  border-bottom: 18px solid #74afff;
  transform: rotate(135deg);
}

.inner-circle-rotating {
  position: absolute;
  width: 75%;
  height: 75%;
  left: 12.5%;
  top: 12.5%;
  border: 18px solid transparent;
  border-radius: 50%;
  border-top: 18px solid #00FFFF;
  transform-origin: center;
  animation: rotateInner 3s linear infinite;
}

.inner-line-circle {
  position: absolute;
  width: 50%;
  height: 50%;
  left: 25%;
  top: 25%;
  border: 2px solid #00FFFF;
  border-radius: 50%;
  box-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
}

.inner-dark-circle {
  position: absolute;
  width: 45%;
  height: 45%;
  left: 27.5%;
  top: 27.5%;
  border: 3px solid rgba(0, 255, 255, 0.5);
  border-radius: 50%;
  box-shadow: 0 0 4px rgba(0, 255, 255, 0.3);
}

.inner-dashed-circle {
  position: absolute;
  width: 75%;
  height: 75%;
  left: 12.5%;
  top: 12.5%;
  border: 2px dashed rgba(0, 255, 255, 0.3);
  border-radius: 50%;
  box-shadow: 0 0 3px rgba(0, 255, 255, 0.2);
}

.dashed-circle {
  position: absolute;
  width: 88%;
  height: 88%;
  left: 6%;
  top: 6%;
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}

.inner-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #00FFFF;
  display: flex;
  align-items: center;
  gap: 10px;
}

.inner-content .label {
  font-size: 14px;
  margin-bottom: 0;
}

.inner-content .value {
  font-size: 32px;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
  color: #FF9500;
}

@keyframes rotateOuter {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-360deg);
  }
}

@keyframes rotateInner {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.pie-chart {
  position: relative;
  width: 180px;
  height: 180px;
  z-index: 1;
}

.pie-charts .legend {
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.pie-charts .legend-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #FFFFFF;
  font-size: 14px;
}

.pie-charts .legend-color {
  width: 14px;
  height: 14px;
  border-radius: 50%;
}

.pie-charts .legend-color.online {
  background-color: #00FFFF;
  box-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
}

.pie-charts .legend-color.offline {
  background-color: #FF9500;
  box-shadow: 0 0 5px rgba(255, 149, 0, 0.5);
}

.pie-charts .legend-color.error {
  background-color: #FF3B30;
  box-shadow: 0 0 5px rgba(255, 59, 48, 0.5);
}

.pie-charts .legend-value {
  color: #FFFFFF;
  font-weight: bold;
  margin-left: 8px;
  font-size: 16px;
}
</style> 