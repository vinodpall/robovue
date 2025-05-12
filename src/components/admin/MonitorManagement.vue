<template>
  <div class="monitor-management">
    <!-- 筛选区域 -->
    <div class="filter-section">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="视频名称">
          <el-input v-model="filterForm.name" placeholder="请输入视频名称" clearable />
        </el-form-item>
        <el-form-item label="视频类型">
          <el-select 
            v-model="filterForm.type" 
            placeholder="请选择视频类型" 
            clearable
            style="width: 200px"
          >
            <el-option label="RTSP" value="RTSP" />
            <el-option label="WEB" value="WEB" />
            <el-option label="LOCAL" value="LOCAL" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="action-buttons">
        <div class="left-buttons">
          <el-button type="primary" @click="showAddDialog">
            <el-icon><Plus /></el-icon>新增视频
          </el-button>
        </div>
      </div>
    </div>

    <!-- 视频列表 -->
    <div class="table-section">
      <el-table 
        :data="videoList" 
        style="width: 100%" 
        border 
        stripe 
        v-loading="loading"
        :height="tableHeight"
      >
        <el-table-column type="index" label="序号" width="80" :index="indexMethod" />
        <el-table-column prop="name" label="监控点名称" min-width="160" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.type === 'RTSP' ? 'success' : 'info'">
              {{ scope.row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="url" label="视频地址" min-width="200" show-overflow-tooltip />
        <el-table-column prop="create_time" label="创建时间" width="160">
          <template #default="scope">
            {{ formatTimestamp(scope.row.create_time) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            <el-button 
              size="small" 
              :type="scope.row.is_carousel ? 'warning' : 'success'"
              @click="handleCarousel(scope.row)"
            >
              {{ scope.row.is_carousel ? '取消轮播' : '加入轮播' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[15, 20, 50, 100]"
          :total="total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      :title="dialogType === 'add' ? '新增视频' : '编辑视频'"
      v-model="dialogVisible"
      width="600px"
    >
      <el-form :model="videoForm" label-width="120px">
        <el-form-item label="视频名称" required>
          <el-input 
            v-model="videoForm.name" 
            placeholder="请输入视频名称" 
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item label="视频介绍">
          <el-input 
            v-model="videoForm.description" 
            type="textarea" 
            :rows="2"
            placeholder="请输入视频介绍（选填）"
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item label="视频类型" required>
          <el-select 
            v-model="videoForm.type" 
            placeholder="请选择视频类型"
            style="width: 400px"
          >
            <el-option label="RTSP" value="RTSP" />
            <el-option label="WEB" value="WEB" />
            <el-option label="LOCAL" value="LOCAL" />
          </el-select>
        </el-form-item>
        <el-form-item label="视频地址" required v-if="videoForm.type !== 'LOCAL'">
          <el-input 
            v-model="videoForm.url" 
            placeholder="请输入视频地址"
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item label="上传视频" required v-if="videoForm.type === 'LOCAL'">
          <el-upload
            class="video-uploader"
            :action="`${api.defaults.baseURL}/videos/upload`"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :data="{
              name: videoForm.name,
              type: videoForm.type
            }"
            accept="video/*"
          >
            <el-button type="primary">选择视频文件</el-button>
            <template #tip>
              <div class="el-upload__tip">
                支持mp4、avi等视频格式，文件大小不超过100MB
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 预览对话框 -->
    <el-dialog
      title="视频预览"
      v-model="previewVisible"
      width="800px"
    >
      <div class="video-preview">
        <div v-if="videoLoading" class="video-loading">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span>视频加载中...</span>
        </div>
        <video
          v-if="currentVideo"
          ref="previewVideo"
          :src="getVideoUrl(currentVideo)"
          controls
          style="width: 100%"
          @error="handleVideoError"
          @loadeddata="handleVideoLoaded"
          @loadstart="handleVideoLoadStart"
          @stalled="handleVideoStalled"
          @waiting="handleVideoWaiting"
          @canplay="handleVideoCanPlay"
        ></video>
        <div v-if="videoError" class="video-error">
          <el-icon><Warning /></el-icon>
          <span>{{ videoError }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Loading, Warning } from '@element-plus/icons-vue'
import api from '../../api'

const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref(0)
const tableHeight = ref(0)

const filterForm = ref({
  name: '',
  type: ''
})

const videoList = ref([])

const robotList = ref([
  { id: '01', name: '大力神应急救援机器人' }
])

const dialogVisible = ref(false)
const previewVisible = ref(false)
const dialogType = ref('add')
const currentVideo = ref(null)

const videoForm = ref({
  name: '',
  description: '',
  type: '',
  url: '',
  file: null
})

const videoLoading = ref(false)
const videoError = ref('')
const previewVideo = ref(null)

// 计算表格高度
const calculateTableHeight = () => {
  nextTick(() => {
    const windowHeight = window.innerHeight
    const filterHeight = document.querySelector('.filter-section').offsetHeight
    const paginationHeight = document.querySelector('.pagination').offsetHeight
    const padding = 24 * 2 // 上下内边距
    tableHeight.value = windowHeight - filterHeight - paginationHeight - padding - 16 - 20 // 减少间距并额外减少20px
  })
}

// 监听窗口大小变化
window.addEventListener('resize', calculateTableHeight)

onMounted(() => {
  calculateTableHeight()
})

const handleSearch = () => {
  console.log('执行搜索，当前筛选条件:', filterForm.value)
  currentPage.value = 1
  fetchVideoList()
}

const resetFilter = () => {
  console.log('重置筛选条件')
  filterForm.value = {
    name: '',
    type: ''
  }
  handleSearch()
}

const handleSizeChange = (val) => {
  pageSize.value = val
  handleSearch()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchVideoList()
}

const showAddDialog = () => {
  dialogType.value = 'add'
  videoForm.value = {
    name: '',
    description: '',
    type: '',
    url: '',
    file: null
  }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogType.value = 'edit'
  videoForm.value = {
    id: row.id,
    name: row.name,
    description: row.description || '',
    type: row.type,
    url: row.url
  }
  dialogVisible.value = true
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除视频"${row.name}"吗？`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    await api.delete(`/videos/${row.id}`)
    ElMessage.success('删除成功')
    fetchVideoList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      console.error('错误详情:', error.response)
      ElMessage.error('删除失败')
    }
  }
}

const handlePreview = async (row) => {
  console.log('预览视频:', row)
  currentVideo.value = row
  previewVisible.value = true
  videoLoading.value = true
  videoError.value = ''
  
  // 在下一个tick后尝试播放视频
  nextTick(async () => {
    if (previewVideo.value) {
      console.log('开始加载视频元素')
      const videoUrl = getVideoUrl(row)
      console.log('完整视频URL:', videoUrl)
      
      // 先测试API是否可访问
      try {
        const response = await fetch(videoUrl)
        console.log('视频流API响应状态:', response.status)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        console.log('视频流API响应头:', Object.fromEntries(response.headers.entries()))
      } catch (error) {
        console.error('视频流API测试失败:', error)
        videoError.value = '无法访问视频流，请检查服务器状态'
        videoLoading.value = false
        return
      }
      
      // 设置视频源并加载
      previewVideo.value.src = videoUrl
      previewVideo.value.load()
      
      // 尝试自动播放
      try {
        await previewVideo.value.play()
        console.log('视频开始播放')
      } catch (error) {
        console.error('自动播放失败:', error)
        videoError.value = '视频播放失败，请手动点击播放按钮'
      }
    }
  })
}

const handleVideoLoadStart = () => {
  console.log('开始加载视频')
  videoLoading.value = true
}

const handleVideoStalled = () => {
  console.log('视频加载停滞')
  videoError.value = '视频加载停滞，请检查网络连接'
}

const handleVideoWaiting = () => {
  console.log('视频等待中')
}

const handleVideoCanPlay = () => {
  console.log('视频可以播放')
  videoLoading.value = false
  videoError.value = ''
}

const handleVideoError = (error) => {
  console.error('视频加载失败:', error)
  console.log('错误详情:', error.target.error)
  console.log('当前视频信息:', currentVideo.value)
  console.log('视频URL:', getVideoUrl(currentVideo.value))
  videoLoading.value = false
  videoError.value = '视频加载失败，请检查视频地址是否正确'
}

const handleVideoLoaded = () => {
  console.log('视频数据已加载')
  videoLoading.value = false
  videoError.value = ''
}

// 监听对话框关闭
watch(previewVisible, (newVal) => {
  if (!newVal) {
    // 关闭对话框时重置状态
    videoLoading.value = false
    videoError.value = ''
    if (previewVideo.value) {
      previewVideo.value.pause()
      previewVideo.value.src = ''
    }
  }
})

const handleUploadSuccess = (response) => {
  if (response && response.url) {
    videoForm.value.url = response.url
    ElMessage.success('上传成功')
  } else {
    ElMessage.error('上传失败：未获取到视频URL')
  }
}

const handleUploadError = (error) => {
  console.error('上传失败:', error)
  ElMessage.error('视频上传失败')
}

const beforeUpload = (file) => {
  if (!videoForm.value.name) {
    ElMessage.warning('请先填写视频名称')
    return false
  }
  
  const isVideo = file.type.startsWith('video/')
  if (!isVideo) {
    ElMessage.error('只能上传视频文件！')
    return false
  }
  const isLt100M = file.size / 1024 / 1024 < 100
  if (!isLt100M) {
    ElMessage.error('视频大小不能超过 100MB！')
    return false
  }
  
  // 保存文件对象
  videoForm.value.file = file
  return true
}

const handleSubmit = async () => {
  if (!videoForm.value.name || !videoForm.value.type) {
    ElMessage.warning('请填写必填项')
    return
  }

  if (videoForm.value.type !== 'LOCAL' && !videoForm.value.url) {
    ElMessage.warning('请输入视频地址')
    return
  }

  if (videoForm.value.type === 'LOCAL' && !videoForm.value.url) {
    ElMessage.warning('请上传视频文件')
    return
  }

  if (dialogType.value === 'add') {
    handleCreate()
  } else {
    handleUpdate()
  }
}

// 获取视频列表
const fetchVideoList = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      page_size: pageSize.value,
      name: filterForm.value.name || undefined,
      video_type: filterForm.value.type || undefined
    }
    
    const response = await api.get('/videos', { params })
    console.log('视频列表响应:', response)
    
    videoList.value = response.items.map(item => ({
      ...item,
      id: item.id,  // 使用API返回的id
      name: item.name,
      description: item.description || '',
      url: item.url || '',
      type: item.type,
      is_carousel: item.is_carousel || false,
      create_time: item.create_time || item.createTime,
      carousel_add_time: item.carousel_add_time || null
    }))
    total.value = response.total
  } catch (error) {
    console.error('获取视频列表失败:', error)
    ElMessage.error('获取视频列表失败')
  } finally {
    loading.value = false
  }
}

// 序号计算方法
const indexMethod = (index) => {
  return (currentPage.value - 1) * pageSize.value + index + 1
}

// 创建视频
const handleCreate = async () => {
  try {
    if (videoForm.value.type === 'LOCAL') {
      // 对于本地视频，先上传文件
      const formData = new FormData()
      formData.append('file', videoForm.value.file)
      
      const uploadResponse = await api.post('/videos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      // 上传成功后，创建视频记录
      const submitData = {
        name: videoForm.value.name,
        description: videoForm.value.description,
        type: videoForm.value.type,
        url: uploadResponse.url
      }
      
      await api.post('/videos', submitData)
    } else {
      // 对于其他类型，直接创建视频记录
      const submitData = {
        name: videoForm.value.name,
        description: videoForm.value.description,
        type: videoForm.value.type,
        url: videoForm.value.url
      }
      await api.post('/videos', submitData)
    }
    
    ElMessage.success('创建成功')
    dialogVisible.value = false
    fetchVideoList()
  } catch (error) {
    console.error('创建失败:', error)
    ElMessage.error('创建失败')
  }
}

// 更新视频
const handleUpdate = async () => {
  try {
    const submitData = {
      name: videoForm.value.name,
      description: videoForm.value.description,
      type: videoForm.value.type,
      url: videoForm.value.url
    }
    const response = await api.put(`/videos/${videoForm.value.id}`, submitData)
    ElMessage.success('更新成功')
    dialogVisible.value = false
    fetchVideoList()
  } catch (error) {
    console.error('更新失败:', error)
    console.error('错误详情:', error.response)
    ElMessage.error('更新失败')
  }
}

// 修改轮播状态
const handleCarousel = async (row) => {
  try {
    const newStatus = !row.is_carousel
    const submitData = {
      ...row,
      is_carousel: newStatus,
      carousel_add_time: newStatus ? new Date().toISOString() : null
    }
    await api.put(`/videos/${row.id}`, submitData)
    ElMessage.success(newStatus ? '已开启轮播' : '已取消轮播')
    fetchVideoList()
  } catch (error) {
    console.error('更新轮播状态失败:', error)
    console.error('错误详情:', error.response)
    ElMessage.error('更新轮播状态失败')
  }
}

// 格式化时间戳
const formatTimestamp = (timestamp) => {
  if (!timestamp) return ''
  
  // 处理数字格式的时间戳（秒级）
  if (typeof timestamp === 'number' || /^\d{10}$/.test(timestamp)) {
    const date = new Date(Number(timestamp) * 1000)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/\//g, '-')
  }
  
  // 处理字符串格式的日期（如：202504281054）
  if (typeof timestamp === 'string' && /^\d{12}$/.test(timestamp)) {
    const year = timestamp.substring(0, 4)
    const month = timestamp.substring(4, 6)
    const day = timestamp.substring(6, 8)
    const hour = timestamp.substring(8, 10)
    const minute = timestamp.substring(10, 12)
    return `${year}-${month}-${day} ${hour}:${minute}:00`
  }
  
  // 如果是其他格式，尝试直接解析
  try {
    const date = new Date(timestamp)
    if (!isNaN(date.getTime())) {
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).replace(/\//g, '-')
    }
  } catch (error) {
    console.error('时间格式化错误:', error)
  }
  
  // 如果都处理不了，返回原始值
  return timestamp
}

// 添加样式
const videoPreviewStyle = {
  position: 'relative',
  width: '100%',
  height: '450px',
  backgroundColor: '#000',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

const videoLoadingStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px'
}

const videoErrorStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  color: '#f56c6c',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
}

const getVideoUrl = (video) => {
  if (!video) return ''
  
  if (video.type === 'LOCAL') {
    // 对于本地视频，使用完整的URL路径
    const url = `${api.defaults.baseURL}${video.url}`
    console.log('本地视频URL:', url)
    return url
  }
  return video.url
}

onMounted(() => {
  fetchVideoList()
  calculateTableHeight()
})
</script>

<style scoped>
.monitor-management {
  padding: 0;
  background-color: #fff;
  height: 100%;
}

.filter-section {
  margin-bottom: 32px;
  padding-bottom: 0;
}

.filter-form {
  margin-bottom: 4px;
}

.action-buttons {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 4px;
  margin-top: -10px;
}

.left-buttons, .right-buttons {
  display: flex;
  gap: 16px;
}

.right-buttons {
  margin-left: 24px;
}

:deep(.el-table) {
  --el-table-border-color: transparent;
  --el-table-header-bg-color: #eef0f2;
  --el-table-row-hover-bg-color: #f5f7fa;
  border: none;
  margin-top: -8px;
  height: calc(100vh - 280px);
}

:deep(.el-table th) {
  font-weight: 600;
  color: #1f2f3d;
  height: 36px;
  padding: 6px 0;
  background-color: #eef0f2;
  font-size: 13px;
  border: none;
}

:deep(.el-table td) {
  height: 36px;
  padding: 3px 0;
  font-size: 13px;
  border: none;
}

:deep(.el-table .cell) {
  line-height: 1.3;
  padding-top: 2px;
  padding-bottom: 2px;
}

:deep(.el-table--border) {
  border: none;
}

:deep(.el-table--border::after) {
  display: none;
}

:deep(.el-table--border::before) {
  display: none;
}

:deep(.el-table__inner-wrapper::before) {
  display: none;
}

:deep(.el-table__border-left-patch) {
  display: none;
}

:deep(.el-table__border-bottom-patch) {
  display: none;
}

:deep(.el-table__cell) {
  border: none;
}

:deep(.el-table__header) {
  border: none;
}

:deep(.el-table__body) {
  border: none;
}

:deep(.el-table__row) {
  border: none;
  height: 44px;
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background-color: #eef0f2 !important;
}

:deep(.el-table__body tr.el-table__row--striped) {
  background-color: #eef0f2 !important;
}

:deep(.el-button--small) {
  padding: 6px 12px;
  font-size: 12px;
  height: 28px;
}

:deep(.el-dialog__body) {
  padding: 20px 40px;
}

:deep(.el-form-item) {
  margin-bottom: 24px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
}

:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c0c4cc inset;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #409eff inset;
}

:deep(.el-textarea__inner) {
  min-height: 60px !important;
  resize: vertical;
}

:deep(.el-select) {
  width: 200px;
}

:deep(.el-input) {
  width: 200px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

.pagination {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  padding-bottom: 8px;
}

:deep(.el-pagination) {
  --el-pagination-bg-color: transparent;
  --el-pagination-button-height: 28px;
  --el-pagination-button-width: 28px;
  --el-pagination-button-font-size: 12px;
  padding: 0;
  margin-bottom: 0;
}

:deep(.el-pagination .el-select .el-input) {
  width: 90px;
}

:deep(.el-pagination .el-select .el-input__wrapper) {
  padding: 0 8px;
}

:deep(.el-pagination .el-pagination__total) {
  font-size: 12px;
  line-height: 28px;
}

:deep(.el-pagination .el-pagination__jump) {
  font-size: 12px;
  line-height: 28px;
}

:deep(.el-pagination .el-pagination__sizes) {
  font-size: 12px;
  line-height: 28px;
}

:deep(.el-pagination .el-pagination__jump .el-input__wrapper) {
  padding: 0 8px;
}

:deep(.el-pagination .el-pagination__jump .el-input__inner) {
  height: 28px;
  line-height: 28px;
}

:deep(.el-pagination .el-pager li) {
  height: 28px;
  line-height: 28px;
}
</style> 