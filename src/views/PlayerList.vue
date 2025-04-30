<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSongStore } from '@/stores/song'
import CreateList from '@/components/CreateList.vue'
const activeIndex = ref(0)
const showAdd = ref(false)
const router = useRouter()
const songStore = useSongStore()
const setActive = (index: number) => {
  activeIndex.value = index
}
const handleNavigate = (path: string) => {
  router.push(path)
}
const deleteOneSongList = (id: number) => {
  let deleteId: number = 0
  for (let i = 0; i < songStore.songList.length; i++) {
    if (songStore.songList[i].id === id) {
      deleteId = songStore.songList[i].id
      songStore.songList.splice(i, 1)
      break
    }
  }
  for (let i = 0; i < songStore.SongDefaultList.length; i++) {
    if (songStore.SongDefaultList[i].list) {
      for (let j = 0; j < songStore.SongDefaultList[i].list.length; j++) {
        if (id === songStore.SongDefaultList[i].list[j]) {
          songStore.SongDefaultList[i].list.splice(j, 1)
        }
      }
    }
  }
  router.push('/default')
}
const jumpToGithub = () => {
  window.open('https://github.com/MomoseMitsuki')
}
</script>

<template>
  <create-list v-model:show="showAdd"></create-list>
  <div class="list">
    <div class="user">
      <img src="/public/userIcon.jpg" />
      <div class="userName">Momose Misuki</div>
      <div class="github" @click="jumpToGithub">
        <span class="icon"><img src="/public/icons/github.png" /></span>author github →
      </div>
    </div>
    <div class="nav">
      <div
        class="navItem"
        :class="{ active: activeIndex === 0 }"
        @click="(setActive(0), handleNavigate('/'))"
      >
        <img src="/public/icons/index.png" /> 首页
      </div>
      <div class="label">歌单<img src="/public/icons/add.png" @click="showAdd = true" /></div>
      <div
        class="navItem"
        :class="{ active: activeIndex === 1 }"
        @click="(setActive(1), handleNavigate('/default'))"
      >
        <img src="/public/icons/defaultList.png" /> 默认歌单
      </div>
      <div
        class="navItem"
        :class="{ active: activeIndex === 2 }"
        @click="(setActive(2), handleNavigate('/love'))"
      >
        <img src="/public/icons/love.png" /> 我喜欢
      </div>
      <div
        class="navItem"
        v-for="(item, i) in songStore.songList"
        :class="{ active: activeIndex === i + 3 }"
        @click="(setActive(i + 3), handleNavigate(`/list${item.id}`))"
      >
        <img src="/public/icons/listItem.png" />
        {{ item.name }}
        <img src="/public/icons/cancel.png" class="cancel" @click="deleteOneSongList(item.id)" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.list {
  width: 17vw;
  height: 80vh;
  border-right: 1px solid #d1d1d1;
  overflow-x: hidden;
  overflow-y: scroll;
  .user {
    width: 17vw;
    height: 20vh;
    text-align: center;
    img {
      margin: 15px auto;
      width: 6vw;
      border-radius: 50%;
    }
    .userName {
      font-size: 1.5em;
      font-weight: 700;
      font-family: 'Calibri';
    }
    .github {
      margin: 0 auto;
      display: flex;
      margin-top: 11px;
      width: 160px;
      height: 30px;
      line-height: 30px;
      color: white;
      font-size: 13px;
      background-color: #000;
      border-radius: 10px;
      cursor: pointer;
      box-shadow: 2px 2px 1px #888888;
      .icon {
        background-color: #fff;
        border-radius: 10px;
        width: 20px;
        height: 20px;
        margin: 5px 11px;
        img {
          width: 18px;
          margin-top: 3px;
          margin-right: 1px;
        }
      }
    }
  }
  .nav {
    margin-top: 45px;
    font-family: '黑体';
    .navItem {
      position: relative;
      margin: 3px 10px;
      border-radius: 10px;
      height: 50px;
      line-height: 50px;
      font-size: 1em;
      padding: 0 20px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      background-color: transparent;
      .cancel {
        position: absolute;
        top: 18px;
        right: 30px;
        width: 15px;
        opacity: 0;
        transition: opacity 0.3s ease;
        &:hover {
          transform: scale(1.15);
        }
      }
      &:hover {
        background-color: rgba(229, 231, 235, 0.5);
        cursor: pointer;
        .cancel {
          opacity: 1;
        }
      }

      &.active {
        background-color: rgba(229, 231, 235, 0.8);
        .cancel {
          opacity: 1;
        }
      }

      img {
        width: 20px;
        vertical-align: middle;
        margin-bottom: 5px;
      }
    }
    .label {
      margin: 8px 0 8px 0;
      height: 30px;
      line-height: 30px;
      padding: 0 20px;
      img {
        margin-left: 10px;
        margin-bottom: -4px;
        width: 20px;
        transition: transform all 0.3s;
        cursor: pointer;
        &:hover {
          transform: scale(1.1);
        }
      }
    }
  }
}
</style>
