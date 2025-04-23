<template>
  <div class="page-content">
    <div class="chart-row">
      <div class="chart-container">
        <div class="chart-item">
          <h3>资源使用统计</h3>
          <div class="stats-container">
            <div class="stat-item">
              <div class="stat-label">CPU使用率</div>
              <div class="stat-value">85<span class="unit">%</span></div>
            </div>
            <div class="stat-item">
              <div class="stat-label">内存使用率</div>
              <div class="stat-value">72<span class="unit">%</span></div>
            </div>
            <div class="stat-item">
              <div class="stat-label">存储使用率</div>
              <div class="stat-value">63<span class="unit">%</span></div>
            </div>
            <div class="stat-item">
              <div class="stat-label">网络带宽</div>
              <div class="stat-value">45<span class="unit">%</span></div>
            </div>
          </div>
        </div>
        <div class="chart-item">
          <h3>系统运行状态</h3>
          <div ref="statusChart" class="chart"></div>
        </div>
        <div class="chart-item">
          <h3>告警信息</h3>
          <div class="alert-list">
            <div class="alert-item" v-for="(alert, index) in alerts" :key="index">
              <span class="alert-time">{{ alert.time }}</span>
              <span class="alert-content">{{ alert.content }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const statusChart = ref(null)

const alerts = ref([
  { time: '10:30', content: '系统负载过高' },
  { time: '09:15', content: '内存使用率超过阈值' },
  { time: '08:45', content: '存储空间不足' },
  { time: '08:00', content: '网络连接异常' }
])

const initCharts = () => {
  const chart = echarts.init(statusChart.value, null, {
    devicePixelRatio: window.devicePixelRatio * 2
  })
  
  chart.setOption({
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月'],
      axisLabel: {
        color: '#fff'
      }
    },
    yAxis: {
      type: 'value',
      name: '运行时长(小时)',
      axisLabel: {
        color: '#fff'
      }
    },
    series: [{
      data: [720, 744, 720, 744, 720, 744],
      type: 'line',
      smooth: true,
      itemStyle: {
        color: '#00FFFF'
      },
      lineStyle: {
        color: '#00FFFF',
        width: 2
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(0,255,255,0.3)' },
          { offset: 1, color: 'rgba(0,255,255,0)' }
        ])
      }
    }]
  })

  window.addEventListener('resize', () => {
    chart.resize()
  })
}

onMounted(() => {
  initCharts()
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

.stat-label {
  color: #00FFFF;
  font-size: 14px;
  margin-bottom: 5px;
  text-align: left;
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

.alert-list {
  height: calc(100% - 61px);
  padding: 10px 20px;
  overflow-y: auto;
}

.alert-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(0, 255, 255, 0.2);
}

.alert-time {
  color: #00FFFF;
  font-size: 12px;
  margin-right: 15px;
  min-width: 50px;
}

.alert-content {
  color: #FFFFFF;
  font-size: 14px;
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
</style> 