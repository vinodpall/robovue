<template>
  <div class="award-settings">
    <!-- 筛选区域 -->
    <div class="filter-section">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="荣誉名称">
          <el-input v-model="filterForm.name" placeholder="请输入荣誉名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="action-buttons">
        <div class="left-buttons">
          <el-button type="primary" @click="showAddDialog">
            <el-icon><Plus /></el-icon>新增荣誉
          </el-button>
        </div>
      </div>
    </div>

    <!-- 荣誉列表 -->
    <div class="table-section">
      <el-table 
        :data="awardList" 
        style="width: 100%" 
        border 
        stripe 
        v-loading="loading"
        :height="tableHeight"
      >
        <el-table-column prop="id" label="编号" width="80" />
        <el-table-column prop="name" label="荣誉名称" min-width="160" />
        <el-table-column prop="description" label="荣誉介绍" min-width="200" show-overflow-tooltip />
        <el-table-column label="图片地址" min-width="200" show-overflow-tooltip>
          <template #default="scope">
            <el-button 
              size="small" 
              type="primary" 
              @click="handlePreview(scope.row)"
              v-if="scope.row.image_url"
            >
              预览图片
            </el-button>
            <span v-else>-</span>
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
      :title="dialogType === 'add' ? '新增荣誉' : '编辑荣誉'"
      v-model="dialogVisible"
      width="600px"
    >
      <el-form 
        :model="awardForm" 
        label-width="120px" 
        class="settings-form"
        :rules="rules"
        ref="awardFormRef"
      >
        <el-form-item label="荣誉名称" prop="name">
          <el-input v-model="awardForm.name" placeholder="请输入荣誉名称" />
        </el-form-item>
        
        <el-form-item label="荣誉介绍" prop="description">
          <el-input
            v-model="awardForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入荣誉介绍"
          />
        </el-form-item>
        
        <el-form-item label="图片地址" prop="image_url">
          <el-upload
            class="upload-demo"
            :action="uploadAction"
            :headers="uploadHeaders"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :before-upload="beforeUpload"
            :show-file-list="false"
          >
            <el-button type="primary">上传图片</el-button>
            <template #tip>
              <div class="el-upload__tip">
                支持 jpg/png 格式，建议尺寸 800x600
              </div>
            </template>
          </el-upload>
          <div v-if="awardForm.image_url" class="preview-image">
            <img :src="getImageUrl(awardForm.image_url)" alt="预览图片" />
            <el-button 
              type="danger" 
              size="small" 
              @click="awardForm.image_url = ''"
              class="delete-image"
            >
              删除
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 图片预览弹窗 -->
    <el-dialog
      title="图片预览"
      v-model="previewVisible"
      width="800px"
      class="preview-dialog"
    >
      <div class="preview-content">
        <img v-if="currentAward?.image_url" :src="getImageUrl(currentAward.image_url)" alt="荣誉图片" />
        <div v-else class="no-image">暂无图片</div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import api from '../../api'

const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref(0)
const tableHeight = ref(0)

const filterForm = ref({
  name: ''
})

const awardList = ref([])

const dialogVisible = ref(false)
const dialogType = ref('add')
const awardFormRef = ref(null)

const awardForm = ref({
  name: '',
  description: '',
  image_url: '',
  is_carousel: false
})

const rules = {
  name: [
    { required: true, message: '请输入荣誉名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  description: [
    { min: 0, max: 500, message: '长度不能超过 500 个字符', trigger: 'blur' }
  ]
}

const previewVisible = ref(false)
const currentAward = ref(null)

const uploadAction = `${import.meta.env.VITE_API_BASE_URL}/api/upload/image`
const uploadHeaders = {
  'Authorization': `Bearer ${localStorage.getItem('token')}`
}

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('只能上传图片文件！')
    return false
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB！')
    return false
  }
  return true
}

const handleUploadSuccess = (response) => {
  if (response && response.url) {
    awardForm.value.image_url = response.url
    ElMessage.success('图片上传成功')
  } else {
    ElMessage.error('图片上传失败：未获取到图片URL')
  }
}

const handleUploadError = () => {
  ElMessage.error('上传失败，请重试')
}

// 获取荣誉列表
const fetchAwardList = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      page_size: pageSize.value,
      name: filterForm.value.name || undefined
    }
    
    const response = await api.get('/awards', { params })
    awardList.value = response.items || []
    total.value = response.total || 0
  } catch (error) {
    console.error('获取荣誉列表失败:', error)
    ElMessage.error('获取荣誉列表失败')
  } finally {
    loading.value = false
  }
}

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
  fetchAwardList()
})

const handleSearch = () => {
  currentPage.value = 1
  fetchAwardList()
}

const resetFilter = () => {
  filterForm.value = {
    name: ''
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
  awardForm.value = {
    name: '',
    description: '',
    image_url: '',
    is_carousel: false
  }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogType.value = 'edit'
  awardForm.value = { ...row }
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除荣誉"${row.name}"吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await api.delete(`/awards/${row.id}`)
      ElMessage.success('删除成功')
      fetchAwardList()
    } catch (error) {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

const handleSubmit = () => {
  awardFormRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        if (dialogType.value === 'add') {
          await api.post('/awards', awardForm.value)
          ElMessage.success('新增成功')
        } else {
          await api.put(`/awards/${awardForm.value.id}`, awardForm.value)
          ElMessage.success('保存成功')
        }
        dialogVisible.value = false
        fetchAwardList()
      } catch (error) {
        console.error('保存失败:', error)
        ElMessage.error('保存失败')
      }
    }
  })
}

const handleCarousel = async (row) => {
  try {
    const newStatus = !row.is_carousel
    await api.put(`/awards/${row.id}`, {
      ...row,
      is_carousel: newStatus
    })
    ElMessage.success(newStatus ? '已开启轮播' : '已取消轮播')
    fetchAwardList()
  } catch (error) {
    console.error('更新轮播状态失败:', error)
    ElMessage.error('更新轮播状态失败')
  }
}

// 修改图片URL处理
const getImageUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${import.meta.env.VITE_API_BASE_URL}${url}`
}

const handlePreview = (row) => {
  currentAward.value = row
  previewVisible.value = true
}
</script>

<style scoped>
.award-settings {
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
  padding: 20px;
  border-top: 1px solid #e6e6e6;
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

:deep(.el-textarea__inner) {
  min-height: 120px !important;
}

.preview-dialog {
  :deep(.el-dialog__body) {
    padding: 20px;
  }
}

.preview-content {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background-color: #f5f5f5;
  border-radius: 4px;
  
  img {
    max-width: 100%;
    max-height: 500px;
    object-fit: contain;
  }
  
  .no-image {
    color: #999;
    font-size: 14px;
  }
}

.upload-demo {
  width: 100%;
}

.el-upload__tip {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}

.preview-image {
  margin-top: 12px;
  position: relative;
  display: inline-block;
  
  img {
    max-width: 200px;
    max-height: 150px;
    object-fit: contain;
    border-radius: 4px;
  }
  
  .delete-image {
    position: absolute;
    top: 4px;
    right: 4px;
    padding: 4px 8px;
  }
}
</style> 