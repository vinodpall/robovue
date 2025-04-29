<template>
  <div class="other-settings">
    <!-- 基本配置 -->
    <div class="section">
      <div class="section-header">
        <span class="section-icon"></span>
        <span class="section-title">基本配置</span>
      </div>
      <div class="section-content base-config">
        <div class="form-row">
          <div class="form-item required">
            <span class="label">页面标题</span>
            <el-input v-model="baseForm.title" :disabled="!allEdit" placeholder="请输入页面标题" style="width: 320px;" />
          </div>
          <div class="form-item required">
            <span class="label">页面Logo</span>
            <el-upload
              class="logo-uploader"
              :action="uploadAction"
              :show-file-list="false"
              :disabled="!allEdit"
              :on-success="handleLogoSuccess"
            >
              <img v-if="baseForm.logo" :src="getImageUrl(baseForm.logo)" class="logo-img" />
              <el-button v-else type="primary" size="small">上传Logo</el-button>
            </el-upload>
          </div>
        </div>
      </div>
    </div>

    <!-- 来访人数统计配置 -->
    <div class="section">
      <div class="section-header">
        <span class="section-icon"></span>
        <span class="section-title">来访人数配置</span>
      </div>
      <div class="section-content visit-config">
        <div class="form-row">
          <div class="form-item">
            <span class="label">今日来访</span>
            <el-input v-model="visitForm.today" :disabled="!allEdit" placeholder="输入内容" />
          </div>
          <div class="form-item required">
            <span class="label">本周累计</span>
            <el-input v-model="visitForm.week" :disabled="!allEdit" placeholder="输入内容" />
          </div>
          <div class="form-item required">
            <span class="label">本月累计</span>
            <el-input v-model="visitForm.month" :disabled="!allEdit" placeholder="输入内容" />
          </div>
        </div>
      </div>
    </div>

    <!-- 界面切换时间配置 -->
    <div class="section">
      <div class="section-header">
        <span class="section-icon"></span>
        <span class="section-title">轮播配置</span>
      </div>
      <div class="section-content switch-config">
        <div class="form-row">
          <div class="form-item required">
            <span class="label">首页停留时间（秒）</span>
            <el-input v-model="switchForm.home" :disabled="!allEdit" placeholder="输入首页界面停留时间" />
          </div>
          <div class="form-item required">
            <span class="label">轮播图停留时间（秒）</span>
            <el-input v-model="switchForm.carousel" :disabled="!allEdit" placeholder="轮播图界面停留时间" />
          </div>
          <div class="form-item required">
            <span class="label">监控界面停留时间（秒）</span>
            <el-input v-model="switchForm.monitor" :disabled="!allEdit" placeholder="监控界面停留时间" />
          </div>
          <div class="form-item required">
            <span class="label">视频轮播停留时间（秒）</span>
            <el-input v-model="switchForm.video_carousel_duration" :disabled="!allEdit" placeholder="输入视频轮播停留时间" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-item">
            <span class="label">页面是否轮播</span>
            <el-switch v-model="switchForm.page_carousel" :disabled="!allEdit" />
          </div>
          <div class="form-item">
            <span class="label">视频是否轮播</span>
            <el-switch v-model="switchForm.video_carousel" :disabled="!allEdit" />
          </div>
        </div>
      </div>
    </div>
    <!-- 底部大按钮 -->
    <div class="footer-btn-row">
      <el-button type="primary" size="large" class="footer-btn" @click="toggleEditAll">
        {{ allEdit ? '保存' : '编辑' }}
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import api from '../../api'

const allEdit = ref(false)

const baseForm = ref({
  title: '',
  logo: ''
})

const visitForm = ref({
  today: '',
  week: '',
  month: ''
})

const switchForm = ref({
  home: '',
  carousel: '',
  monitor: '',
  video_carousel_duration: '',
  page_carousel: false,
  video_carousel: false
})

let configId = null

const uploadAction = `${import.meta.env.VITE_API_BASE_URL}/api/upload/image`

const getImageUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${import.meta.env.VITE_API_BASE_URL}${url}`
}

const handleLogoSuccess = (response) => {
  if (response && response.url) {
    baseForm.value.logo = response.url
    ElMessage.success('Logo上传成功')
  } else {
    ElMessage.error('Logo上传失败')
  }
}

const fetchConfig = async () => {
  try {
    const res = await api.get('/web-configs')
    const item = res.items && res.items.length > 0 ? res.items[0] : null
    if (item) {
      configId = item.id
      baseForm.value.title = item.name || ''
      baseForm.value.logo = item.icon_url || ''
      visitForm.value.today = item.visitor_count || ''
      visitForm.value.week = item.weekly_visitor_count || ''
      visitForm.value.month = item.monthly_visitor_count || ''
      switchForm.value.home = item.first_page_duration || ''
      switchForm.value.carousel = item.second_page_duration || ''
      switchForm.value.monitor = item.third_page_duration || ''
      switchForm.value.video_carousel_duration = item.video_carousel_duration || ''
      switchForm.value.page_carousel = item.page_carousel ?? false
      switchForm.value.video_carousel = item.video_carousel ?? false
    }
  } catch (e) {
    ElMessage.error('获取设置失败')
  }
}

const saveConfig = async () => {
  if (!configId) return
  try {
    await api.put(`/web-configs/${configId}`, {
      name: baseForm.value.title,
      icon_url: baseForm.value.logo,
      visitor_count: visitForm.value.today,
      weekly_visitor_count: visitForm.value.week,
      monthly_visitor_count: visitForm.value.month,
      first_page_duration: switchForm.value.home,
      second_page_duration: switchForm.value.carousel,
      third_page_duration: switchForm.value.monitor,
      video_carousel_duration: switchForm.value.video_carousel_duration,
      page_carousel: switchForm.value.page_carousel,
      video_carousel: switchForm.value.video_carousel
    })
    ElMessage.success('保存成功')
    fetchConfig()
  } catch (e) {
    ElMessage.error('保存失败')
  }
}

const toggleEditAll = () => {
  if (allEdit.value) {
    saveConfig()
  }
  allEdit.value = !allEdit.value
}

onMounted(() => {
  fetchConfig()
})
</script>

<style scoped>
.other-settings {
  padding: 32px 0 0 0;
  background: #fff;
  min-height: 100vh;
}
.section {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 32px;
  box-shadow: 0 1px 8px rgba(0,0,0,0.04);
  padding: 32px 48px 20px 48px;
}
.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}
.section-icon {
  width: 8px;
  height: 18px;
  background: #409eff;
  border-radius: 2px;
  margin-right: 10px;
  display: inline-block;
}
.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #222;
  margin-right: auto;
  letter-spacing: 1px;
}
.section-content {
  padding-bottom: 8px;
}
.form-row {
  display: flex;
  align-items: center;
  gap: 48px;
  margin-bottom: 18px;
}
.form-item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 200px;
}
.label {
  font-size: 15px;
  color: #333;
  min-width: 100px;
  margin-right: 4px;
}
.required .label::after {
  content: '*';
  color: #f56c6c;
  margin-left: 2px;
}
.interval {
  margin: 0 4px;
  color: #888;
}
:deep(.el-input) {
  width: 140px;
}
:deep(.el-switch) {
  --el-switch-on-color: #409eff;
  --el-switch-off-color: #dcdfe6;
}
.footer-btn-row {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 40px 0 0 0;
}
.footer-btn {
  font-size: 18px;
  padding: 14px 60px;
  border-radius: 28px;
  font-weight: 600;
  letter-spacing: 2px;
}
.logo-uploader {
  display: flex;
  align-items: center;
}
.logo-img {
  width: 60px;
  height: 60px;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid #eee;
  background: #fafbfc;
}
</style> 