<template>
  <div class="page-content">
    <div class="video-grid">
      <div v-for="(frame, index) in currentPageFrames" 
           :key="index" 
           class="video-frame"
           :class="{ 'active': frame.isPlaying }">
        <div class="frame-title">
          <img src="../assets/agent.svg" class="agent-icon" alt="agent icon">
          {{ frame.title }}
        </div>
        <div class="video-container">
          <!-- 本地视频播放 -->
          <video
            v-if="!frame.isRtsp"
            :ref="el => { if (el) videoRefs[index] = el }"
            :id="'video-' + index"
            class="video-player"
            :src="frame.url"
            :controls="frame.showControls"
            :autoplay="frame.autoplay"
            :muted="frame.muted"
            loop
            @play="onVideoPlay(index)"
            @pause="onVideoPause(index)"
            @error="onVideoError(index)"
          ></video>
          
          <!-- RTSP视频流播放 -->
          <canvas
            v-else
            :ref="el => { if (el) canvasRefs[index] = el }"
            :id="'canvas-' + index"
            class="video-player"
          ></canvas>
          
          <div v-if="!frame.isPlaying" class="video-overlay">
            <button class="play-button" @click="startVideo(index)">播放</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 添加翻页按钮 -->
    <div v-if="totalPages > 1" class="page-controls">
      <div class="page-arrow" @click="prevPage" :class="{ 'disabled': currentPage === 0 }">
        <img src="../assets/arrow-left.svg" alt="上一页">
      </div>
      <div class="page-arrow" @click="nextPage" :class="{ 'disabled': currentPage === totalPages - 1 }">
        <img src="../assets/arrow-right.svg" alt="下一页">
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import frame2Bg from '../assets/frame_2.png'
import api from '../api'

const videoRefs = ref({})  // 改为对象形式
const canvasRefs = ref({}) // 改为对象形式
const wsConnections = ref({})
const frameBuffers = ref({})  // 视频帧缓冲区
const bufferSize = 5  // 缓冲区大小，可根据需要调整
const renderInterval = 33  // 约30fps的渲染间隔（33ms）
const renderTimers = ref({})  // 渲染定时器
const retryCounts = ref({})  // 记录每个视频的重试次数
const maxRetries = 3         // 最大重试次数
const retryInterval = 3000   // 重试间隔（毫秒）
const connectionStatus = ref({})  // 记录每个视频的连接状态
const streamStatus = ref({})      // 记录每个视频的流状态

// 视频帧处理相关
const frameCounts = ref({})       // 记录每个视频的帧数
const lastFrameTime = ref({})     // 记录每个视频的最后一帧时间
const frameRate = ref({})         // 记录每个视频的帧率
const frameInterval = 1000        // 帧率计算间隔（毫秒）

const videoFrames = ref([])
const currentPage = ref(0)
const framesPerPage = 4
const videoCarouselTimer = ref(null)
const videoCarouselConfig = ref({
  enabled: false,
  duration: 13
})

// 计算当前页的视频帧
const currentPageFrames = computed(() => {
  const start = currentPage.value * framesPerPage
  const end = start + framesPerPage
  return videoFrames.value.slice(start, end)
})

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(videoFrames.value.length / framesPerPage)
})

// 翻页方法
const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--
    // 如果视频轮播开启，重置定时器
    if (videoCarouselConfig.value.enabled) {
      startVideoCarousel()
    }
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
    // 如果视频轮播开启，重置定时器
    if (videoCarouselConfig.value.enabled) {
      startVideoCarousel()
    }
  }
}

// 初始化视频状态
const initVideoStatus = (index) => {
  retryCounts.value[index] = 0
  connectionStatus.value[index] = 'disconnected'
  streamStatus.value[index] = 'stopped'
  frameCounts.value[index] = 0
  lastFrameTime.value[index] = Date.now()
  frameRate.value[index] = 0
}

// 更新帧率
const updateFrameRate = (index) => {
  const now = Date.now()
  const timeDiff = now - lastFrameTime.value[index]
  if (timeDiff >= frameInterval) {
    frameRate.value[index] = Math.round((frameCounts.value[index] * 1000) / timeDiff)
    frameCounts.value[index] = 0
    lastFrameTime.value[index] = now
  }
}

// 检查视频流状态
const checkStreamStatus = (index) => {
  const now = Date.now()
  const timeSinceLastFrame = now - lastFrameTime.value[index]
  
  if (timeSinceLastFrame > 5000) {  // 5秒没有新帧
    if (streamStatus.value[index] !== 'stalled') {
      streamStatus.value[index] = 'stalled'
      console.warn(`视频 ${index} 流停滞，最后帧时间: ${new Date(lastFrameTime.value[index]).toLocaleTimeString()}`)
    }
  } else {
    if (streamStatus.value[index] !== 'active') {
      streamStatus.value[index] = 'active'
      console.log(`视频 ${index} 流恢复，当前帧率: ${frameRate.value[index]}fps`)
    }
  }
}

// 获取轮播配置
const fetchCarouselConfig = async () => {
  try {
    const response = await api.get('/web-configs')
    if (response.items && response.items.length > 0) {
      const config = response.items[0]
      videoCarouselConfig.value = {
        enabled: config.video_carousel || false,
        duration: config.video_carousel_duration || 13
      }
      console.log('视频轮播配置:', videoCarouselConfig.value)
      
      // 如果视频数量超过4个且轮播开启，则开始轮播
      if (videoFrames.value.length > framesPerPage && videoCarouselConfig.value.enabled) {
        startVideoCarousel()
      }
    }
  } catch (error) {
    console.error('获取轮播配置失败:', error)
  }
}

// 开始视频轮播
const startVideoCarousel = () => {
  stopVideoCarousel() // 先清除之前的定时器
  videoCarouselTimer.value = setInterval(() => {
    if (currentPage.value < totalPages.value - 1) {
      currentPage.value++
    } else {
      currentPage.value = 0
    }
  }, videoCarouselConfig.value.duration * 1000)
}

// 停止视频轮播
const stopVideoCarousel = () => {
  if (videoCarouselTimer.value) {
    clearInterval(videoCarouselTimer.value)
    videoCarouselTimer.value = null
  }
}

// 修改 fetchVideoUrls 方法
const fetchVideoUrls = async () => {
  try {
    const response = await api.get('/videos/carousel')
    console.log('获取到的视频数据:', response.items)
    
    videoFrames.value = response.items.map(video => {
      console.log('处理视频:', video)
      let videoUrl = video.url
      if (video.type === 'LOCAL') {
        if (videoUrl && !videoUrl.startsWith('http')) {
          videoUrl = `${import.meta.env.VITE_API_BASE_URL}${videoUrl}`
        }
      }
      return {
        title: video.name,
        subtitle: video.description,
        url: videoUrl,
        isRtsp: video.type === 'RTSP',
        isPlaying: false,
        showControls: true,
        autoplay: true,
        muted: true
      }
    })

    // 重置页码
    currentPage.value = 0

    // 初始化当前页的视频播放器
    nextTick(() => {
      currentPageFrames.value.forEach((frame, index) => {
        console.log(`初始化视频 ${index}:`, frame)
        initVideoStatus(index)
        if (frame.isRtsp) {
          startVideo(index)
        }
      })
    })

    // 获取轮播配置
    await fetchCarouselConfig()
  } catch (error) {
    console.error('获取视频地址失败:', error)
  }
}

const startVideo = (index) => {
  const frame = videoFrames.value[index]
  console.log(`开始播放视频 ${index}:`, frame)
  
  if (frame.isRtsp) {
    // 如果已经有连接，先关闭
    if (wsConnections.value[index]) {
      wsConnections.value[index].close()
      wsConnections.value[index] = null
    }
    
    // 如果有渲染定时器，先停止
    if (renderTimers.value[index]) {
      clearInterval(renderTimers.value[index])
      renderTimers.value[index] = null
    }
    
    // 初始化帧缓冲区
    frameBuffers.value[index] = []
    
    // 检查Canvas元素是否存在
    console.log(`检查Canvas元素 ${index} 是否存在:`, canvasRefs.value[index] ? '存在' : '不存在')
    
    // 确保在建立WebSocket之前Canvas已准备好
    nextTick(() => {
      if (!canvasRefs.value[index]) {
        console.error(`Canvas元素 ${index} 不存在，等待DOM更新后重试`)
        // 如果Canvas元素不存在，等待DOM更新后重试
        setTimeout(() => {
          if (videoFrames.value[index]) {
            startVideo(index)
          }
        }, 500)
        return
      }
      
      console.log(`Canvas元素 ${index} 尺寸:`, canvasRefs.value[index].width, 'x', canvasRefs.value[index].height)
      
      // 创建新的WebSocket连接
      const encodedUrl = encodeURIComponent(frame.url)
      console.log('WebSocket URL:', `ws://localhost:8765/${encodedUrl}`)
      
      const ws = new WebSocket(`ws://localhost:8765/${encodedUrl}`)
      
      // 开始渲染循环，从缓冲区获取帧进行渲染
      const startRendering = () => {
        // 如果已有渲染定时器，先清除
        if (renderTimers.value[index]) {
          clearInterval(renderTimers.value[index])
        }
        
        // 设置渲染定时器
        renderTimers.value[index] = setInterval(() => {
          // 检查缓冲区是否有帧
          if (frameBuffers.value[index] && frameBuffers.value[index].length > 0 && canvasRefs.value[index]) {
            try {
              // 取出最早的一帧
              const frameData = frameBuffers.value[index].shift()
              
              // 渲染到canvas
              const canvas = canvasRefs.value[index]
              const ctx = canvas.getContext('2d')
              
              // 对于MJPEG格式，直接绘制图像
              if (frameData.image) {
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                ctx.drawImage(frameData.image, 0, 0)
              } 
              // 兼容之前的ImageData格式
              else if (frameData.imageData) {
                ctx.putImageData(frameData.imageData, 0, 0)
              }
              
              // 更新播放状态
              videoFrames.value[index].isPlaying = true
              
              // 显示缓冲状态
              if (Math.random() < 0.05) { // 偶尔记录
                console.log(`视频 ${index} 当前缓冲: ${frameBuffers.value[index].length}/${bufferSize} 帧`)
              }
            } catch (error) {
              if (Math.random() < 0.01) { // 避免频繁报错
                console.error('渲染帧失败:', error)
              }
            }
          }
        }, renderInterval)
      }
      
      ws.onopen = () => {
        console.log('WebSocket连接已建立')
        // 发送初始化消息
        const initMessage = {
          type: 'init',
          url: frame.url
        }
        console.log('发送初始化消息:', initMessage)
        ws.send(JSON.stringify(initMessage))
        
        // 开始渲染
        startRendering()
      }
      
      ws.onmessage = (event) => {
        // 减少日志输出频率
        if (Math.random() < 0.001) { // 只记录约0.1%的消息
          console.log('收到WebSocket消息，数据类型:', typeof event.data, '大小:', event.data.size || event.data.byteLength)
        }
        
        // 检查Canvas是否存在，不存在则静默忽略
        if (!canvasRefs.value[index]) {
          return
        }
        
        try {
          const canvas = canvasRefs.value[index]
          const frame = event.data
          
          if (frame instanceof Blob) {
            // 处理MJPEG格式（每帧是一个JPEG图像）
            const url = URL.createObjectURL(frame)
            const img = new Image()
            
            img.onload = () => {
              try {
                // 确保canvas尺寸与图像匹配
                if (canvas.width !== img.width || canvas.height !== img.height) {
                  console.log(`调整canvas尺寸为 ${img.width}x${img.height}`)
                  canvas.width = img.width
                  canvas.height = img.height
                }
                
                // 绘制图像到canvas
                const ctx = canvas.getContext('2d')
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                ctx.drawImage(img, 0, 0)
                
                // 释放Blob URL
                URL.revokeObjectURL(url)
                
                // 将帧数据对象添加到缓冲区
                const frameData = {
                  image: img,
                  timestamp: Date.now()
                }
                
                // 将帧添加到缓冲区
                if (frameBuffers.value[index]) {
                  // 如果缓冲区已达最大大小，移除最老的帧
                  if (frameBuffers.value[index].length >= bufferSize) {
                    frameBuffers.value[index].shift()
                  }
                  
                  // 添加新帧
                  frameBuffers.value[index].push(frameData)
                }
                
                videoFrames.value[index].isPlaying = true
              } catch (error) {
                // 避免频繁报错
                if (Math.random() < 0.01) {
                  console.error('处理MJPEG帧失败:', error)
                }
              }
            }
            
            img.onerror = (error) => {
              if (Math.random() < 0.01) {
                console.error('加载JPEG图像失败:', error)
              }
            }
            
            // 开始加载图像
            img.src = url
          }
        } catch (error) {
          // 避免频繁报错
          if (Math.random() < 0.01) {
            console.error('视频帧处理失败:', error)
          }
        }
      }
      
      ws.onerror = (error) => {
        console.error('WebSocket错误:', error)
      }
      
      ws.onclose = (event) => {
        console.log('WebSocket连接已关闭', event.code, event.reason)
        if (videoFrames.value[index]) {
          videoFrames.value[index].isPlaying = false
        }
        
        // 清理渲染定时器
        if (renderTimers.value[index]) {
          clearInterval(renderTimers.value[index])
          renderTimers.value[index] = null
        }
        
        // 清理缓冲区
        if (frameBuffers.value[index]) {
          frameBuffers.value[index] = []
        }
        
        // 清理连接
        if (wsConnections.value[index] === ws) {
          wsConnections.value[index] = null
        }
        
        // 如果连接意外关闭，尝试重新连接
        if (event.code !== 1000) {
          console.log('连接意外关闭，尝试重新连接...')
          setTimeout(() => {
            if (videoFrames.value && videoFrames.value[index]) {
              startVideo(index)
            }
          }, 3000)
        }
      }
      
      wsConnections.value[index] = ws
    })
  } else {
    // 播放本地视频
    const video = videoRefs.value[index]
    if (video) {
      console.log('开始播放本地视频')
      video.play().catch(error => {
        console.error('视频播放失败:', error)
      })
    } else {
      console.error('视频元素不存在')
    }
  }
}

// 定期检查所有视频流状态
const startStreamMonitoring = () => {
  setInterval(() => {
    videoFrames.value.forEach((frame, index) => {
      if (frame.isRtsp) {
        checkStreamStatus(index)
      }
    })
  }, 5000)  // 每5秒检查一次
}

const onVideoPlay = (index) => {
  videoFrames.value[index].isPlaying = true
}

const onVideoPause = (index) => {
  videoFrames.value[index].isPlaying = false
}

const onVideoError = (index) => {
  console.error(`视频 ${index + 1} 加载失败`)
  videoFrames.value[index].isPlaying = false
}

// 清理函数
const cleanup = () => {
  // 清理本地视频
  Object.values(videoRefs.value).forEach(video => {
    if (video) {
      video.pause()
      video.src = ''
    }
  })
  
  // 清理渲染定时器
  Object.values(renderTimers.value).forEach((timer, index) => {
    if (timer) {
      clearInterval(timer)
      renderTimers.value[index] = null
    }
  })
  
  // 清理缓冲区
  Object.keys(frameBuffers.value).forEach(key => {
    frameBuffers.value[key] = []
  })
  
  // 清理WebSocket连接
  Object.values(wsConnections.value).forEach(ws => {
    if (ws) {
      ws.close()
    }
  })
}

// 修改视频容器样式以确保正确显示
const videoContainerStyle = {
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 11, 48, 0.8)'
}

// 修改canvas样式
const canvasStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'contain'
}

onMounted(() => {
  // 清空引用
  videoRefs.value = {}
  canvasRefs.value = {}
  wsConnections.value = {}
  frameBuffers.value = {}
  renderTimers.value = {}
  
  // 初始化
  fetchVideoUrls()
  startStreamMonitoring()
})

onUnmounted(() => {
  stopVideoCarousel()
  cleanup()
})
</script>

<style scoped>
.page-content {
  height: 100%;
  padding: 10px 20px 40px;
  box-sizing: border-box;
  background-color: #0A184B;
  position: relative;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 12px;
  height: 100%;
  max-width: 2300px;
  margin: 0 auto;
}

.video-frame {
  position: relative;
  background: url('../assets/frame_2.png') no-repeat center center;
  background-size: 100% 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 480px;
}

.frame-title {
  font-size: 21px;
  color: #0EE4F9;
  font-weight: bold;
  margin: 20px 0 15px 30px;
  text-align: left;
  line-height: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 30px;
}

.agent-icon {
  width: 21px;
  height: 21px;
}

.video-container {
  position: relative;
  flex: 1;
  background-color: rgba(0, 11, 48, 0.5);
  border-radius: 4px;
  overflow: hidden;
  margin: 0 30px 30px;
  min-height: 380px;
}

.video-player {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: rgba(0, 11, 48, 0.8);
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.play-button {
  background-color: rgba(102, 255, 255, 0.2);
  border: 1px solid #66FFFF;
  color: #66FFFF;
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.play-button:hover {
  background-color: rgba(102, 255, 255, 0.3);
}

.active .video-overlay {
  display: none;
}

.page-controls {
  position: absolute;
  top: 46%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 5px;
  pointer-events: none;
  /* transform: translateY(-50%); */
  z-index: 10;
}

.page-arrow {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: auto;
}

.page-arrow.disabled {
  cursor: not-allowed;
}

.page-arrow img {
  width: 24px;
  height: 24px;
}
</style> 