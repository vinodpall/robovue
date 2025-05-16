<template>
  <div class="page-content">
    <div class="video-grid">
      <div v-for="(frame, index) in currentPageFrames" 
           :key="frame.en_name" 
           class="video-frame"
           :class="{ 'active': frame.isPlaying }">
        <div class="frame-title">
          <img src="../assets/agent.svg" class="agent-icon" alt="agent icon">
          {{ frame.title }}
        </div>
        <div class="video-container" @mouseenter="showControls[frame.en_name] = true" @mouseleave="showControls[frame.en_name] = false">
          <!-- WebRTC视频流播放 -->
          <video
            v-if="frame.isRtsp"
            :ref="el => handleVideoRef(el, frame.en_name)"
            :id="'video-' + frame.en_name"
            class="video-player"
            autoplay
            playsinline
            muted
            controlsList="nofullscreen"
            @play="onVideoPlay(frame.en_name)"
            @pause="onVideoPause(frame.en_name)"
            @error="onVideoError(frame.en_name)"
            @loadedmetadata="() => console.log(`视频 ${frame.en_name} 元数据已加载`)"
            @loadeddata="() => console.log(`视频 ${frame.en_name} 数据已加载`)"
            @canplay="() => console.log(`视频 ${frame.en_name} 可以播放`)"
            @waiting="() => console.log(`视频 ${frame.en_name} 等待数据`)"
            @stalled="() => console.log(`视频 ${frame.en_name} 数据停滞`)"
          ></video>
          
          <!-- 本地视频播放 -->
          <video
            v-else
            :ref="el => { if (el) videoRefs[frame.en_name] = el }"
            :id="'video-' + frame.en_name"
            class="video-player"
            :src="frame.url"
            :controls="frame.showControls"
            :autoplay="frame.autoplay"
            :muted="frame.muted"
            controlsList="nofullscreen"
            loop
            @play="onVideoPlay(frame.en_name)"
            @pause="onVideoPause(frame.en_name)"
            @error="onVideoError(frame.en_name)"
          ></video>
          
          <div v-if="frame.isRtsp && !frame.isPlaying" class="video-overlay">
            <button class="play-button" 
                    @click="handlePlayClick(frame.en_name)" 
                    :disabled="isConnected[frame.en_name] || isLoading[frame.en_name]">
              {{ isLoading[frame.en_name] ? '连接中...' : '播放' }}
            </button>
          </div>
          
          <!-- 视频控制按钮 -->
          <div v-if="frame.isRtsp && showControls[frame.en_name]" class="video-controls">
            <div class="control-buttons">
              <div class="left-controls">
                <button v-if="frame.isPlaying" class="control-button" @click="handleStopClick(frame.en_name)">
                  <i class="fas fa-pause"></i>
                </button>
                <button v-else class="control-button" @click="handlePlayClick(frame.en_name)" :disabled="isConnected[frame.en_name] || isLoading[frame.en_name]">
                  <i class="fas fa-play"></i>
                </button>
              </div>
              <div class="right-controls">
                <button class="control-button maximize" @click="handleMaximize(frame.en_name)">
                  <i class="fas fa-expand"></i>
                </button>
              </div>
            </div>
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

const videoRefs = ref({})
const canvasRefs = ref({})
const wsConnections = ref({})
const frameBuffers = ref({})  // 视频帧缓冲区
const bufferSize = 5  // 缓冲区大小，可根据需要调整
const renderInterval = 33  // 约30fps的渲染间隔（33ms）
const renderTimers = ref({})  // 渲染定时器
const retryCounts = ref({})  // 记录每个视频的重试次数
const maxRetries = 3         // 最大重试次数
const retryInterval = 3000   // 重试间隔（毫秒）
const retryTimers = ref({}) // 重试定时器
const connectionStates = ref({})
const isConnected = ref({})
const isLoading = ref({})

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

// 添加控制按钮显示状态
const showControls = ref({})

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

// 修改翻页方法
const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--
    // 初始化新页面的视频
    nextTick(() => {
      initCurrentPage()
    })
    // 如果视频轮播开启，重置定时器
    if (videoCarouselConfig.value.enabled) {
      startVideoCarousel()
    }
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
    // 初始化新页面的视频
    nextTick(() => {
      initCurrentPage()
    })
    // 如果视频轮播开启，重置定时器
    if (videoCarouselConfig.value.enabled) {
      startVideoCarousel()
    }
  }
}

// 修改初始化当前页面的方法
const initCurrentPage = () => {
  currentPageFrames.value.forEach(frame => {
    console.log(`初始化视频 ${frame.en_name}:`, frame)
    // 只初始化未连接的视频
    if (!isConnected.value[frame.en_name]) {
      initVideoStatus(frame.en_name)
      // 如果是RTSP视频且未连接，自动开始播放
      if (frame.isRtsp) {
        startVideo(frame.en_name)
      }
    }
  })
}

// 初始化视频状态
const initVideoStatus = (en_name) => {
  connectionStates.value[en_name] = '未连接'
  isConnected.value[en_name] = false
  isLoading.value[en_name] = false
  showControls.value[en_name] = false
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
        en_name: video.en_name,
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
      initCurrentPage()
    })

    // 获取轮播配置
    await fetchCarouselConfig()
  } catch (error) {
    console.error('获取视频地址失败:', error)
  }
}

// 添加新的处理方法
const handlePlayClick = (en_name) => {
  console.log(`点击播放按钮 ${en_name}`)
  startVideo(en_name)
}

const handleStopClick = (en_name) => {
  console.log(`点击停止按钮 ${en_name}`)
  stopVideo(en_name)
}

// 添加视频引用处理方法
const handleVideoRef = (el, en_name) => {
  if (el) {
    console.log(`视频元素 ${en_name} 已挂载:`, el)
    videoRefs.value[en_name] = el
    
    // 如果视频已经连接，恢复视频流
    if (wsConnections.value[en_name] && wsConnections.value[en_name].connectionState === 'connected') {
      const stream = wsConnections.value[en_name].getRemoteStreams()[0]
      if (stream) {
        console.log(`恢复视频 ${en_name} 的流`)
        el.srcObject = stream
      }
    }
  }
}

// 修改 startVideo 方法
const startVideo = async (en_name) => {
  const frame = videoFrames.value.find(f => f.en_name === en_name)
  if (!frame) return

  console.log(`开始播放视频 ${en_name}:`, frame)
  
  if (frame.isRtsp) {
    if (isConnected.value[en_name] || isLoading.value[en_name]) {
      console.log(`视频 ${en_name} 已连接或正在加载中，跳过`)
      return
    }

    isLoading.value[en_name] = true
    connectionStates.value[en_name] = '准备连接...'
    console.log(`开始连接 ${frame.title}...`)

    try {
      const video = videoRefs.value[en_name]
      if (!video) {
        throw new Error('视频元素不存在')
      }

      // 创建 RTCPeerConnection
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' }
        ]
      })
      console.log('RTCPeerConnection 已创建')

      // 处理ICE候选
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log(`[${frame.title}] 生成ICE Candidate:`, event.candidate.candidate.substring(0, 50) + '...')
        } else {
          console.log(`[${frame.title}] 所有ICE Candidate已发送完毕`)
        }
      }

      // 处理远程流
      pc.ontrack = (event) => {
        console.log(`[${frame.title}] 接收到远程轨道:`, {
          kind: event.track.kind,
          id: event.track.id,
          readyState: event.track.readyState,
          muted: event.track.muted,
          enabled: event.track.enabled
        })
        if (video && event.streams && event.streams[0]) {
          console.log('设置视频源:', {
            streamId: event.streams[0].id,
            tracks: event.streams[0].getTracks().map(t => ({
              kind: t.kind,
              id: t.id,
              readyState: t.readyState
            }))
          })
          video.srcObject = event.streams[0]
          connectionStates.value[en_name] = '视频流已附加'
          frame.isPlaying = true
          // 连接成功后重置重试计数
          retryCounts.value[en_name] = 0
          if (retryTimers.value[en_name]) {
            clearTimeout(retryTimers.value[en_name])
            retryTimers.value[en_name] = null
          }
        }
      }

      // 处理连接状态变化
      pc.onconnectionstatechange = () => {
        if (pc) {
          connectionStates.value[en_name] = pc.connectionState
          console.log(`[${frame.title}] WebRTC 连接状态改变:`, {
            connectionState: pc.connectionState,
            iceConnectionState: pc.iceConnectionState,
            iceGatheringState: pc.iceGatheringState,
            signalingState: pc.signalingState
          })
          if (pc.connectionState === 'connected') {
            isConnected.value[en_name] = true
            isLoading.value[en_name] = false
          } else if (['disconnected', 'failed', 'closed'].includes(pc.connectionState)) {
            isConnected.value[en_name] = false
            isLoading.value[en_name] = false
            frame.isPlaying = false
            cleanupRTC(en_name)
            // 触发重连
            scheduleRetry(en_name)
          }
        }
      }

      // 添加视频接收器
      pc.addTransceiver('video', { direction: 'recvonly' })
      // 如果需要音频
      pc.addTransceiver('audio', { direction: 'recvonly' })
      console.log('已添加视频和音频接收器')

      // 创建并设置本地offer
      const offer = await pc.createOffer()
      console.log('创建的Offer:', {
        type: offer.type,
        sdp: offer.sdp.substring(0, 100) + '...' // 只打印前100个字符
      })
      await pc.setLocalDescription(offer)
      console.log(`[${frame.title}] 本地Offer已创建并设置`)

      // 使用 en_name 作为 streamName
      const streamName = frame.en_name
      const whepUrl = `http://localhost:8889/${streamName}/whep`
      console.log(`[${frame.title}] 发送Offer到WHEP端点: ${whepUrl}`)

      // 发送offer到WHEP端点
      const response = await fetch(whepUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/sdp',
          'Accept': 'application/sdp',
          'Authorization': 'Basic ' + btoa('apiadmin:apipassword123')
        },
        body: offer.sdp,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('WHEP请求失败:', {
          status: response.status,
          statusText: response.statusText,
          errorText
        })
        throw new Error(`WHEP请求失败 (${response.status} ${response.statusText}): ${errorText}`)
      }

      const answerSdp = await response.text()
      if (!answerSdp) {
        throw new Error('从WHEP端点获取的Answer SDP为空')
      }
      console.log('收到的Answer:', {
        sdp: answerSdp.substring(0, 100) + '...' // 只打印前100个字符
      })

      await pc.setRemoteDescription(
        new RTCSessionDescription({ type: 'answer', sdp: answerSdp })
      )
      console.log(`[${frame.title}] 远程Answer已设置`)

      // 保存RTCPeerConnection实例
      wsConnections.value[en_name] = pc

    } catch (error) {
      console.error(`[${frame.title}] 启动视频流失败:`, error)
      console.error('错误详情:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
      connectionStates.value[en_name] = `错误: ${error.message.substring(0,100)}...`
      frame.isPlaying = false
      isLoading.value[en_name] = false
      cleanupRTC(en_name)
      // 触发重连
      scheduleRetry(en_name)
    }
  } else {
    // 播放本地视频
    const video = videoRefs.value[en_name]
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

// 停止视频流
const stopVideo = (en_name) => {
  console.log(`停止视频流 ${en_name}`)
  cleanupRTC(en_name)
  connectionStates.value[en_name] = '已断开'
}

// 修改 cleanupRTC 方法
const cleanupRTC = (en_name) => {
  console.log(`开始清理视频 ${en_name} 的WebRTC连接`)
  const pc = wsConnections.value[en_name]
  if (pc) {
    console.log('清理RTCPeerConnection:', {
      connectionState: pc.connectionState,
      iceConnectionState: pc.iceConnectionState,
      signalingState: pc.signalingState
    })
    
    // 保存流信息
    const stream = pc.getRemoteStreams()[0]
    
    pc.getSenders().forEach(sender => {
      if (sender.track) {
        console.log('停止发送器轨道:', {
          kind: sender.track.kind,
          id: sender.track.id
        })
        sender.track.stop()
      }
    })
    
    pc.getReceivers().forEach(receiver => {
      if (receiver.track) {
        console.log('停止接收器轨道:', {
          kind: receiver.track.kind,
          id: receiver.track.id
        })
        receiver.track.stop()
      }
    })
    
    pc.onicecandidate = null
    pc.ontrack = null
    pc.onconnectionstatechange = null
    pc.close()
    wsConnections.value[en_name] = null
    console.log(`RTCPeerConnection已清理`)
  }
  
  if (videoRefs.value[en_name]) {
    console.log('清理视频元素')
    videoRefs.value[en_name].srcObject = null
  }
  
  const frame = videoFrames.value.find(f => f.en_name === en_name)
  if (frame) {
    frame.isPlaying = false
  }
  isConnected.value[en_name] = false
  isLoading.value[en_name] = false
  console.log(`视频 ${en_name} 清理完成`)
}

const onVideoPlay = (en_name) => {
  console.log(`视频 ${en_name} 开始播放`)
  const frame = videoFrames.value.find(f => f.en_name === en_name)
  if (frame) {
    frame.isPlaying = true
  }
}

const onVideoPause = (en_name) => {
  console.log(`视频 ${en_name} 暂停播放`)
  const frame = videoFrames.value.find(f => f.en_name === en_name)
  if (frame) {
    frame.isPlaying = false
  }
}

const onVideoError = (en_name) => {
  const video = videoRefs.value[en_name]
  console.error(`视频 ${en_name} 加载失败`, {
    error: video?.error,
    readyState: video?.readyState,
    networkState: video?.networkState,
    srcObject: video?.srcObject,
    connectionState: connectionStates.value[en_name]
  })
  const frame = videoFrames.value.find(f => f.en_name === en_name)
  if (frame) {
    frame.isPlaying = false
  }
}

// 清理函数
const cleanup = () => {
  // 清理本地视频
  Object.values(videoRefs.value).forEach(video => {
    if (video) {
      video.pause()
      video.src = ''
      video.srcObject = null
    }
  })
  
  // 清理WebRTC连接
  Object.values(wsConnections.value).forEach(pc => {
    if (pc) {
      pc.close()
    }
  })
  
  // 清理其他资源
  Object.keys(frameBuffers.value).forEach(key => {
    frameBuffers.value[key] = []
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

// 添加最大化处理方法
const handleMaximize = (en_name) => {
  const video = videoRefs.value[en_name]
  if (video) {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      video.requestFullscreen()
    }
  }
}

// 添加重连调度函数
const scheduleRetry = (en_name) => {
  if (retryTimers.value[en_name]) {
    clearTimeout(retryTimers.value[en_name])
  }

  retryCounts.value[en_name] = (retryCounts.value[en_name] || 0) + 1
  console.log(`视频 ${en_name} 第 ${retryCounts.value[en_name]} 次重试`)

  retryTimers.value[en_name] = setTimeout(() => {
    console.log(`开始重试视频 ${en_name}`)
    startVideo(en_name)
  }, retryInterval)
}

onMounted(() => {
  // 清空引用
  videoRefs.value = {}
  canvasRefs.value = {}
  wsConnections.value = {}
  frameBuffers.value = {}
  renderTimers.value = {}
  retryTimers.value = {}
  retryCounts.value = {}
  
  // 初始化
  fetchVideoUrls()
})

onUnmounted(() => {
  stopVideoCarousel()
  // 清理所有WebRTC连接
  Object.keys(wsConnections.value).forEach(en_name => {
    cleanupRTC(en_name)
    // 清理重试定时器
    if (retryTimers.value[en_name]) {
      clearTimeout(retryTimers.value[en_name])
      retryTimers.value[en_name] = null
    }
  })
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

.video-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.video-container:hover .video-controls {
  opacity: 1;
}

.control-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
}

.left-controls, .right-controls {
  display: flex;
  gap: 12px;
}

.control-button {
  background-color: rgba(14, 228, 249, 0.15);
  border: 1px solid rgba(14, 228, 249, 0.5);
  color: #0EE4F9;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 8px rgba(14, 228, 249, 0.2);
}

.control-button:hover {
  background-color: rgba(14, 228, 249, 0.25);
  border-color: rgba(14, 228, 249, 0.8);
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(14, 228, 249, 0.3);
}

.control-button:active {
  transform: scale(0.95);
}

.control-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.control-button i {
  font-size: 16px;
}

.control-button.maximize {
  background-color: rgba(14, 228, 249, 0.1);
}

.control-button.maximize:hover {
  background-color: rgba(14, 228, 249, 0.2);
}
</style> 