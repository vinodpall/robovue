<template>
  <div class="data-type-settings">
    <div class="header">
      <h2>数据类型设置</h2>
      <el-button type="primary" @click="showAddDialog">新增数据类型</el-button>
    </div>

    <!-- 数据类型列表 -->
    <el-table :data="dataTypeList" style="width: 100%" border>
      <el-table-column prop="id" label="编号" width="80" />
      <el-table-column prop="name" label="数据类型名称" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="format" label="数据格式" />
      <el-table-column prop="unit" label="单位" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      :title="dialogType === 'add' ? '新增数据类型' : '编辑数据类型'"
      v-model="dialogVisible"
      width="500px"
    >
      <el-form :model="dataTypeForm" label-width="100px" :rules="rules" ref="formRef">
        <el-form-item label="类型名称" prop="name">
          <el-input v-model="dataTypeForm.name" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="dataTypeForm.description" type="textarea" />
        </el-form-item>
        <el-form-item label="数据格式" prop="format">
          <el-select v-model="dataTypeForm.format" placeholder="请选择数据格式">
            <el-option label="数值型" value="number" />
            <el-option label="文本型" value="text" />
            <el-option label="日期型" value="date" />
            <el-option label="布尔型" value="boolean" />
            <el-option label="图像型" value="image" />
            <el-option label="视频型" value="video" />
          </el-select>
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="dataTypeForm.unit" />
        </el-form-item>
        <el-form-item label="验证规则">
          <el-form-item v-if="dataTypeForm.format === 'number'">
            <el-input-number v-model="dataTypeForm.minValue" placeholder="最小值" />
            <span class="mx-2">-</span>
            <el-input-number v-model="dataTypeForm.maxValue" placeholder="最大值" />
          </el-form-item>
          <el-form-item v-if="dataTypeForm.format === 'text'">
            <el-input-number v-model="dataTypeForm.maxLength" placeholder="最大长度" />
          </el-form-item>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const dataTypeList = ref([
  {
    id: '1',
    name: '交互行为数据',
    description: '记录机器人与人的交互行为数据',
    format: 'text',
    unit: '次',
    createTime: '2024/03/20'
  }
])

const dialogVisible = ref(false)
const dialogType = ref('add')
const formRef = ref(null)

const dataTypeForm = ref({
  name: '',
  description: '',
  format: '',
  unit: '',
  minValue: null,
  maxValue: null,
  maxLength: null
})

const rules = {
  name: [
    { required: true, message: '请输入类型名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入描述', trigger: 'blur' }
  ],
  format: [
    { required: true, message: '请选择数据格式', trigger: 'change' }
  ]
}

const showAddDialog = () => {
  dialogType.value = 'add'
  dataTypeForm.value = {
    name: '',
    description: '',
    format: '',
    unit: '',
    minValue: null,
    maxValue: null,
    maxLength: null
  }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogType.value = 'edit'
  dataTypeForm.value = { ...row }
  dialogVisible.value = true
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
  ).then(() => {
    dataTypeList.value = dataTypeList.value.filter(item => item.id !== row.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const handleSubmit = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      if (dialogType.value === 'add') {
        const newDataType = {
          ...dataTypeForm.value,
          id: String(dataTypeList.value.length + 1),
          createTime: new Date().toLocaleDateString()
        }
        dataTypeList.value.push(newDataType)
        ElMessage.success('添加成功')
      } else {
        const index = dataTypeList.value.findIndex(item => item.id === dataTypeForm.value.id)
        if (index !== -1) {
          dataTypeList.value[index] = { ...dataTypeForm.value }
          ElMessage.success('修改成功')
        }
      }
      dialogVisible.value = false
    }
  })
}
</script>

<style scoped>
.data-type-settings {
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.mx-2 {
  margin: 0 8px;
}
</style> 