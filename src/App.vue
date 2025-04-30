<script setup lang="ts">
import PlayerList from './views/PlayerList.vue'
import PlayerAudio from './views/PlayerAudio.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const goBack = () => {
  router.go(-1)
}
</script>

<template>
  <div id="player">
    <header>
      <div style="margin: 10px 10px 0 30px"><img src="/public/favicon.webp" /></div>
      <div class="fontColor">Vue 3 Music Player</div>
      <div style="width: 70vw"></div>
      <div class="imgItem"><img src="/public/icons/back.png" @click="router.go(-1)" /></div>
      <div class="imgItem" style="width: 40px">
        <img src="/public/icons/front.png" @click="router.go(1)" />
      </div>
    </header>
    <div class="container">
      <PlayerList></PlayerList>
      <router-view></router-view>
    </div>
    <footer>
      <PlayerAudio></PlayerAudio>
    </footer>
  </div>
</template>

<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#player {
  margin: 2.5vh auto;
  width: 95vw;
  height: 95vh;
  border: 1px solid #f1f1f1;
  border-radius: 25px;
  background: white;
  box-shadow: 10px 10px 5px #888888;
  overflow: hidden;
}
header {
  width: 100%;
  height: 6vh;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #d1d1d1;
  cursor: default;
  .imgItem {
    width: 32px;
    cursor: pointer;
    margin: 0 10px;
    transition: all 0.3s;
    img {
      margin-top: 10px;
      width: 100%;
      &:hover {
        transform: scale(1.15);
      }
    }
  }
  .fontColor {
    font-size: 1.3em;
    font-family: 'Yu Gothic';
    font-weight: 700;
    background: linear-gradient(to right, #42d392, #6187f4);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    font-weight: 700;
    font-family: 'Yu Gothic';
  }
}
.container {
  display: flex;
}
</style>
