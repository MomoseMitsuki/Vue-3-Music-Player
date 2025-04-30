<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useAudioStore } from '@/stores/audio'
const audioStore = useAudioStore()
const videoSrc = ref('')
const videoRef = ref()
const handleVideo = () => {
  if (audioStore.isPlaying) {
    audioStore.audioElement?.pause()
    audioStore.isPlaying = false
  }
}
videoSrc.value = audioStore.currentVideo
audioStore.videoElement = videoRef.value
audioStore.isPlaying = false

watch(
  () => audioStore.isPlaying,
  (newState) => {
    if (newState) {
      videoRef.value.pause()
    }
  },
)
onMounted(() => {
  videoRef.value?.addEventListener('play', handleVideo)
})

onUnmounted(() => {
  videoRef.value?.removeEventListener('play', handleVideo)
})
</script>

<template>
  <div class="movie">
    <video :src="videoSrc" controls autoplay preload="auto" ref="videoRef"></video>
  </div>
</template>

<style scoped lang="scss">
.movie {
  width: 78vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: black;
  video {
    display: block;
    width: 77vw;
    aspect-ratio: 16/9;
    height: auto;
  }
}
</style>
