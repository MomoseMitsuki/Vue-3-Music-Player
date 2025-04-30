<script setup lang="ts">
import { ref } from 'vue'
import { useSongStore } from '@/stores/song'
const songStore = useSongStore()
const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits(['update:show'])
const closeDialog = () => {
  name.value = ''
  des.value = '自定义歌单'
  emit('update:show', false)
}
const postSongList = () => {
  if (!name.value) return
  for (let i = 0; i < songStore.songList.length; i++) {
    if (songStore.songList[i].name === name.value) return
  }
  let id: number
  if (songStore.songList.length === 0) {
    id = 1
  } else {
    id = songStore.songList[songStore.songList.length - 1].id + 1
  }
  songStore.songList.push({
    id,
    name: name.value,
    description: des.value,
  })
  closeDialog()
}
const name = ref('')
const des = ref('自定义歌单')
</script>

<template>
  <div class="bg" v-show="show">
    <div class="dialog">
      <div class="title">新建歌单</div>
      <div class="item">歌单名:<input type="text" v-model="name" /></div>
      <div class="item">描述:<input type="text" v-model="des" /></div>
      <div class="control">
        <div class="btn" @click="postSongList">确认</div>
        <div class="btn" @click="closeDialog">取消</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.bg {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  .dialog {
    background: white;
    z-index: 1001;
    width: 30vw;
    height: 30vh;
    border-radius: 10px;
    overflow: hidden;
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.1),
      0 8px 16px rgba(0, 0, 0, 0.1);
    .title {
      width: 100%;
      height: 5vh;
      line-height: 5.8vh;
      font-size: 1.2em;
      padding: 0 40px;
      font-family: '黑体';
      border-bottom: 1px solid #d1d1d1;
      img {
        margin-left: 10px;
        margin-bottom: -4px;
        width: 1.2em;
      }
    }
    .item {
      margin: 20px;
      font-family: '黑体';
      font-size: 1.2em;
      padding: 10px 20px;
      position: relative;
      input {
        width: 300px;
        height: 30px;
        position: absolute;
        top: 7px;
        left: 95px;
        border-radius: 8px;
        padding: 0 10px;
        border: 1px solid grey;
      }
    }
    .control {
      display: flex;
      padding: 10px 30px;
      .btn {
        color: #333;
        cursor: pointer;
        width: 180px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        margin: 0 23px;
        border-radius: 10px;
        border: 1px solid grey;
        transition: all 0.3s;
        &:nth-child(1) {
          background: rgb(91, 187, 224);
        }
        &:hover {
          transform: scale(1.15);
        }
      }
    }
  }
}
</style>
