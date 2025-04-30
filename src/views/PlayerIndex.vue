<script setup lang="ts">
import { ref } from 'vue'
const mousePosition = ref({ x: 0, y: 0 })
const layer1Ref = ref()
const layerOffsetPer = ref({ x: 0, y: 0 })
const isMouseInside = ref(false)

const handleMouseEnter = (e: MouseEvent) => {
  isMouseInside.value = true
}

const handleMouseMove = (e: MouseEvent) => {
  if (!layer1Ref.value) return
  if (!isMouseInside.value) return
  const elementWidth = layer1Ref.value.clientWidth
  const elementHeight = layer1Ref.value.clientHeight
  mousePosition.value = {
    x: e.offsetX,
    y: e.offsetY - 100,
  }
  layerOffsetPer.value = {
    x: (mousePosition.value.x / elementWidth) * 100 - 50,
    y: (mousePosition.value.y / elementHeight) * 100 - 50,
  }
}

const handleMouseLeave = () => {
  isMouseInside.value = false
}
const jumpTo = (path: string): void => {
  window.open(path)
}
</script>

<template>
  <div class="indexBox">
    <div class="header">
      <div
        class="layer1"
        @mouseenter="handleMouseEnter"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave"
        ref="layer1Ref"
      >
        <div
          class="layer2"
          :style="{
            transform: `translateX(${-(layerOffsetPer.x / 100) * 70}px) translateY(${-(layerOffsetPer.y / 100) * 70}px)`,
          }"
        >
          <div
            class="layer3"
            :style="{
              transform: `translateX(${-(layerOffsetPer.x / 100) * 50}px) translateY(${-(layerOffsetPer.y / 100) * 50}px)`,
            }"
          ></div>
        </div>
      </div>
      <img src="/public/index/wave/wave_top1.svg" />
    </div>
    <div class="main">
      <div style="font-size: 0.8em; line-height: 150px">A single Music Player</div>
      <div style="margin-top: -40px">
        build by
        <span style="color: #4eb883; margin-right: 20px">Vue.js 3 </span>
        <span style="color: #cf649a">Sass </span>
        and
        <span style="color: #3178c6">TypeScript</span>
      </div>
      <div class="technology">
        <img src="/public/icons/vue.svg" @click="jumpTo('https://cn.vuejs.org/')" />
        <img src="/public/icons/sass.svg" @click="jumpTo('https://www.sass.hk/')" />
        <img src="/public/icons/typescript.svg" @click="jumpTo('https://ts.nodejs.cn/')" />
      </div>
      <div class="btn" @click="jumpTo('https://github.com/MomoseMitsuki/Vue-3-Music-Player')">
        Get SourceCode →
      </div>
    </div>
    <div class="introduce">
      <img src="/public/index/wave/wave_bottom1.svg" />
      <h1>INTRODUCE</h1>
      <h5>项目介绍</h5>
      <div class="info">
        <div class="left">
          <img src="/public/favicon.webp" />
          动漫简约风 音乐播放器
        </div>
        <div class="right">
          <ul>
            <li>Pinia 持久化</li>
            <div>在数据管理方面，使用Pinia进行状态管理，并实现本地持久化存储。</div>
            <li>音频可视化</li>
            <div>用Web Audio API实现高精度音频解码和播放控制，</div>
            <div>通过Canvas API绘制动态音频频谱，呈现频谱可视化效果。</div>
            <div>系统支持音乐视频播放功能，确保音视频同步流畅。</div>
            <li>歌词滚动</li>
            <div>项目实现了精准的歌词滚动效果，能够根据歌曲进度自动高亮当前歌词行</div>
            <li>响应式设计</li>
            <div>项目采用响应式设计，提供直观友好的用户界面。</div>
            <div>核心功能包括多格式音频播放、播放列表管理、等，通过性能优化确保流畅运行。</div>
            <div>系统架构清晰，包含组件化设计、组合式函数和模块化路由配置。</div>
          </ul>
        </div>
      </div>
      <img src="/public/index/decoration/story_icon.png" class="icon" />
      <img src="/public/index/decoration/story_talk.png" class="talk" />
      <img src="/public/index/wave/wave_top2.svg" style="z-index: 10; position: relative" />
      <img src="/public/index/decoration/sakura-right.png" class="sakura" />
    </div>
    <div class="author">
      <img src="/public/userIcon.jpg" />
      <div>a single music player made by MomoseMitsuki</div>
      <div>QQ:2361902570</div>
      <div>emali:momosemitsuki520@gmail.com</div>
      <div>billbill:百濑美月_</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@font-face {
  font-family: 'TitleFont';
  src: url('/public/Cormorant-Infant-Light.ttf') format('TrueType');
}
.indexBox {
  width: 78vw;
  height: 80vh;
  overflow-y: scroll;
  cursor: default;
  .header {
    width: 100%;
    margin-top: -100px;
    overflow: hidden;
    position: relative;
    @for $i from 1 through 3 {
      .layer#{$i} {
        width: 100%;
        height: 1200px;
        background-image: url('/index/header/layer#{$i}.png');
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        transition: all 0.2s;
      }
    }
    img {
      position: absolute;
      width: 78vw;
      left: 0;
      bottom: 0;
    }
  }
  .main {
    color: #586166;
    width: 100%;
    height: 500px;
    background-color: #f5f2e9;
    text-align: center;
    font-family: 'TitleFont', sans-serif;
    font-size: 4em;
    .technology {
      margin-top: 30px;
      img {
        margin: 0 50px;
        width: 100px;
        cursor: pointer;
        transition: all 0.3s;
        &:hover {
          transform: scale(1.15);
        }
      }
    }
    .btn {
      width: 250px;
      height: 50px;
      line-height: 50px;
      background-color: #f595bb;
      color: white;
      font-size: 20px;
      border-radius: 25px;
      margin: 40px auto;
      font-family: 'Calibri';
      cursor: pointer;
      transition: all 0.3s;
      &:hover {
        transform: scale(1.1);
      }
    }
  }
  .introduce {
    width: 100%;
    height: 1255px;
    color: #586166;
    position: relative;
    .icon {
      position: absolute;
      width: 200px;
      top: 200px;
      right: 80px;
    }
    .talk {
      position: absolute;
      width: 100px;
      top: 160px;
      right: 210px;
      transform: rotate(-30deg);
    }
    .sakura {
      position: absolute;
      width: 600px;
      bottom: 0;
      right: 0;
    }
    img {
      width: 100%;
    }
    h1 {
      text-align: center;
      font-family: 'TitleFont', sans-serif;
      font-size: 4.5em;
      margin: 30px 0 10px 0;
      font-weight: 100;
    }
    h5 {
      text-align: center;
      font-family: tbnpmincho-std, serif;
      font-size: 1.5em;
      font-weight: 100;
      margin: 0;
    }
    .info {
      height: 800px;
      display: flex;

      .left {
        width: 30%;
        writing-mode: vertical-rl;
        text-orientation: upright;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2em;
        font-family: tbnpmincho-std, serif;
        letter-spacing: 0.5em;
        img {
          width: 60px;
          margin-bottom: 30px;
        }
      }
      .right {
        font-size: 20px;
        font-family: tbnpmincho-std, serif;
        ul {
          margin-top: 120px;
          li {
            font-size: 30px;
            margin-top: 40px;
          }
          div {
            margin-top: 15px;
          }
        }
      }
    }
  }
  .author {
    color: #586166;
    text-align: center;
    font-family: 'TitleFont', '宋体';
    font-size: 1.5em;
    height: 380px;
    background-color: #f5f2e9;
    img {
      width: 100px;
      border-radius: 50px;
      border: 2px solid #f595bb;
      margin: 40px 0;
    }
  }
}
</style>
