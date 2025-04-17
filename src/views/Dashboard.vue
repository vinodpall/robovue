<template>
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
            <h3>受训机器人技能分析</h3>
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
            <div ref="lineChart1" class="chart"></div>
          </div>
        </div>
      </div>
      <!-- 第四行 -->
      <div class="chart-row">
        <div class="chart-container">
          <div class="chart-item">
            <h3>受训机器人企业</h3>
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
            <h3>训练场荣誉</h3>
            <div ref="lineChart2" class="chart"></div>
          </div>
          <div class="chart-item">
            <h3>入场人数统计</h3>
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

onMounted(() => {
  // 初始化时间显示
  updateTime()
  // 每分钟更新一次时间
  setInterval(updateTime, 60000)

  // 初始化第一个饼图
  const chart1 = echarts.init(pieChart1.value)
  chart1.setOption({
    tooltip: {
      trigger: 'item'
    },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      label: {
        show: false
      },
      data: [
        { value: 40, name: '工业级机器人' },
        { value: 30, name: '特种机器人' },
        { value: 30, name: '服务机器人' }
      ],
      color: ['#4992FF', '#7CFFB2', '#FDDD60']
    }]
  })

  // 初始化第二个饼图
  const chart2 = echarts.init(pieChart2.value)
  chart2.setOption({
    tooltip: {
      trigger: 'item'
    },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      label: {
        show: false
      },
      data: [
        { value: 45, name: '工业级机器人' },
        { value: 25, name: '特种机器人' },
        { value: 30, name: '服务机器人' }
      ],
      color: ['#4992FF', '#7CFFB2', '#FDDD60']
    }]
  })

  // 初始化柱状图
  const chart3 = echarts.init(barChart.value)
  chart3.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      top: '10%',
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['工业制造', '医疗服务', '教育培训', '物流运输', '其他'],
      axisLine: {
        lineStyle: {
          color: '#fff'
        }
      },
      axisLabel: {
        color: '#fff'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#fff'
        }
      },
      axisLabel: {
        color: '#fff'
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255,255,255,0.1)'
        }
      }
    },
    series: [{
      data: [120, 200, 150, 80, 70],
      type: 'bar',
      itemStyle: {
        color: '#4992FF'
      }
    }]
  })

  // 初始化宽框图表
  const chart4 = echarts.init(lineChart1.value)
  chart4.setOption({
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      top: '10%',
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
      axisLine: {
        lineStyle: {
          color: '#fff'
        }
      },
      axisLabel: {
        color: '#fff'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#fff'
        }
      },
      axisLabel: {
        color: '#fff'
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255,255,255,0.1)'
        }
      }
    },
    series: [{
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
      smooth: true,
      itemStyle: {
        color: '#0EE4F9'
      },
      lineStyle: {
        color: '#0EE4F9'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: 'rgba(14,228,249,0.3)'
          }, {
            offset: 1,
            color: 'rgba(14,228,249,0)'
          }]
        }
      }
    }]
  })

  // 响应式调整
  window.addEventListener('resize', () => {
    chart1.resize()
    chart2.resize()
    chart3.resize()
    chart4.resize()
  })
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
  }
}
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
  height: calc(100% - 61px);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 20px;
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
</style>