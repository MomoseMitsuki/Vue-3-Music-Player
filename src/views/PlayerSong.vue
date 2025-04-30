<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAudioStore } from '@/stores/audio'
import { useSongStore, type Song } from '@/stores/song'
const route = useRoute()
const router = useRouter()
const audioStore = useAudioStore()
const songStore = useSongStore()
const currentPath = ref(route.path)
const showAddList = ref(-1)
const name = ref('')
const des = ref('')
const pathPng = ref('')
const songList = ref(songStore.getModeList(songStore.SongDefaultList, currentPath.value))

// 初始化页面数据
const initPageData = (path: string) => {
  songList.value = songStore.getModeList(songStore.SongDefaultList, path)
  audioStore.songs = songList.value
  if (path === '/default') {
    name.value = '默认歌单'
    des.value = '所有歌曲目录'
    pathPng.value = '/public/pics/default.png'
  } else if (path === '/love') {
    name.value = '我喜欢'
    des.value = '收藏的歌曲'
    pathPng.value = '/pics/love.jpg'
  } else {
    for (let i = 0; i < songStore.songList.length; i++) {
      if (`/list${songStore.songList[i].id}` === path) {
        name.value = songStore.songList[i].name
        des.value = songStore.songList[i].description
        pathPng.value = '/public/pics/list.jpg'
      }
    }
  }
}

// 监听路由变化
watch(
  () => route.path,
  (newPath) => {
    currentPath.value = newPath
    initPageData(newPath)
  },
)
watch(
  () => songStore.SongDefaultList,
  () => {
    songList.value = songStore.getModeList(songStore.SongDefaultList, currentPath.value)
  },
  { deep: true, immediate: true },
)
// 初始化
initPageData(route.path)

const handleSongClick = (item: Song, index: number) => {
  // 如果点击的是当前正在播放的歌曲，则不做处理
  if (audioStore.currentSong.id === item.id && audioStore.audioElement) {
    audioStore.audioElement.currentTime = 0
    audioStore.audioElement.play()
    return
  }
  audioStore.setCurrentSong(item, index)
}
const clickSongItem = (e: Event, id: number) => {
  e.stopPropagation()
  songStore.changeLoveState(id)
}
const playVideo = (e: Event, path: string) => {
  e.stopPropagation()
  audioStore.audioElement?.pause()
  audioStore.currentVideo = path
  router.push('/video')
}
const handleAddList = (e: Event, index: number) => {
  e.stopPropagation()
  if (showAddList.value === index) {
    showAddList.value = -1
    return
  }
  window.addEventListener('click', exitAddList)
  showAddList.value = index
}
const exitAddList = () => {
  showAddList.value = -1
  window.removeEventListener('click', exitAddList)
}
const addSongToList = (e: Event, songId: number, ListId: number): void => {
  e.stopPropagation()
  showAddList.value = -1
  window.removeEventListener('click', exitAddList)
  for (let i = 0; i < songStore.SongDefaultList.length; i++) {
    if (songStore.SongDefaultList[i].id === songId) {
      for (let j = 0; j < songStore.SongDefaultList[i].list.length; j++) {
        if (songStore.SongDefaultList[i].list[j] === ListId) {
          return
        }
      }
      songStore.SongDefaultList[i].list.push(ListId)
      return
    }
  }
}
const deleteSonginList = (e: Event, songId: number, path: string): void => {
  e.stopPropagation()
  for (let i = 0; i < songStore.SongDefaultList.length; i++) {
    if (songStore.SongDefaultList[i].id === songId) {
      for (let j = 0; j < songStore.SongDefaultList[i].list.length; j++) {
        if (`/list${songStore.SongDefaultList[i].list[j]}` === path) {
          songStore.SongDefaultList[i].list.splice(j, 1)
          break
        }
      }
    }
  }
}
</script>

<template>
  <div class="listInfo">
    <div>
      <img :src="pathPng" />
    </div>
    <div>
      <h1>{{ name }}</h1>
      <p>{{ des }}</p>
    </div>
  </div>
  <div>
    <div class="listheader">
      <div>歌名</div>
      <div>歌手</div>
      <div>时间</div>
    </div>
    <div class="list">
      <div
        class="item"
        v-for="(item, index) in songList"
        :key="item.id"
        @click="handleSongClick(item, index)"
      >
        <div class="info">{{ item.name }}</div>
        <div class="info">{{ item.singers }}</div>
        <div class="info">{{ item.time }}</div>
        <img
          :src="item.isLove ? '/public/icons/fullLove.png' : '/public/icons/love.png'"
          @click="clickSongItem($event, item.id)"
          style="margin-left: -40px"
        />
        <img src="/public/icons/add.png" @click="handleAddList($event, index)" />
        <img
          src="/public/icons/delete.png"
          style="margin-right: 12px"
          v-show="route.path !== '/default' && route.path !== '/love'"
          @click="deleteSonginList($event, item.id, route.path)"
        />
        <img
          src="/public/icons/video.png"
          v-show="item.video"
          @click="playVideo($event, item.video as string)"
        />
        <div class="songList" v-show="showAddList === index">
          <div
            class="listItem"
            v-for="i in songStore.songList"
            @click="addSongToList($event, item.id, i.id)"
          >
            {{ i.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.listInfo {
  width: 28vw;
  text-align: center;
  padding-top: 30px;
  img {
    width: 18vw;
    height: 18vw;
    object-fit: cover;
    object-position: top;
    border-radius: 20px;
  }
}
.list {
  height: 73.55vh;
  overflow-y: scroll;
}
.listheader {
  margin-top: 30px;
  width: 45vw;
  height: 30px;
  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: transparent;
  div {
    width: 13vw;
    &:nth-child(1) {
      margin-left: 20px;
    }
  }
}
.item {
  position: relative;
  margin-right: 1vw;
  width: 48.5vw;
  height: 45px;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 10px;
  .songList {
    position: absolute;
    border: 1px solid #d1d1d1;
    border-radius: 2px;
    background-color: white;
    top: 20px;
    right: 155px;
    width: 150px;
    height: 200px;
    z-index: 2;
    overflow-x: hidden;
    overflow-y: scroll;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    .listItem {
      width: 100%;
      height: 30px;
      line-height: 30px;
      padding: 5px 18px;
      font-size: 0.9em;
      color: #333;
      &:hover {
        background-color: #eeeeee;
      }
    }
  }
  &:hover {
    background: #d1d1d1;
  }
  img {
    width: 20px;
    height: 20px;
    transition: transform 0.3s ease;
    margin: 0 9px;
    &:hover {
      transform: scale(1.15);
    }
  }
  .info {
    width: 13vw;
    &:nth-child(1) {
      margin-left: 20px;
    }
  }
}
</style>
