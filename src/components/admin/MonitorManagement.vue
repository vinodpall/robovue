<template>
  <div class="monitor-management">
    <div class="header">
      <h2>监控视频管理</h2>
      <el-button type="primary" @click="showAddDialog">新增视频</el-button>
    </div>

    <!-- 视频列表 -->
    <el-table :data="videoList" style="width: 100%" border>
      <el-table-column prop="id" label="编号" width="80" />
      <el-table-column prop="name" label="视频名称" />
      <el-table-column prop="robotId" label="关联机器人" />
      <el-table-column prop="type" label="视频类型" />
      <el-table-column prop="duration" label="时长" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="预览" width="100">
        <template #default="scope">
          <el-button size="small" @click="handlePreview(scope.row)">预览</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      :title="dialogType === 'add' ? '新增视频' : '编辑视频'"
      v-model="dialogVisible"
      width="500px"
    >
      <el-form :model="videoForm" label-width="100px">
        <el-form-item label="视频名称">
          <el-input v-model="videoForm.name" />
        </el-form-item>
        <el-form-item label="关联机器人">
          <el-select v-model="videoForm.robotId" placeholder="请选择机器人">
            <el-option
              v-for="robot in robotList"
              :key="robot.id"
              :label="robot.name"
              :value="robot.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="视频类型">
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
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

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

.video-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background-color: #000;
}
</style> 