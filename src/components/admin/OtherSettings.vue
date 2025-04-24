<template>
  <div class="other-settings">
    <div class="header">
      <h2>其他设置</h2>
      <el-button type="primary" @click="handleSave">保存设置</el-button>
    </div>

    <el-form :model="settingsForm" label-width="200px" class="settings-form">
      <el-divider content-position="left">第一页设置</el-divider>
      <el-form-item label="页面停留时间（秒）">
        <el-input-number v-model="settingsForm.page1Duration" :min="1" :max="3600" />
      </el-form-item>

      <el-divider content-position="left">第二页设置</el-divider>
      <el-form-item label="页面停留时间（秒）">
        <el-input-number v-model="settingsForm.page2Duration" :min="1" :max="3600" />
      </el-form-item>
      <el-form-item label="机器人展示轮播间隔（秒）">
        <el-input-number v-model="settingsForm.robotCarouselInterval" :min="1" :max="3600" />
      </el-form-item>

      <el-divider content-position="left">第三页设置</el-divider>
      <el-form-item label="页面停留时间（秒）">
        <el-input-number v-model="settingsForm.page3Duration" :min="1" :max="3600" />
      </el-form-item>
      <el-form-item label="视频轮播间隔（秒）">
        <el-input-number v-model="settingsForm.videoCarouselInterval" :min="1" :max="3600" />
      </el-form-item>

      <el-divider content-position="left">全局设置</el-divider>
      <el-form-item label="是否自动轮播">
        <el-switch v-model="settingsForm.autoPlay" />
      </el-form-item>
      <el-form-item label="轮播方向">
        <el-radio-group v-model="settingsForm.direction">
          <el-radio label="horizontal">水平</el-radio>
          <el-radio label="vertical">垂直</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="轮播效果">
        <el-select v-model="settingsForm.effect">
          <el-option label="滑动" value="slide" />
          <el-option label="淡入淡出" value="fade" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const settingsForm = ref({
  // 第一页设置
  page1Duration: 10,
  
  // 第二页设置
  page2Duration: 10,
  robotCarouselInterval: 5,
  
  // 第三页设置
  page3Duration: 10,
  videoCarouselInterval: 5,
  
  // 全局设置
  autoPlay: true,
  direction: 'horizontal',
  effect: 'slide'
})

// 保存设置
const handleSave = () => {
  // 这里应该调用后端 API 保存设置
  localStorage.setItem('dashboardSettings', JSON.stringify(settingsForm.value))
  ElMessage.success('保存成功')
}

// 初始化时加载设置
const loadSettings = () => {
  const savedSettings = localStorage.getItem('dashboardSettings')
  if (savedSettings) {
    try {
      const settings = JSON.parse(savedSettings)
      settingsForm.value = {
        ...settingsForm.value,
        ...settings
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  }
}

// 组件挂载时加载设置
loadSettings()
</script>

<style scoped>
.other-settings {
  padding: 20px;
  background-color: white;
  border-radius: 4px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
}

.settings-form {
  max-width: 800px;
  margin: 0 auto;
}

.el-divider {
  margin: 24px 0;
}

:deep(.el-divider__text) {
  font-size: 16px;
  font-weight: bold;
  color: var(--el-text-color-primary);
}
</style> 