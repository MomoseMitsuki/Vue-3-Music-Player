import { defineStore } from 'pinia'
import { useSongStore, type Song } from '@/stores/song'
import { ref } from 'vue'

export const useAudioStore = defineStore(
  'audio',
  () => {
    const songStore = useSongStore()
    const audioElement = ref<HTMLAudioElement>()
    const videoElement = ref<HTMLVideoElement>()
    const isPlaying = ref(false)
    const duration = ref(0)
    const currentTime = ref(0)
    const volume = ref(1)
    const playMode = ref(1)
    const songs = ref<Song[]>(songStore.SongDefaultList)
    const currentVideo = ref('')
    const currentIndex = ref(0)
    const handlePlayEnd = () => {
      if (!audioElement.value) return

      switch (playMode.value) {
        case 1:
          if (currentIndex.value === songs.value.length - 1) {
            audioElement.value.pause()
          } else {
            const nextSong = songs.value[currentIndex.value + 1]
            setCurrentSong(nextSong, currentIndex.value + 1)
          }
          break

        case 2:
          const randomIndex = Math.floor(Math.random() * songs.value.length)
          const randomSong = songs.value[randomIndex]
          setCurrentSong(randomSong, randomIndex)
          break

        case 3:
          const nextIndex = (currentIndex.value + 1) % songs.value.length
          const nextLoopSong = songs.value[nextIndex]
          setCurrentSong(nextLoopSong, nextIndex)
          break

        case 4:
          audioElement.value.currentTime = 0
          audioElement.value.play()
          break
      }
    }

    const _initEndedListener = () => {
      if (!audioElement.value) return
      audioElement.value.addEventListener('ended', handlePlayEnd)
    }

    const setPlayMode = (mode: 1 | 2 | 3 | 4) => {
      playMode.value = mode
    }
    const currentSong = ref<Song>(songStore.SongDefaultList[0])
    const setCurrentSong = (song: Song, index: number) => {
      currentSong.value = song
      currentIndex.value = index
      isPlaying.value = false
      currentTime.value = 0
      duration.value = 0
      if (audioElement.value) {
        audioElement.value.pause()
        audioElement.value.currentTime = 0
        audioElement.value.addEventListener('loadedmetadata', () => {
          duration.value = audioElement.value?.duration || 0
        })
        _initEndedListener()
      }
    }

    const _initTimeUpdate = () => {
      if (!audioElement.value) return
      audioElement.value.addEventListener('timeupdate', () => {
        currentTime.value = audioElement.value?.currentTime || 0
      })
    }

    const _initVolumeUpdate = () => {
      if (!audioElement.value) return
      audioElement.value.addEventListener('volumechange', () => {
        volume.value = audioElement.value?.volume || 1
      })
    }

    const setAudioElement = (el: HTMLAudioElement) => {
      audioElement.value = el
      _initTimeUpdate()
      _initVolumeUpdate()
      duration.value = audioElement.value.duration
    }

    const togglePlay = async () => {
      if (!audioElement.value) return

      if (isPlaying.value) {
        audioElement.value.pause()
      } else {
        await audioElement.value.play()
        videoElement.value?.pause()
      }
      isPlaying.value = !isPlaying.value
      if (duration.value !== audioElement.value.duration) {
        duration.value = audioElement.value.duration
      }
    }

    const setVolume = (volume: number) => {
      if (audioElement.value) {
        audioElement.value.volume = Math.max(0, Math.min(1, volume))
      }
    }

    const getVolume = (): number => {
      return audioElement.value?.volume as number
    }

    const seekTime = (offset: number) => {
      if (!audioElement.value) return
      const offsetInSeconds = offset * 1
      const newTime = audioElement.value.currentTime + offsetInSeconds

      if (newTime >= audioElement.value.duration) {
        audioElement.value.currentTime = audioElement.value.duration
      } else if (newTime <= 0) {
        audioElement.value.currentTime = 0
      } else {
        audioElement.value.currentTime = newTime
      }
    }

    const prevSong = () => {
      if (!audioElement.value) return
      if (currentIndex.value === 0) {
        audioElement.value.currentTime = 0
        audioElement.value.play()
      } else {
        console.log('播放上一首')
        currentIndex.value--
        const prevSong = songs.value[currentIndex.value]
        setCurrentSong(prevSong, currentIndex.value)
      }
    }

    const nextSong = () => {
      if (!audioElement.value) return
      audioElement.value.currentTime = audioElement.value.duration
    }
    return {
      songs,
      audioElement,
      videoElement,
      isPlaying,
      currentTime,
      currentIndex,
      currentVideo,
      duration,
      currentSong,
      playMode,
      setAudioElement,
      togglePlay,
      setVolume,
      getVolume,
      seekTime,
      setCurrentSong,
      setPlayMode,
      prevSong,
      nextSong,
    }
  },
  {
    persist: false, // 默认为关
  },
)
