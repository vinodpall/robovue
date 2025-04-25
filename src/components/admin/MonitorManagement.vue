<template>
  <div class="monitor-management">
    <!-- 筛选区域 -->
    <div class="filter-section">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="视频名称">
          <el-input v-model="filterForm.name" placeholder="请输入视频名称" clearable />
        </el-form-item>
        <el-form-item label="关联机器人">
          <el-select v-model="filterForm.robotId" placeholder="请选择机器人" clearable>
            <el-option
              v-for="robot in robotList"
              :key="robot.id"
              :label="robot.name"
              :value="robot.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="视频类型">
          <el-select v-model="filterForm.type" placeholder="请选择视频类型" clearable>
            <el-option label="实时监控" value="live" />
            <el-option label="历史记录" value="history" />
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
        <el-table-column prop="id" label="编号" width="80" />
        <el-table-column prop="name" label="视频名称" min-width="160" />
        <el-table-column prop="robotId" label="关联机器人" width="160" />
        <el-table-column prop="type" label="视频类型" width="120" />
        <el-table-column prop="duration" label="时长" width="100" />
        <el-table-column prop="createTime" label="创建时间" width="120" />
        <el-table-column label="预览" width="100">
          <template #default="scope">
            <el-button size="small" @click="handlePreview(scope.row)">预览</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
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
          <el-input v-model="videoForm.name" placeholder="请输入视频名称" />
        </el-form-item>
        <el-form-item label="关联机器人" required>
          <el-select v-model="videoForm.robotId" placeholder="请选择机器人">
            <el-option
              v-for="robot in robotList"
              :key="robot.id"
              :label="robot.name"
              :value="robot.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="视频类型" required>
          <el-select v-model="videoForm.type" placeholder="请选择视频类型">
            <el-option label="实时监控" value="live" />
            <el-option label="历史记录" value="history" />
          </el-select>
        </el-form-item>
        <el-form-item label="视频文件">
          <el-upload
            class="upload-demo"
            action="/api/upload"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
          >
            <el-button type="primary">选择文件</el-button>
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
        <video
          v-if="currentVideo"
          :src="currentVideo.url"
          controls
          style="width: 100%"
        ></video>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref(100)
const tableHeight = ref(0)

const filterForm = ref({
  name: '',
  robotId: '',
  type: ''
})

const videoList = ref([
  {
    id: '1',
    name: '机器人巡检视频',
    robotId: '01',
    type: '实时监控',
    duration: '10:00',
    createTime: '2024/03/20',
    url: 'https://example.com/video1.mp4'
  }
])

const robotList = ref([
  { id: '01', name: '大力神应急救援机器人' }
])

const dialogVisible = ref(false)
const previewVisible = ref(false)
const dialogType = ref('add')
const currentVideo = ref(null)

const videoForm = ref({
  name: '',
  robotId: '',
  type: '',
  url: ''
})

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
  // 这里应该调用后端 API 进行搜索
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 500)
}

const resetFilter = () => {
  filterForm.value = {
    name: '',
    robotId: '',
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
  handleSearch()
}

const showAddDialog = () => {
  dialogType.value = 'add'
  videoForm.value = {
    name: '',
    robotId: '',
    type: '',
    url: ''
  }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogType.value = 'edit'
  videoForm.value = { ...row }
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除视频"${row.name}"吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    videoList.value = videoList.value.filter(item => item.id !== row.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const handlePreview = (row) => {
  currentVideo.value = row
  previewVisible.value = true
}

const handleUploadSuccess = (response) => {
  videoForm.value.url = response.url
  ElMessage.success('上传成功')
}

const beforeUpload = (file) => {
  const isVideo = file.type.startsWith('video/')
  if (!isVideo) {
    ElMessage.error('只能上传视频文件！')
    return false
  }
  return true
}

const handleSubmit = () => {
  if (dialogType.value === 'add') {
    const newVideo = {
      ...videoForm.value,
      id: String(videoList.value.length + 1),
      createTime: new Date().toLocaleDateString(),
      duration: '00:00' // 这里应该根据实际视频时长计算
    }
    videoList.value.push(newVideo)
    ElMessage.success('添加成功')
  } else {
    const index = videoList.value.findIndex(item => item.id === videoForm.value.id)
    if (index !== -1) {
      videoList.value[index] = { ...videoForm.value }
      ElMessage.success('修改成功')
    }
  }
  dialogVisible.value = false
}
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
  margin-top: 16px;
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

:deep(.el-form-item) {
  margin-bottom: 22px;
  margin-right: 0;
}

:deep(.el-form--inline .el-form-item) {
  margin-right: 32px;
  margin-bottom: 0;
}

:deep(.el-form--inline .el-form-item__content) {
  margin-left: 8px;
}

:deep(.el-select) {
  width: 180px;
}

:deep(.el-input) {
  width: 180px;
}

:deep(.el-button .el-icon) {
  margin-right: 4px;
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