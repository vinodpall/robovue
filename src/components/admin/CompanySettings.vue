<template>
  <div class="company-settings">
    <div class="header">
      <h2>企业设置</h2>
      <el-button type="primary" @click="showAddDialog">新增企业</el-button>
    </div>

    <!-- 企业列表 -->
    <el-table :data="companyList" style="width: 100%" border>
      <el-table-column prop="id" label="编号" width="80" />
      <el-table-column prop="name" label="企业名称" />
      <el-table-column prop="contact" label="联系人" />
      <el-table-column prop="phone" label="联系电话" />
      <el-table-column prop="address" label="地址" />
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
      :title="dialogType === 'add' ? '新增企业' : '编辑企业'"
      v-model="dialogVisible"
      width="500px"
    >
      <el-form :model="companyForm" label-width="100px" :rules="rules" ref="formRef">
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="companyForm.name" />
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="companyForm.contact" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="companyForm.phone" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="companyForm.address" type="textarea" />
        </el-form-item>
        <el-form-item label="企业Logo">
          <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="companyForm.logo" :src="companyForm.logo" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const companyList = ref([
  {
    id: '1',
    name: '示例企业',
    contact: '张三',
    phone: '13800138000',
    address: '北京市朝阳区xxx街道',
    createTime: '2024/03/20',
    logo: ''
  }
])

const dialogVisible = ref(false)
const dialogType = ref('add')
const formRef = ref(null)

const companyForm = ref({
  name: '',
  contact: '',
  phone: '',
  address: '',
  logo: ''
})

const rules = {
  name: [
    { required: true, message: '请输入企业名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  contact: [
    { required: true, message: '请输入联系人', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请输入地址', trigger: 'blur' }
  ]
}

const showAddDialog = () => {
  dialogType.value = 'add'
  companyForm.value = {
    name: '',
    contact: '',
    phone: '',
    address: '',
    logo: ''
  }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogType.value = 'edit'
  companyForm.value = { ...row }
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
  ).then(() => {
    companyList.value = companyList.value.filter(item => item.id !== row.id)
    ElMessage.success('删除成功')
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
  formRef.value?.validate((valid) => {
    if (valid) {
      if (dialogType.value === 'add') {
        const newCompany = {
          ...companyForm.value,
          id: String(companyList.value.length + 1),
          createTime: new Date().toLocaleDateString()
        }
        companyList.value.push(newCompany)
        ElMessage.success('添加成功')
      } else {
        const index = companyList.value.findIndex(item => item.id === companyForm.value.id)
        if (index !== -1) {
          companyList.value[index] = { ...companyForm.value }
          ElMessage.success('修改成功')
        }
      }
      dialogVisible.value = false
    }
  })
}
</script>

<style scoped>
.company-settings {
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
</style> 