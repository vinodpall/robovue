<template>
  <div class="company-settings">
    <!-- 筛选区域 -->
    <div class="filter-section">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="企业名称">
          <el-input v-model="filterForm.name" placeholder="请输入企业名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="action-buttons">
        <div class="left-buttons">
          <el-button type="primary" @click="showAddDialog">
            <el-icon><Plus /></el-icon>新增企业
          </el-button>
        </div>
      </div>
    </div>

    <!-- 企业列表 -->
    <div class="table-section">
      <el-table 
        :data="companyList" 
        style="width: 100%" 
        border 
        stripe 
        v-loading="loading"
        :height="tableHeight"
      >
        <el-table-column prop="id" label="编号" width="80" />
        <el-table-column prop="name" label="企业名称" min-width="160" />
        <el-table-column label="荣誉" min-width="200">
          <template #default="scope">
            <el-tag
              v-for="award in scope.row.awards"
              :key="award.id"
              size="small"
              class="award-tag"
            >
              {{ award.name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="160">
          <template #default="scope">
            {{ formatTime(scope.row.createTime) }}
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
      :title="dialogType === 'add' ? '新增企业' : '编辑企业'"
      v-model="dialogVisible"
      width="600px"
    >
      <el-form 
        :model="companyForm" 
        label-width="120px" 
        class="settings-form"
        :rules="rules"
        ref="companyFormRef"
      >
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="companyForm.name" placeholder="请输入企业名称" />
        </el-form-item>
        
        <el-form-item label="企业介绍" prop="description">
          <el-input
            v-model="companyForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入企业介绍"
          />
        </el-form-item>
        
        <el-form-item label="企业荣誉" prop="award_ids">
          <el-select
            v-model="companyForm.award_ids"
            multiple
            filterable
            placeholder="请选择企业荣誉"
            style="width: 100%"
          >
            <el-option
              v-for="award in awardOptions"
              :key="award.id"
              :label="award.name"
              :value="award.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import api from '../../api'

const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref(100)
const tableHeight = ref(0)

const filterForm = ref({
  name: '',
})

const companyList = ref([
  {
    id: '1',
    name: '示例企业',
    createTime: '2024/03/20',
    is_carousel: false
  }
])

const dialogVisible = ref(false)
const dialogType = ref('add')
const companyFormRef = ref(null)

const companyForm = ref({
  name: '',
  description: '',
  award_ids: [],
  is_carousel: false
})

const rules = {
  name: [
    { required: true, message: '请输入企业名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  description: [
    { min: 0, max: 500, message: '长度不能超过 500 个字符', trigger: 'blur' }
  ]
}

// 格式化时间函数
const formatTime = (timestamp) => {
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
  fetchAwards()
  fetchCompanyList()
})

const handleSearch = () => {
  currentPage.value = 1
  fetchCompanyList()
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
  companyForm.value = {
    name: '',
    description: '',
    award_ids: [],
    is_carousel: false
  }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogType.value = 'edit'
  companyForm.value = {
    ...row,
    award_ids: row.awards?.map(award => award.id) || []
  }
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除企业"${row.name}"吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await api.delete(`/companies/${row.id}`)
      ElMessage.success('删除成功')
      fetchCompanyList()
    } catch (error) {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

const handleAvatarSuccess = (response) => {
  companyForm.value.logo = response.url
}

const beforeAvatarUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('上传头像图片只能是图片格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
    return false
  }
  return true
}

const handleSubmit = () => {
  companyFormRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        // 准备提交的数据
        const submitData = {
          ...companyForm.value,
          award_ids: companyForm.value.award_ids || [] // 确保 award_ids 是数组
        }
        
        if (dialogType.value === 'add') {
          await api.post('/companies', submitData)
          ElMessage.success('新增成功')
        } else {
          await api.put(`/companies/${companyForm.value.id}`, submitData)
          ElMessage.success('保存成功')
        }
        dialogVisible.value = false
        fetchCompanyList()
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
    await api.put(`/companies/${row.id}`, {
      ...row,
      is_carousel: newStatus
    })
    ElMessage.success(newStatus ? '已开启轮播' : '已取消轮播')
    fetchCompanyList()
  } catch (error) {
    console.error('更新轮播状态失败:', error)
    ElMessage.error('更新轮播状态失败')
  }
}

const fetchAwards = async () => {
  try {
    const response = await api.get('/awards')
    awardOptions.value = response.items || []
  } catch (error) {
    console.error('获取荣誉列表失败:', error)
    ElMessage.error('获取荣誉列表失败')
  }
}

const fetchCompanyList = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      page_size: pageSize.value,
      name: filterForm.value.name || undefined
    }
    
    console.log('请求参数:', params) // 添加调试信息
    
    const response = await api.get('/companies', { params })
    console.log('响应数据:', response) // 添加调试信息
    
    companyList.value = response.items.map(item => ({
      ...item,
      createTime: item.create_time || item.createTime,
      award_ids: item.awards?.map(award => award.id) || []
    }))
    total.value = response.total
  } catch (error) {
    console.error('获取企业列表失败:', error)
    ElMessage.error('获取企业列表失败')
  } finally {
    loading.value = false
  }
}

// 荣誉选项列表
const awardOptions = ref([])
</script>

<style scoped>
.company-settings {
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

.avatar-uploader {
  width: 178px;
  height: 178px;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  line-height: 178px;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.settings-card {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.settings-form {
  margin-top: 20px;
  padding: 0 20px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-textarea__inner) {
  min-height: 120px !important;
}

.award-tag {
  margin-right: 8px;
  margin-bottom: 4px;
}
</style> 