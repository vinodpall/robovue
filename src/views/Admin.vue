<template>
  <div class="admin-layout">
    <!-- 左侧导航栏 -->
    <div class="sidebar">
      <div class="logo">
        <img src="../assets/logo.png" alt="Logo" />
      </div>
      <div class="menu">
        <div 
          v-for="(item, index) in menuItems" 
          :key="index"
          class="menu-item"
          :class="{ active: currentTab === item.key }"
          @click="currentTab = item.key"
        >
          {{ item.label }}
        </div>
      </div>
    </div>
    
    <!-- 右侧内容区 -->
    <div class="main-content">
      <component :is="currentComponent" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import RobotManagement from '../components/admin/RobotManagement.vue'
import MonitorManagement from '../components/admin/MonitorManagement.vue'
import CompanySettings from '../components/admin/CompanySettings.vue'
import DataTypeSettings from '../components/admin/DataTypeSettings.vue'
import AwardSettings from '../components/admin/AwardSettings.vue'
import OtherSettings from '../components/admin/OtherSettings.vue'

const menuItems = [
  { key: 'robot', label: '首页', component: RobotManagement },
  { key: 'monitor', label: '监控界面', component: MonitorManagement },
  { key: 'company', label: '企业设置', component: CompanySettings },
  { key: 'dataType', label: '数据类型设置', component: DataTypeSettings },
  { key: 'award', label: '荣誉设置', component: AwardSettings },
  { key: 'other', label: '其他设置', component: OtherSettings }
]

const currentTab = ref('robot')

const currentComponent = computed(() => {
  const item = menuItems.find(item => item.key === currentTab.value)
  return item ? item.component : null
})
</script>

<style>
.admin-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: #fff;
}

.sidebar {
  width: 220px;
  background-color: #fff;
  color: #333;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 1000;
  border-right: 1px solid #e6e6e6;
}

.logo {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #e6e6e6;
  padding: 0 20px;
}

.logo img {
  height: 65px;
  width: auto;
  max-width: 100%;
}

.menu {
  padding-top: 0;
}

.menu-item {
  height: 50px;
  padding: 0 24px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  display: flex;
  align-items: center;
  color: #333;
}

.menu-item:hover {
  background-color: #f5f5f5;
  color: #1890ff;
}

.menu-item.active {
  background-color: #e6f7ff;
  color: #1890ff;
  border-right: 3px solid #1890ff;
}

.main-content {
  flex: 1;
  margin-left: 220px;
  min-height: 100vh;
  background-color: #fff;
  padding: 24px;
  box-sizing: border-box;
}

@media screen and (max-width: 1366px) {
  .sidebar {
    width: 200px;
  }
  
  .main-content {
    margin-left: 200px;
  }
}

@media screen and (max-width: 768px) {
  .sidebar {
    width: 180px;
  }
  
  .main-content {
    margin-left: 180px;
    padding: 16px;
  }
  
  .menu-item {
    padding: 0 16px;
    font-size: 13px;
  }
}
</style> 