<template>
  <div class="dashboard">
    <div class="header">
      <div class="logo-container">
        <img src="../assets/logo.png" alt="公司logo" class="logo">
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
      <!-- 第二行 -->
      <div class="chart-row">
        <div class="chart-container">
          <div class="chart-item">
            <h3>数据分布</h3>
            <div class="description">爱训机器人种类分析</div>
            <div class="pie-charts">
              <div ref="pieChart1" class="pie-chart"></div>
              <div ref="pieChart2" class="pie-chart"></div>
            </div>
            <div class="legend">
              <div class="legend-item">
                <span class="legend-color industrial"></span>
                <span>工业机器人</span>
                <span class="legend-value">40%</span>
              </div>
              <div class="legend-item">
                <span class="legend-color characteristic"></span>
                <span>特种机器人</span>
                <span class="legend-value">30%</span>
              </div>
              <div class="legend-item">
                <span class="legend-color service"></span>
                <span>服务机器人</span>
                <span class="legend-value">30%</span>
              </div>
            </div>
          </div>
          <div class="chart-item">
            <h3>爱训机器人数量分析</h3>
            <div ref="barChart" class="chart"></div>
          </div>
          <div class="chart-item">
            <h3>爱训机器人技能分析</h3>
            <div class="stats-container">
              <div class="stat-item">
                <div class="stat-label">操作性能</div>
                <div class="stat-value">012</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">移动性能</div>
                <div class="stat-value">010</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">交互性能</div>
                <div class="stat-value">016</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">其他</div>
                <div class="stat-value">031</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 第三行 -->
      <div class="chart-row">
        <div class="chart-container">
          <div class="chart-item">
            <h3>爱训机器人A状态分析</h3>
            <div class="description">在线率: 97%</div>
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
          <div class="chart-item">
            <h3>爱训机器人A使用率</h3>
            <div class="description">7 天使用 · 均日</div>
            <div ref="lineChart1" class="chart"></div>
          </div>
          <div class="chart-item">
            <h3>在线人数统计</h3>
            <div class="description">在线率对比</div>
            <div ref="barChart2" class="chart"></div>
          </div>
        </div>
      </div>
      <!-- 第四行 -->
      <div class="chart-row">
        <div class="chart-container">
          <div class="chart-item">
            <h3>爱训机器人A信息</h3>
            <div class="description">IDR状态: 7AFC</div>
            <div class="text-content">
              <p>上海海事大学信息科学研究所</p>
              <p>上海海事大学技能技术研究所</p>
              <p>新能源（上海）科技有限责任公司</p>
              <p>爱训机器人集团股份有限公司</p>
              <p>检测机器人 A 集团</p>
              <p>上海海事警察安全规则机器人交通运动</p>
            </div>
          </div>
          <div class="chart-item">
            <h3>爱训机器人寿命</h3>
            <div ref="lineChart2" class="chart"></div>
          </div>
          <div class="chart-item">
            <h3>人数统计</h3>
            <div class="description">属性: 50  总数: 200</div>
            <div ref="lineChart3" class="chart"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const pieChart1 = ref(null)
const pieChart2 = ref(null)
const pieChart3 = ref(null)
const barChart = ref(null)
const barChart2 = ref(null)
const lineChart1 = ref(null)
const lineChart2 = ref(null)
const lineChart3 = ref(null)

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
  }
}

onMounted(() => {
  // 初始化时间显示
  updateTime()
  // 每分钟更新一次时间
  setInterval(updateTime, 60000)
  
  setTimeout(() => {
    // 第二行 - 环形图1: 累计爱训机器人种类分析
    const myPieChart1 = echarts.init(pieChart1.value)
    myPieChart1.setOption({
      title: {
        text: '累计爱训机器人\n种类分析',
        left: 'center',
        top: 'center',
        textStyle: {
          color: '#fff',
          fontSize: 12,
          lineHeight: 16
        }
      },
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie',
        radius: ['50%', '70%'],
        data: [
          { value: 40, name: '工业机器人', itemStyle: { color: '#5470c6' } },
          { value: 30, name: '特种机器人', itemStyle: { color: '#91cc75' } },
          { value: 30, name: '服务机器人', itemStyle: { color: '#fac858' } }
        ],
        label: { show: false },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    })

    // 第二行 - 环形图2: 3月内爱训机器人种类分析
    const myPieChart2 = echarts.init(pieChart2.value)
    myPieChart2.setOption({
      title: {
        text: '3月内爱训机器人\n种类分析',
        left: 'center',
        top: 'center',
        textStyle: {
          color: '#fff',
          fontSize: 12,
          lineHeight: 16
        }
      },
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie',
        radius: ['50%', '70%'],
        data: [
          { value: 40, name: '工业机器人', itemStyle: { color: '#5470c6' } },
          { value: 30, name: '特种机器人', itemStyle: { color: '#91cc75' } },
          { value: 30, name: '服务机器人', itemStyle: { color: '#fac858' } }
        ],
        label: { show: false },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    })

    // 第二行 - 柱状图: 爱训机器人数量分析
    const myBarChart = echarts.init(barChart.value)
    myBarChart.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      xAxis: {
        type: 'category',
        data: [
          '工业一类场景',
          '工业二类场景',
          '工业三类场景',
          '个人技能训练场景',
          '医疗生活场景',
          '医疗服务场景',
          '教育评测场景',
          '次件部对外场景',
          '低空水域场景'
        ],
        axisLabel: {
          color: '#fff',
          rotate: 45,
          fontSize: 10,
          interval: 0
        }
      },
      yAxis: {
        type: 'value',
        name: '机器人\n数量',
        nameTextStyle: { color: '#fff', padding: [0, 0, 0, -30], fontSize: 10 },
        axisLabel: { color: '#fff', fontSize: 10 },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
      },
      series: [{
        name: '机器人数量',
        type: 'bar',
        data: [280, 236, 217, 217, 190, 149, 123, 101, 75, 53],
        barWidth: '50%',
        itemStyle: { color: '#5470c6' },
        label: {
          show: true,
          position: 'top',
          color: '#fff',
          fontSize: 10
        }
      }]
    })

    // 第三行 - 环形图: 在线率
    const myPieChart3 = echarts.init(pieChart3.value)
    myPieChart3.setOption({
      title: {
        text: '总览\n60',
        left: 'center',
        top: 'center',
        textStyle: {
          color: '#fff',
          fontSize: 12,
          lineHeight: 16
        }
      },
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie',
        radius: ['50%', '70%'],
        data: [
          { value: 60, name: '在线', itemStyle: { color: '#5470c6' } },
          { value: 30, name: '离线', itemStyle: { color: '#91cc75' } },
          { value: 15, name: '故障', itemStyle: { color: '#fac858' } }
        ],
        label: { show: false },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    })

    // 第三行 - 折线图: 7天使用率
    const myLineChart1 = echarts.init(lineChart1.value)
    myLineChart1.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: ['2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06', '2023-07'],
        axisLabel: { color: '#fff', fontSize: 10 }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#fff', fontSize: 10 },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
      },
      series: [
        {
          name: '使用率',
          type: 'line',
          data: [0.65, 0.70, 0.55, 0.80, 0.60, 0.75, 0.68],
          itemStyle: { color: '#fac858' },
          lineStyle: { color: '#fac858' }
        },
        {
          name: '均日',
          type: 'line',
          data: [0.60, 0.62, 0.58, 0.64, 0.59, 0.63, 0.61],
          itemStyle: { color: '#91cc75' },
          lineStyle: { color: '#91cc75' }
        }
      ]
    })

    // 第三行 - 柱状图: 在线率对比
    const myBarChart2 = echarts.init(barChart2.value)
    myBarChart2.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      xAxis: {
        type: 'category',
        data: Array.from({ length: 12 }, (_, i) => `类别${i + 1}`),
        axisLabel: { color: '#fff', rotate: 45, fontSize: 10, interval: 0 }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#fff', fontSize: 10 },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
      },
      series: [
        {
          name: '在线率',
          type: 'bar',
          data: [2000, 1800, 1600, 1500, 1400, 1300, 1200, 1100, 1000, 900, 800, 700],
          barWidth: '50%',
          itemStyle: {
            color: (params) => {
              const colors = ['#fac858', '#91cc75', '#5470c6', '#ff6f61', '#a0d911', '#40c4ff', '#ab47bc', '#ffca28', '#26c6da', '#d4e157', '#ff8a65', '#b0bec5']
              return colors[params.dataIndex % colors.length]
            }
          }
        },
        {
          name: '趋势',
          type: 'line',
          data: [700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800],
          itemStyle: { color: '#ff6f61' },
          lineStyle: { color: '#ff6f61' }
        }
      ]
    })

    // 第四行 - 折线图: 机器人寿命
    const myLineChart2 = echarts.init(lineChart2.value)
    myLineChart2.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: ['2023-01', '2023-02', '2023-03', '2023-04', '2023-05'],
        axisLabel: { color: '#fff', fontSize: 10 }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#fff', fontSize: 10 },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
      },
      series: [
        {
          name: '寿命',
          type: 'line',
          data: [0.70, 0.65, 0.80, 0.60, 0.75],
          itemStyle: { color: '#fac858' },
          lineStyle: { color: '#fac858' }
        },
        {
          name: '寿命2',
          type: 'line',
          data: [0.60, 0.55, 0.70, 0.50, 0.65],
          itemStyle: { color: '#91cc75' },
          lineStyle: { color: '#91cc75' }
        },
        {
          name: '寿命3',
          type: 'line',
          data: [0.50, 0.45, 0.60, 0.40, 0.55],
          itemStyle: { color: '#5470c6' },
          lineStyle: { color: '#5470c6' }
        }
      ]
    })

    // 第四行 - 折线图: 人数统计
    const myLineChart3 = echarts.init(lineChart3.value)
    myLineChart3.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: ['11/20', '11/22', '11/24', '11/26', '11/28'],
        axisLabel: { color: '#fff', fontSize: 10 }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#fff', fontSize: 10 },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
      },
      series: [
        {
          name: '人数',
          type: 'line',
          data: [100, 150, 127, 80, 120],
          itemStyle: { color: '#5470c6' },
          lineStyle: { color: '#5470c6' }
        },
        {
          name: '人数2',
          type: 'line',
          data: [80, 120, 100, 60, 90],
          itemStyle: { color: '#91cc75' },
          lineStyle: { color: '#91cc75' }
        }
      ]
    })

    // 响应式调整
    window.addEventListener('resize', () => {
      myPieChart1.resize()
      myPieChart2.resize()
      myPieChart3.resize()
      myBarChart.resize()
      myBarChart2.resize()
      myLineChart1.resize()
      myLineChart2.resize()
      myLineChart3.resize()
    })
  }, 100)
})
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.dashboard {
  width: 1600px;
  height: 1200px;
  background: rgb(7, 17, 67);
  display: flex;
  flex-direction: column;
}

.header {
  height: 100px;
  background: rgb(7, 17, 67);
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: relative;
}

.logo-container {
  display: flex;
  align-items: center;
  width: 240px;
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
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
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
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: 34px;
  color: #fff;
}

.time {
  font-size: 28px;
  font-weight: bold;
  color: #fff;
  margin-right: 40px;
  font-family: '微软雅黑';
}

.date {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 16px;
  color: #fff;
  font-family: '微软雅黑';
}

.date > div {
  line-height: 1.5;
}

.icons {
  display: flex;
  gap: 10px;
  margin-left: 0;
}

.icon {
  width: 24px;
  height: 24px;
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
  width: 18px;
  height: 18px;
  object-fit: contain;
}

.content {
  padding: 20px;
  height: 1100px; /* 1200px - 100px (header) */
  display: flex;
  flex-direction: column;
}

.chart-row {
  height: 367px; /* 1100px / 3 ≈ 366.67px */
  margin-bottom: 20px;
}

.chart-row:last-child {
  margin-bottom: 0;
}

.chart-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
  height: 100%;
}

.chart-item {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.description {
  color: #fff;
  font-size: 14px;
  text-align: center;
  margin-bottom: 5px;
}

.pie-charts {
  display: flex;
  gap: 10px;
  flex: 1;
  margin-bottom: 10px;
}

.pie-chart {
  width: 50%;
  height: 150px;
}

.chart {
  width: 100%;
  height: 200px;
  flex: 1;
}

.legend {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 5px;
}

.legend-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  font-size: 12px;
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
  gap: 10px;
  flex: 1;
}

.stat-item {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 10px;
  text-align: center;
}

.stat-label {
  color: #fff;
  font-size: 14px;
  margin-bottom: 5px;
}

.stat-value {
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 3px;
}

.text-content {
  color: #fff;
  font-size: 12px;
  line-height: 1.4;
  flex: 1;
  padding: 5px;
}

h3 {
  color: #fff;
  margin-bottom: 5px;
  font-size: 16px;
}
</style>