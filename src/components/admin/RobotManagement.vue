<template>
  <div class="robot-management">
    <!-- 筛选区域 -->
    <div class="filter-section">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="机器人名称/编号">
          <el-input v-model="filterForm.name_or_serial" placeholder="请输入名称或编号" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item label="机器人种类">
          <el-select v-model="filterForm.industry_type" placeholder="请选择种类" clearable style="width: 160px">
            <el-option label="工业机器人" value="工业机器人" />
            <el-option label="特种机器人" value="特种机器人" />
            <el-option label="服务机器人" value="服务机器人" />
          </el-select>
        </el-form-item>
        <el-form-item label="应用场景">
          <el-select v-model="filterForm.training_field_id" placeholder="请选择应用场景" clearable style="width: 160px">
            <el-option
              v-for="field in trainingFieldList"
              :key="field.id"
              :label="field.name"
              :value="field.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" placeholder="请选择状态" clearable style="width: 120px">
            <el-option label="在线" value="在线" />
            <el-option label="离线" value="离线" />
            <el-option label="故障" value="故障" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYYMMDD"
            style="width: 240px"
            :locale="locale"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="action-buttons">
        <div class="left-buttons">
          <el-button type="primary" @click="showAddDialog">
            <el-icon><Plus /></el-icon>新增机器人
          </el-button>
        </div>
        <div class="right-buttons">
          <el-button type="success" @click="handleDataCollection">
            <el-icon><Upload /></el-icon>入库数据采集
          </el-button>
        </div>
      </div>
    </div>

    <!-- 数据列表 -->
    <div class="table-section">
      <el-table 
        :data="robotList" 
        style="width: 100%" 
        border 
        stripe 
        v-loading="loading"
        :height="tableHeight"
        resizable
      >
        <el-table-column type="index" label="编号" width="80" />
        <el-table-column prop="name" label="机器人名称" min-width="160">
          <template #default="scope">
            <el-link type="primary" @click="showDetail(scope.row)">{{ scope.row.name }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="serial_number" label="型号" min-width="140" />
        <el-table-column prop="industry_type" label="种类" width="120" />
        <el-table-column prop="training_field.name" label="应用场景" width="140" />
        <el-table-column prop="skills" label="技能" min-width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === '在线' ? 'success' : 'info'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="company.name" label="企业" min-width="160" />
        <el-table-column prop="create_date" label="创建时间" width="180">
          <template #default="scope">
            {{ formatTimestamp(scope.row.create_date) }}
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
      :title="dialogType === 'add' ? '新增机器人' : '编辑机器人'"
      v-model="dialogVisible"
      width="1000px"
      class="robot-dialog"
      :close-on-click-modal="false"
    >
      <el-form :model="robotForm" label-width="120px" class="robot-form">
        <div class="form-columns">
          <div class="form-column left-column">
            <el-form-item label="机器人名称" required>
              <el-input v-model="robotForm.name" placeholder="请输入机器人名称" />
            </el-form-item>
            <el-form-item label="机器人型号" required>
              <el-input v-model="robotForm.serial_number" placeholder="请输入机器人型号" />
            </el-form-item>
            <el-form-item label="企业" required>
              <el-select v-model="robotForm.company_id" placeholder="请选择企业" style="width: 100%">
                <el-option
                  v-for="company in companyList"
                  :key="company.id"
                  :label="company.name"
                  :value="company.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="机器人类型" required>
              <el-select v-model="robotForm.industry_type" placeholder="请选择机器人类型" style="width: 100%">
                <el-option label="工业机器人" value="工业机器人" />
                <el-option label="特种机器人" value="特种机器人" />
                <el-option label="服务机器人" value="服务机器人" />
              </el-select>
            </el-form-item>
            <el-form-item label="应用场景" required>
              <el-select v-model="robotForm.training_field_id" placeholder="请选择应用场景" style="width: 100%">
                <el-option
                  v-for="field in trainingFieldList"
                  :key="field.id"
                  :label="field.name"
                  :value="field.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="状态" required>
              <el-select v-model="robotForm.status" placeholder="请选择状态" style="width: 100%">
                <el-option label="在线" value="在线" />
                <el-option label="离线" value="离线" />
                <el-option label="故障" value="故障" />
              </el-select>
            </el-form-item>
            <el-form-item label="技能" required>
              <el-select v-model="robotForm.skills" placeholder="请选择技能" style="width: 100%">
                <el-option label="操作性能" value="操作性能" />
                <el-option label="移动性能" value="移动性能" />
                <el-option label="交互性能" value="交互性能" />
                <el-option label="其他" value="其他" />
              </el-select>
            </el-form-item>
            <el-form-item label="价格">
              <el-input v-model="robotForm.price" placeholder="请输入价格" />
            </el-form-item>
            <el-form-item label="产地">
              <el-input v-model="robotForm.product_location" placeholder="请输入产地" />
            </el-form-item>
          </div>
          <div class="form-column right-column">
            <el-form-item label="图片">
              <el-upload
                class="avatar-uploader"
                :action="`${API_BASE_URL}/api/upload/image`"
                :show-file-list="false"
                :on-success="handleImageSuccess"
                :before-upload="beforeImageUpload"
              >
                <img v-if="robotForm.image_url" :src="getImageUrl(robotForm.image_url)" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
            <el-form-item label="参数">
              <div class="parameter-input">
                <el-input v-model="parameterInput" placeholder="请输入参数，如：高度：100x100x100" />
                <el-button type="primary" @click="addParameter">添加</el-button>
              </div>
              <div class="parameter-list">
                <el-tag
                  v-for="(param, index) in parameterList"
                  :key="index"
                  closable
                  @close="removeParameter(index)"
                >
                  {{ param }}
                </el-tag>
              </div>
            </el-form-item>
            <el-form-item label="荣誉">
              <div class="parameter-input">
                <el-input v-model="awardInput" placeholder="请输入荣誉" />
                <el-button type="primary" @click="addAward">添加</el-button>
              </div>
              <div class="parameter-list">
                <el-tag
                  v-for="(award, index) in awardList"
                  :key="index"
                  closable
                  @close="removeAward(index)"
                >
                  {{ award }}
                </el-tag>
              </div>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="robotForm.remarks" placeholder="请输入备注" />
            </el-form-item>
            <el-form-item label="推荐理由">
              <div class="rich-text-editor">
                <el-input
                  v-model="robotForm.recommendation_reason"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入推荐理由"
                />
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog
      title="机器人详情"
      v-model="detailVisible"
      width="1000px"
      class="detail-dialog"
      :close-on-click-modal="false"
    >
      <div class="detail-content">
        <div class="detail-header">
          <div class="detail-image">
            <img :src="getImageUrl(currentRobot.image_url)" alt="机器人图片" />
          </div>
          <div class="detail-info">
            <h2>{{ currentRobot.name }}</h2>
            <p><span class="label">型号：</span>{{ currentRobot.serial_number }}</p>
            <p><span class="label">企业：</span>{{ currentRobot.company?.name }}</p>
            <p><span class="label">类型：</span>{{ currentRobot.industry_type }}</p>
            <p><span class="label">应用场景：</span>{{ currentRobot.training_field?.name }}</p>
            <p><span class="label">状态：</span>
              <el-tag :type="currentRobot.status === '在线' ? 'success' : 'info'">
                {{ currentRobot.status }}
              </el-tag>
            </p>
            <p><span class="label">价格：</span>{{ currentRobot.price }}</p>
            <p><span class="label">产地：</span>{{ currentRobot.product_location }}</p>
            <p><span class="label">创建时间：</span>{{ currentRobot.create_date }}</p>
          </div>
        </div>
        <div class="detail-body">
          <div class="detail-columns">
            <div class="detail-column">
              <div class="detail-section">
                <h3>技能</h3>
                <p>{{ currentRobot.skills }}</p>
              </div>
              <div class="detail-section">
                <h3>参数</h3>
                <p>{{ currentRobot.dimensions }}</p>
              </div>
              <div class="detail-section">
                <h3>荣誉</h3>
                <p>{{ currentRobot.awards }}</p>
              </div>
            </div>
            <div class="detail-column">
              <div class="detail-section">
                <h3>推荐理由</h3>
                <p>{{ currentRobot.recommendation_reason }}</p>
              </div>
              <div class="detail-section">
                <h3>备注</h3>
                <p>{{ currentRobot.remarks }}</p>
              </div>
              <div class="detail-section">
                <h3>数据记录</h3>
                <div v-if="currentRobot.data_records && currentRobot.data_records.length > 0">
                  <p v-for="(record, index) in currentRobot.data_records" :key="index">
                    {{ record }}
                  </p>
                </div>
                <p v-else>暂无数据记录</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Upload } from '@element-plus/icons-vue'
import axios from 'axios'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const API_BASE_URL = 'http://127.0.0.1:8000'

// 配置Element Plus使用中文
const locale = zhCn

const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref(100)
const tableHeight = ref(0)

const filterForm = ref({
  name_or_serial: '',
  industry_type: '',
  training_field_id: '',
  status: '',
  dateRange: []
})

const robotList = ref([])
const dialogVisible = ref(false)
const dialogType = ref('add')
const robotForm = ref({
  name: '',
  industry_type: '',
  training_field_id: '',
  skills: '',
  status: '在线',
  price: '',
  serial_number: '',
  product_location: '',
  dimensions: '',
  remarks: '',
  awards: '',
  recommendation_reason: '',
  image_url: ''
})

const parameterInput = ref('')
const parameterList = ref([])
const awardInput = ref('')
const awardList = ref([])
const companyList = ref([])
const trainingFieldList = ref([])
const detailVisible = ref(false)
const currentRobot = ref({})

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

// 修改图片URL处理
const getImageUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${API_BASE_URL}${url}`
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

// 获取机器人列表
const fetchRobotList = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      page_size: pageSize.value,
      name_or_serial: filterForm.value.name_or_serial || undefined,
      industry_type: filterForm.value.industry_type || undefined,
      training_field_id: filterForm.value.training_field_id || undefined,
      status: filterForm.value.status || undefined,
      start_date: filterForm.value.dateRange?.[0] || undefined,
      end_date: filterForm.value.dateRange?.[1] || undefined
    }
    
    console.log('请求参数:', params)
    console.log('请求URL:', `${API_BASE_URL}/api/robots`)
    
    const response = await axios.get(`${API_BASE_URL}/api/robots`, { params })
    console.log('响应数据:', response.data)
    
    robotList.value = response.data.items
    total.value = response.data.total
  } catch (error) {
    console.error('获取机器人列表失败:', error)
    console.error('错误详情:', error.response)
    ElMessage.error('获取机器人列表失败')
  } finally {
    loading.value = false
  }
}

// 获取企业列表
const fetchCompanies = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/companies`)
    companyList.value = response.data.items
  } catch (error) {
    console.error('获取企业列表失败:', error)
    ElMessage.error('获取企业列表失败')
  }
}

// 获取应用场景列表
const fetchTrainingFields = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/training-fields`)
    trainingFieldList.value = response.data.items || []
    console.log('应用场景列表:', trainingFieldList.value)
  } catch (error) {
    console.error('获取应用场景列表失败:', error)
    ElMessage.error('获取应用场景列表失败')
  }
}

// 删除机器人
const deleteRobot = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/api/robots/${id}`)
    ElMessage.success('删除成功')
    fetchRobotList()
  } catch (error) {
    console.error('删除机器人失败:', error)
    ElMessage.error('删除机器人失败')
  }
}

// 添加或更新机器人
const saveRobot = async (data) => {
  try {
    if (dialogType.value === 'add') {
      await axios.post(`${API_BASE_URL}/api/robots`, data)
      ElMessage.success('添加成功')
    } else {
      await axios.put(`${API_BASE_URL}/api/robots/${data.id}`, data)
      ElMessage.success('修改成功')
    }
    dialogVisible.value = false
    fetchRobotList()
  } catch (error) {
    console.error('保存机器人失败:', error)
    ElMessage.error('保存机器人失败')
  }
}

onMounted(() => {
  fetchRobotList()
  fetchCompanies()
  fetchTrainingFields()
  calculateTableHeight()
})

const handleDataCollection = () => {
  // 处理数据采集
  ElMessage.success('开始数据采集')
}

const handleSearch = () => {
  currentPage.value = 1
  fetchRobotList()
}

const resetFilter = () => {
  filterForm.value = {
    name_or_serial: '',
    industry_type: '',
    training_field_id: '',
    status: '',
    dateRange: []
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

const addParameter = () => {
  if (parameterInput.value.trim()) {
    parameterList.value.push(parameterInput.value.trim())
    robotForm.value.dimensions = parameterList.value.join(';')
    parameterInput.value = ''
  }
}

const removeParameter = (index) => {
  parameterList.value.splice(index, 1)
  robotForm.value.dimensions = parameterList.value.join(';')
}

const addAward = () => {
  if (awardInput.value.trim()) {
    awardList.value.push(awardInput.value.trim())
    robotForm.value.awards = awardList.value.join(';')
    awardInput.value = ''
  }
}

const removeAward = (index) => {
  awardList.value.splice(index, 1)
  robotForm.value.awards = awardList.value.join(';')
}

const handleImageSuccess = (response) => {
  if (response && response.url) {
    robotForm.value.image_url = response.url
    ElMessage.success('图片上传成功')
  } else {
    ElMessage.error('图片上传失败：未获取到图片URL')
  }
}

const beforeImageUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('上传文件只能是图片格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('上传图片大小不能超过 2MB!')
    return false
  }
  return true
}

const showAddDialog = () => {
  dialogType.value = 'add'
  parameterList.value = []
  awardList.value = []
  robotForm.value = {
    name: '',
    serial_number: '',
    company_id: '',
    industry_type: '',
    training_field_id: '',
    skills: '',
    status: '在线',
    price: '',
    product_location: '',
    dimensions: '',
    remarks: '',
    awards: '',
    recommendation_reason: '',
    image_url: ''
  }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogType.value = 'edit'
  parameterList.value = row.dimensions ? row.dimensions.split(';') : []
  awardList.value = row.awards ? row.awards.split(';') : []
  robotForm.value = { 
    ...row,
    training_field_id: row.training_field?.id || row.training_field_id || '',
    company_id: row.company_id,
    image_url: row.image_url || ''
  }
  console.log('编辑数据:', robotForm.value)
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除机器人"${row.name}"吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    deleteRobot(row.id)
  }).catch(() => {})
}

const handleSubmit = () => {
  saveRobot(robotForm.value)
}

const showDetail = (row) => {
  currentRobot.value = row
  detailVisible.value = true
}
</script>

<style scoped>
.robot-management {
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
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}

:deep(.filter-form .el-form-item) {
  margin-right: 16px;
  margin-bottom: 0;
}

:deep(.filter-form .el-form-item__label) {
  padding-right: 8px;
}

:deep(.filter-form .el-form-item__content) {
  margin-left: 0;
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

:deep(.el-table__cell) {
  padding: 6px 0;
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

:deep(.el-table__column-resize-proxy) {
  background-color: #409EFF;
}

.robot-form {
  max-height: 600px;
  overflow-y: auto;
}

.form-columns {
  display: flex;
  gap: 40px;
}

.form-column {
  flex: 1;
}

.parameter-input {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.parameter-input .el-input {
  flex: 1;
}

.parameter-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

:deep(.el-dialog__body) {
  padding: 20px 40px;
}

:deep(.el-form-item) {
  margin-bottom: 22px;
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
  width: 100%;
}

:deep(.el-input) {
  width: 100%;
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
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-uploader:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 20px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  text-align: center;
  line-height: 120px;
}

.avatar {
  width: 120px;
  height: 120px;
  display: block;
  object-fit: contain;
  background-color: #f5f7fa;
}

.rich-text-editor {
  width: 100%;
}

:deep(.el-textarea__inner) {
  min-height: 120px !important;
}

.robot-dialog {
  margin-top: 5vh !important;
}

.robot-dialog :deep(.el-dialog__body) {
  padding: 20px 40px;
  max-height: 70vh;
  overflow-y: auto;
}

.form-columns {
  display: flex;
  gap: 40px;
}

.left-column, .right-column {
  flex: 1;
  min-width: 0;
}

.parameter-input {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.parameter-input .el-input {
  flex: 1;
}

.parameter-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-uploader:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 20px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  text-align: center;
  line-height: 120px;
}

.avatar {
  width: 120px;
  height: 120px;
  display: block;
  object-fit: contain;
  background-color: #f5f7fa;
}

.rich-text-editor {
  width: 100%;
}

:deep(.el-textarea__inner) {
  min-height: 120px !important;
}

:deep(.el-form-item) {
  margin-bottom: 22px;
}

:deep(.el-dialog) {
  margin-top: 5vh !important;
}

.detail-dialog {
  margin-top: 5vh !important;
}

.detail-dialog :deep(.el-dialog__body) {
  padding: 20px 40px;
  max-height: 70vh;
  overflow-y: auto;
}

.detail-content {
  padding: 20px;
}

.detail-header {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.detail-image {
  width: 200px;
  height: 200px;
  border-radius: 4px;
  overflow: hidden;
  background-color: #f5f7fa;
  flex-shrink: 0;
}

.detail-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.detail-info {
  flex: 1;
}

.detail-info h2 {
  margin: 0 0 15px 0;
  font-size: 20px;
  color: #303133;
}

.detail-info p {
  margin: 8px 0;
  color: #606266;
  display: flex;
  align-items: center;
}

.detail-body {
  margin-top: 20px;
}

.detail-columns {
  display: flex;
  gap: 20px;
}

.detail-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-section {
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
  flex: 1;
}

.detail-section h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #303133;
  padding-bottom: 8px;
  border-bottom: 1px solid #dcdfe6;
}

.detail-section p {
  margin: 0;
  color: #606266;
  line-height: 1.6;
}

.label {
  color: #909399;
  margin-right: 8px;
  min-width: 80px;
  display: inline-block;
}

.dimensions-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.dimension-tag {
  margin: 2px;
  background-color: #f0f2f5;
  border-color: #e4e7ed;
  color: #606266;
}
</style> 