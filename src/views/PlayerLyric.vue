<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useAudioStore } from '@/stores/audio'
interface LrcData {
  time: number
  word: string
}
const audioStore = useAudioStore()
const offset = ref(0)
const containerRef = ref<HTMLElement>()
const ulRef = ref<HTMLElement>()
const lrc = ref(audioStore.songs[audioStore.currentIndex].lyric as string)
let lrcData = ref<LrcData[]>([])
function init() {
  if (lrc.value) {
    lrcData.value = parseLrc()
    onMounted(() => {
      containerHeight = (containerRef.value as HTMLElement).clientHeight
      liHeight = (ulRef.value as HTMLElement).children[0].clientHeight
      maxOffset = (ulRef.value as HTMLElement).clientHeight - containerHeight
      audioStore.audioElement?.addEventListener('timeupdate', () => {
        setOffset()
      })
      setOffset()
    })
  } else {
    lrcData.value = []
  }
}
init()
watch(
  () => audioStore.songs[audioStore.currentIndex].lyric,
  (newLyric) => {
    if (!newLyric) {
      newLyric = ''
    }
    lrc.value = newLyric
    init()
  },
)
function parseLrc() {
  const lines = lrc.value.split('\n')
  const result: LrcData[] = []
  for (let i = 0; i < lines.length; i++) {
    const str = lines[i]
    const parts = str.split(']')
    const timeStr = parts[0].substring(1)
    const obj = {
      time: parseTime(timeStr),
      word: parts[1],
    }
    result.push(obj)
  }
  return result
}
function parseTime(timeStr: string): number {
  const parts = timeStr.split(':')
  return +parts[0] * 60 + +parts[1]
}
function findIndex() {
  const curTime = audioStore.currentTime
  for (let i = 0; i < lrcData.value.length; i++) {
    if (curTime < lrcData.value[i].time) {
      return i - 1
    }
  }
  return lrcData.value.length - 1
}
let containerHeight: number
let liHeight: number
let maxOffset: number
function setOffset() {
  let index = findIndex()
  offset.value = liHeight * index + liHeight / 2 - containerHeight / 2
  if (offset.value < 0) {
    offset.value = 0
  }
  if (offset.value > maxOffset) {
    offset.value = maxOffset
  }
}
</script>

<template>
  <div class="lyricBox" v-if="lrc">
    <div class="container" ref="containerRef">
      <ul ref="ulRef" :style="`transform:translateY(-${offset}px)`">
        <li v-for="(item, i) in lrcData" ref="liRef" :class="{ active: i === findIndex() }">
          {{ item.word }}
        </li>
      </ul>
    </div>
  </div>
  <div class="noLyric" v-else>
    <div><img src="/public/pics/nolysic.jpg" /></div>
    <div>没有歌词哦</div>
  </div>
</template>

<style scoped lang="scss">
.lyricBox {
  width: 78vw;
  display: flex;
  align-items: center;
  cursor: default;
  .container {
    width: 100%;
    height: 600px;
    overflow: hidden;
    ul {
      transition: 0.2s;
      list-style: none;
      text-align: center;
    }
    li {
      height: 50px;
      line-height: 50px;
      font-size: 25px;
      font-weight: 700;
      transition: all 0.6s;
      color: grey;
      &.active {
        transform: scale(1.2);
        color: skyblue;
      }
    }
  }
}
.noLyric {
  width: 78vw;
  text-align: center;
  font-size: 30px;
  img {
    margin-top: 200px;
    width: 10vw;
  }
}
</style>
