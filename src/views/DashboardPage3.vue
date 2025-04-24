<template>
  <div class="page-content">
    <div class="video-grid">
      <div v-for="(frame, index) in videoFrames" 
           :key="index" 
           class="video-frame"
           :class="{ 'active': frame.isPlaying }">
        <div class="frame-title">
          <img src="../assets/agent.svg" class="agent-icon" alt="agent icon">
          {{ frame.title }}
        </div>
        <div class="video-container">
          <video
            ref="videoRefs"
            :id="'video-' + index"
            class="video-player"
            :src="frame.url"
            :controls="frame.showControls"
            :autoplay="frame.autoplay"
            :muted="frame.muted"
            @play="onVideoPlay(index)"
            @pause="onVideoPause(index)"
            @error="onVideoError(index)"
          ></video>
          <div v-if="!frame.isPlaying" class="video-overlay">
            <button class="play-button" @click="startVideo(index)">播放</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import frame2Bg from '../assets/frame_2.png'

const videoRefs = ref([])
const videoFrames = ref([
  {
    title: '除草机器人',
    url: '',
    isPlaying: false,
    showControls: true,
    autoplay: false,
    muted: true
  },
  {
    title: '管道机器人',
    url: '',
    isPlaying: false,
    showControls: true,
    autoplay: false,
    muted: true
  },
  {
    title: '机器狗',
    url: '',
    isPlaying: false,
    showControls: true,
    autoplay: false,
    muted: true
  },
  {
    title: '运输机器人',
    url: '',
    isPlaying: false,
    showControls: true,
    autoplay: false,
    muted: true
  }
])

const startVideo = (index) => {
  const video = videoRefs.value[index]
  if (video) {
    video.play().catch(error => {
      console.error('视频播放失败:', error)
    })
  }
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
  videoRefs.value.forEach(video => {
    if (video) {
      video.pause()
      video.src = ''
    }
  })
}

onMounted(() => {
  // 在这里可以初始化视频源
  // 例如：videoFrames.value[0].url = 'rtsp://example.com/stream1'
})

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
.page-content {
  height: 100%;
  padding: 10px 20px 40px;
  box-sizing: border-box;
  background-color: #0A184B;
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
</style> 