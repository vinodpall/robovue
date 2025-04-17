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

onMounted(() => {
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
        top: '10%',
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: robotData.map(item => item.name),
        axisLabel: {
          color: '#fff',
          fontSize: 12,
          interval: 0,
          rotate: 45
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(255,255,255,0.3)'
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: '#fff',
          fontSize: 12
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(255,255,255,0.1)'
          }
        }
      },
      series: [{
        data: [13000, 16100, 17300, 19100, 13100, 200, 13000],
        type: 'bar',
        barWidth: '40%',
        itemStyle: {
          color: '#409EFF'
        }
      }]
    })

    // 响应式调整
    window.addEventListener('resize', () => {
      chart1.resize({ animation: { duration: 300 } })
      chart2.resize({ animation: { duration: 300 } })
      myBarChart.resize({ animation: { duration: 300 } })
      chart.resize({ animation: { duration: 300 } })
    })
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
</style>