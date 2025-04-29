<template>
  <div class="data-type-settings">
    <!-- 筛选区域 -->
    <div class="filter-section">
      <el-form :inline="true" :model="filterForm" class="filter-form" ref="formRef" :rules="rules">
        <el-form-item label="类型名称" prop="name">
          <el-input v-model="filterForm.name" placeholder="请输入类型名称" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>新增数据类型
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 数据类型列表 -->
    <div class="table-section">
      <el-table 
        :data="dataTypeList" 
        style="width: 100%" 
        border 
        stripe 
        v-loading="loading"
        :height="tableHeight"
      >
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column prop="name" label="类型名称" min-width="120" />
        <el-table-column label="操作" width="80" fixed="right">
          <template #default="scope">
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
const formRef = ref(null)

const filterForm = ref({
  name: ''
})

const dataTypeList = ref([])

const rules = {
  name: [
    { required: true, message: '请输入类型名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ]
}

// 获取数据类型列表
const fetchDataTypeList = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      page_size: pageSize.value
    }
    
    const response = await api.get('/data-types', { params })
    dataTypeList.value = response.items || []
    total.value = response.total || 0
  } catch (error) {
    console.error('获取数据类型列表失败:', error)
    ElMessage.error('获取数据类型列表失败')
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
  fetchDataTypeList()
})

const handleAdd = async () => {
  try {
    await formRef.value?.validate()
    if (filterForm.value.name.trim()) {
      await api.post('/data-types', {
        name: filterForm.value.name.trim()
      })
      ElMessage.success('添加成功')
      filterForm.value.name = ''
      fetchDataTypeList()
    }
  } catch (error) {
    if (error.response?.status === 400) {
      ElMessage.error(error.response.data.detail || '请求参数错误')
    } else if (error.response?.status === 422) {
      const detail = error.response.data.detail
      if (Array.isArray(detail)) {
        ElMessage.error(detail[0].msg)
      } else {
        ElMessage.error('数据验证失败')
      }
    } else {
      console.error('添加数据类型失败:', error)
      ElMessage.error('添加数据类型失败')
    }
  }
}

const handleSizeChange = (val) => {
  pageSize.value = val
  fetchDataTypeList()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchDataTypeList()
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除数据类型"${row.name}"吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await api.delete(`/data-types/${row.id}`)
      ElMessage.success('删除成功')
      fetchDataTypeList()
    } catch (error) {
      console.error('删除数据类型失败:', error)
      ElMessage.error('删除数据类型失败')
    }
  }).catch(() => {})
}

const handleSearch = () => {
  currentPage.value = 1
  fetchDataTypeList()
}
</script>

<style scoped>
.data-type-settings {
  padding: 0;
  background-color: #fff;
  height: 100%;
}

.filter-section {
  margin-bottom: 16px;
  padding-bottom: 0;
}

.filter-form {
  margin-bottom: 4px;
}

:deep(.el-form--inline .el-form-item) {
  margin-bottom: 8px;
  margin-right: 15px;
}

:deep(.el-form--inline .el-form-item__content) {
  margin-left: 1px;
}

:deep(.el-form-item__label) {
  padding-right: 2px;
}

:deep(.el-input) {
  width: 200px;
}

:deep(.el-button) {
  padding: 6px 10px;
  margin-left: 2px;
}

.action-buttons {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 4px;
  margin-top: 8px;
}

.left-buttons {
  display: flex;
  gap: 8px;
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
  border-right: 1px solid #dcdfe6;
}

:deep(.el-table th:last-child) {
  border-right: none;
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
  height: 44px;
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background-color: #eef0f2 !important;
}

:deep(.el-table__body tr.el-table__row--striped) {
  background-color: #eef0f2 !important;
}

:deep(.el-table__header-wrapper) {
  border-bottom: 1px solid #dcdfe6;
}

:deep(.el-button--small) {
  padding: 6px 12px;
  font-size: 12px;
  height: 28px;
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

:deep(.el-tag) {
  margin-right: 0;
}
</style> 