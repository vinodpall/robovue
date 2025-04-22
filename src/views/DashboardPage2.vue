<template>
  <div class="page-content">
    <div class="robots-container">
      <div class="robot-cell" v-for="(robot, index) in robots" :key="index" :class="`robot-cell-${index + 1}`">
        <div class="robot-name">{{ robot.name }}</div>
        <div class="robot-info">
          <div class="info-box">
            <div class="info-title">设备参数</div>
            <div class="info-content">
              <div v-for="(param, idx) in robot.params" :key="idx">{{ param }}</div>
            </div>
          </div>
          <div class="info-box">
            <div class="info-title">荣誉</div>
            <div class="info-content">
              <div v-for="(honor, idx) in robot.honors" :key="idx">{{ honor }}</div>
            </div>
          </div>
          <div class="info-box">
            <div class="info-title">推荐理由</div>
            <div class="info-content">{{ robot.reason }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const robots = [
  {
    name: '宇树 G1 人形机器人',
    params: [
      '折叠尺寸: 690 × 450 × 300mm',
      '站立尺寸（高度限）: 1270 × 450 × 200mm',
      '整机可用电源量: 55kg'
    ],
    honors: [
      '可持续发展先锋奖',
      '仿生控制突破奖',
      '普惠人工智能成就奖'
    ],
    reason: '宇树G1技术团队专注于智能人形机器人在动态运动控制与仿真领域的创新突破。'
  },
  {
    name: '绝影 X30 Pro 四足机器人',
    params: [
      '机身尺寸: 1130mm × 470mm × 195mm',
      '站立尺寸: 1000mm × 470mm × 585mm',
      '整机重量: 59kg'
    ],
    honors: [
      '2024年度创新科技奖',
      '2023国际机器人大赛金奖',
      '工业设计奖',
      '杰出创新设计奖'
    ],
    reason: '采用最新的人工智能技术，机器人能够进行自主导航与环境感知，适配各种复杂的操作环境，黑暗多变的场景。'
  },
  {
    name: 'DXB-C3950 光伏运维机器人',
    params: [
      '外形尺寸: 1400 × 900 × 1640mm',
      '整机重量: 400kg'
    ],
    honors: [
      '最具商业价值奖',
      '光能智取先锋奖',
      '机器人行业卓越奖'
    ],
    reason: '除草机器人以独特、精准、环保的优势，适配现代代化运维场景需求。'
  }
]
</script>

<style scoped>
.page-content {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
}

.robots-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  width: 100%;
  height: 100%;
}

.robot-cell {
  position: relative;
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.robot-cell-1 {
  background-image: url('../assets/frame_1.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.robot-cell-2 {
  background-image: url('../assets/frame_2.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.robot-cell-3 {
  background-image: url('../assets/frame_3.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.robot-name {
  color: #00FFFF;
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
  font-weight: bold;
}

.robot-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 0;
}

.info-box {
  flex: 1;
  background: rgba(0, 255, 255, 0.1);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 4px;
  padding: 15px;
  overflow: auto;
}

.info-title {
  color: #00FFFF;
  font-size: 18px;
  margin-bottom: 10px;
  font-weight: bold;
}

.info-content {
  color: #FFFFFF;
  font-size: 14px;
  line-height: 1.5;
}

.info-content > div {
  margin-bottom: 8px;
}

::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 255, 255, 0.1);
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 255, 255, 0.3);
  border-radius: 2px;
}
</style>