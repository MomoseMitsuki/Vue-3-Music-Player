<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAudioStore } from '@/stores/audio'
import { useSongStore } from '@/stores/song'
import { formatTime } from '@/utils/format'

const showVolume = ref<boolean>(false)
const audioRef = ref<HTMLAudioElement>()
const songStore = useSongStore()
const audioStore = useAudioStore()
const route = useRoute()
const router = useRouter()
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowLeft') {
    audioStore.seekTime(-3)
  } else if (e.key === 'ArrowRight') {
    audioStore.seekTime(3)
  } else if (e.key === ' ') {
    e.preventDefault()
    playMusic()
  }
}
const handleScrollClick = (e: MouseEvent) => {
  const scrollbar = e.currentTarget as HTMLElement
  const rect = scrollbar.getBoundingClientRect()
  const offsetX = e.clientX - rect.left
  const percentage = offsetX / rect.width
  if (audioStore.audioElement) {
    audioStore.audioElement.currentTime = percentage * audioStore.duration
  }
}
const handleVolumnClick = (e: MouseEvent) => {
  const scrollbar = e.currentTarget as HTMLElement
  const rect = scrollbar.getBoundingClientRect()
  const offsetY = rect.bottom - e.clientY
  const percentage = offsetY / rect.height
  if (audioStore.audioElement) {
    audioStore.setVolume(percentage)
  }
}

const cvsRef = ref<HTMLCanvasElement>()
let audioCtx: AudioContext
let analyser: AnalyserNode
let dataArray: Uint8Array
let canvasCtx: CanvasRenderingContext2D
let isInitialized = false
onMounted(() => {
  initAudioVisualizer()
  window.addEventListener('keydown', handleKeydown)
})
const playMusic = async () => {
  if (!isInitialized) {
    initAudioVisualizer()
  }
  if (audioRef.value) {
    audioStore.setAudioElement(audioRef.value)
  }
  if (!audioStore.isPlaying) {
    await audioCtx.resume()
  }
  audioStore.togglePlay()
}
const initAudioVisualizer = () => {
  if (!audioRef.value || !cvsRef.value || isInitialized || route.path === '/video') return
  audioCtx = new AudioContext()
  analyser = audioCtx.createAnalyser()
  analyser.fftSize = 4096
  const source = audioCtx.createMediaElementSource(audioRef.value)
  source.connect(analyser)
  analyser.connect(audioCtx.destination)
  canvasCtx = cvsRef.value.getContext('2d')!
  cvsRef.value.width = window.innerWidth * 0.95
  cvsRef.value.height = 30
  const bufferLength = analyser.frequencyBinCount
  dataArray = new Uint8Array(bufferLength)
  const draw = () => {
    requestAnimationFrame(draw)
    analyser.getByteFrequencyData(dataArray)
    canvasCtx.clearRect(0, 0, cvsRef.value!.width, cvsRef.value!.height)
    const barWidth = cvsRef.value!.width / bufferLength
    let x = 0
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * cvsRef.value!.height
      canvasCtx.fillStyle = '#d1d1d1'
      canvasCtx.fillRect(x, cvsRef.value!.height - barHeight, barWidth, barHeight)
      x += barWidth
    }
  }
  draw()
  isInitialized = true
}
watch(
  () => audioStore.currentSong,
  () => {
    playMusic()
  },
)

const getVolumePng = () => {
  const volume = audioStore.getVolume()
  if (volume === 0) {
    return '/public/icons/volumeClose.png'
  } else if (volume > 0 && volume <= 0.33) {
    return '/public/icons/volumeLow.png'
  } else if (volume > 0.33 && volume <= 0.66) {
    return '/public/icons/volumeMiddle.png'
  } else {
    return '/public/icons/volumeHigh.png'
  }
}
const handleVolume = (event: KeyboardEvent) => {
  if (event.key === 'ArrowUp') {
    // 音量增加
    audioStore.setVolume(Math.min(audioStore.getVolume() + 0.05, 1))
  } else if (event.key === 'ArrowDown') {
    // 音量减少
    audioStore.setVolume(Math.max(audioStore.getVolume() - 0.05, 0))
  }
}
const setVolume = () => {
  showVolume.value = !showVolume.value
  if (showVolume.value) {
    window.addEventListener('keydown', handleVolume)
  } else {
    window.removeEventListener('keydown', handleVolume)
  }
}
const jmpLyric = () => {
  if (route.path === '/lyric') {
    router.go(-1)
  } else {
    router.push('/lyric')
  }
}
</script>

<template>
  <div class="audioPlayer">
    <div class="canvas">
      <canvas ref="cvsRef"></canvas>
    </div>
    <audio :src="audioStore.currentSong.path" ref="audioRef"></audio>
    <img src="/public/icons/defaultAudio.png" />
    <div class="info">
      <div class="name">{{ audioStore.currentSong.name }}</div>
      <div class="singer">{{ audioStore.currentSong.singers }}</div>
    </div>
    <div class="control">
      <img src="/public/icons/lastAudio.png" @click="audioStore.prevSong" />
      <img
        :src="audioStore.isPlaying ? '/icons/pause.png' : '/icons/play.png'"
        @click="playMusic"
      />
      <img src="/public/icons/nextAudio.png" @click="audioStore.nextSong" />
      <img
        :src="audioStore.currentSong.isLove ? '/public/icons/fullLove.png' : '/public/icons/love.png'"
        @click="songStore.changeLoveState(audioStore.currentSong.id)"
      />
    </div>
    <div class="scroll">
      <div class="scrollbar" @click="handleScrollClick">
        <div
          class="scrollthumb"
          :style="`width:${(audioStore.currentTime / audioStore.duration) * 100}%`"
        >
          <div class="btn"></div>
        </div>
      </div>
    </div>
    <div class="control2">
      <div style="margin-right: 15px">
        {{ formatTime(audioStore.currentTime) }} /
        {{ formatTime(audioStore.duration) }}
      </div>
      <img
        src="/public/icons/playMode1.png"
        @click="audioStore.setPlayMode(1)"
        :class="{ active: audioStore.playMode === 1 }"
      />
      <img
        src="/public/icons/playMode2.png"
        @click="audioStore.setPlayMode(2)"
        :class="{ active: audioStore.playMode === 2 }"
      />
      <img
        src="/public/icons/playMode3.png"
        @click="audioStore.setPlayMode(3)"
        :class="{ active: audioStore.playMode === 3 }"
      />
      <img
        src="/public/icons/playMode4.png"
        @click="audioStore.setPlayMode(4)"
        :class="{ active: audioStore.playMode === 4 }"
      />
      <div class="lyric" @click="jmpLyric" :class="{ active: route.path === '/lyric' }">词</div>
      <div class="volume">
        <img :src="getVolumePng()" @click="setVolume" />
        <div class="volumeControl" v-show="showVolume">
          <div class="volumeBar" @click="handleVolumnClick">
            <div class="volumethumb" :style="`height:${100 - audioStore.getVolume() * 100}%;`">
              <div class="btn"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.audioPlayer {
  display: flex;
  position: relative;
  width: 100%;
  height: 9vh;
  border-top: 1px solid #d1d1d1;
  .canvas {
    position: absolute;
    bottom: -3px;
    left: 50%;
    transform: translateX(-50%);
    background: transparent;
    z-index: 1;
    overflow: hidden;
    canvas {
      margin: 0 auto;
      width: 95vw;
      height: 35px;
    }
  }
  img {
    margin: 8px 10px;
    width: 3.5vw;
    height: 3.5vw;
  }
  .info {
    padding: 12px 8px;
    width: 10vw;
    height: 9vh;
    font-family: 'Calibri';
    .name {
      font-size: 1.3em;
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .singer {
      margin-top: 3px;
      color: grey;
      font-size: 0.9em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .control {
    display: flex;
    align-items: center;
    img {
      width: 2.5vw;
      height: 2.5vw;
      margin: 0 6px;
      cursor: pointer;
      transition: transform 0.3s;
      z-index: 2;
      &:hover {
        transform: scale(1.15);
      }
      &:nth-child(2) {
        width: 2.3vw;
        height: 2.3vw;
      }
      &:nth-child(4) {
        margin-left: 15px;
        width: 23px;
        height: 23px;
      }
    }
  }
  .scroll {
    display: flex;
    align-items: center;
    margin: 0 18px;
    width: 42vw;
    height: 100%;
    z-index: 2;
    .scrollbar {
      width: 100%;
      height: 10px;
      border-radius: 5px;
      background-color: #d1d1d1;
      cursor: pointer;
      .scrollthumb {
        display: flex;
        justify-content: flex-end;
        height: 10px;
        border-radius: 5px;
        background-color: #222;
        transition: all 0.3s ease;
        .btn {
          width: 10px;
          height: 10px;
          border: 1px solid #333;
          border-radius: 10px;
          background-color: white;
          transition: transform 0.3s;
          transform-origin: center center;
          transform: scale(1.2);
          &:hover {
            transform: scale(1.5);
          }
        }
      }
    }
  }
  .control2 {
    display: flex;
    align-items: center;
    font-size: 0.9em;
    color: #444;
    z-index: 2;
    transition: transform 0.3s;
    img {
      width: 24px;
      height: 24px;
      margin: 0 7px;
      cursor: pointer;
      &:hover {
        transform: scale(1.15);
      }
      &.active {
        transform: scale(1.25);
      }
    }
    .volume {
      position: relative;
      img {
        width: 24px;
        height: 24px;
        margin-top: 6px;
        &:hover {
          transform: scale(1.15);
        }
      }
      .volumeControl {
        position: absolute;
        border: 1px solid #999;
        top: -125px;
        left: 0;
        width: 30px;
        height: 120px;
        border-radius: 15px;
        background-color: white;
        .volumeBar {
          background-color: #222;
          margin: 10px auto;
          width: 10px;
          height: 100px;
          border-radius: 5px;
          cursor: pointer;
          .volumethumb {
            position: relative;
            background-color: #d1d1d1;
            width: 10px;
            border-radius: 5px;
            transition: all 0.3s ease;
            .btn {
              position: absolute;
              bottom: -7.5px;
              width: 10px;
              height: 10px;
              border: 1px solid #333;
              border-radius: 10px;
              background-color: white;
              transition: transform 0.3s;
              transform-origin: center center;
              transform: scale(1.2);
              margin-left: -1px;
              &:hover {
                transform: scale(1.5);
              }
            }
          }
        }
      }
    }
    .lyric {
      font-size: 1.2em;
      margin: 0 25px;
      cursor: pointer;
      transition: all 0.3s;
      &:hover {
        transform: scale(1.15);
      }
      &.active {
        transform: scale(1.15);
        color: rgb(13, 116, 156);
      }
    }
  }
}
</style>
