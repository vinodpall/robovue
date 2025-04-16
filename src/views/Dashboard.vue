<template>
  <div class="dashboard">
    <div class="header">
      <div class="logo-container">
        <img src="../assets/logo.png" alt="公司logo" class="logo">
      </div>
      <div class="title">
        智能制造与机器人国际联创中心
      </div>
      <div class="icons">
        <div class="icon">
          <img src="../assets/tool_1.png" alt="工具1">
        </div>
        <div class="icon">
          <img src="../assets/tool_2.png" alt="工具2">
        </div>
        <div class="icon">
          <img src="../assets/tool_3.png" alt="工具3">
        </div>
      </div>
    </div>
    <div class="content">
      <div class="chart-container">
        <div class="chart-item">
          <h3>数据统计</h3>
          <div ref="chart1" class="chart"></div>
        </div>
        <div class="chart-item">
          <h3>趋势分析</h3>
          <div ref="chart2" class="chart"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const chart1 = ref(null)
const chart2 = ref(null)

onMounted(() => {
  // 初始化图表1
  const myChart1 = echarts.init(chart1.value)
  myChart1.setOption({
    title: {
      text: '数据统计'
    },
    tooltip: {},
    xAxis: {
      data: ['A', 'B', 'C', 'D', 'E']
    },
    yAxis: {},
    series: [{
      name: '数据',
      type: 'bar',
      data: [5, 20, 36, 10, 10]
    }]
  })

  // 初始化图表2
  const myChart2 = echarts.init(chart2.value)
  myChart2.setOption({
    title: {
      text: '趋势分析'
    },
    tooltip: {},
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line'
    }]
  })

  // 响应式调整
  window.addEventListener('resize', () => {
    myChart1.resize()
    myChart2.resize()
  })
})
</script>

<style scoped>
.dashboard {
  width: 100%;
  height: 100%;
  background: #000B2A;
}

.header {
  height: 60px;
  background: linear-gradient(90deg, rgba(0,11,42,0.8) 0%, rgba(0,11,42,0.9) 100%);
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: relative;
}

.logo-container {
  display: flex;
  align-items: center;
  width: 200px;
}

.logo {
  height: 40px;
  width: auto;
}

.title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  white-space: nowrap;
}

.icons {
  display: flex;
  gap: 20px;
  margin-left: auto;
}

.icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.icon:hover {
  background-color: rgba(255,255,255,0.1);
}

.icon img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  height: calc(100% - 100px);
}

.chart-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: 100%;
}

.chart-item {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 20px;
}

.chart {
  width: 100%;
  height: 300px;
}

h1 {
  font-size: 2.5em;
  color: #fff;
}

h3 {
  color: #fff;
  margin-bottom: 15px;
}
</style> 