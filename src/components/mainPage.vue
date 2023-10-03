<template>
  <div @transitionend="loadAnimation">
    <el-container class="cover-container">
      <el-header style="background-color: white;height: 80px;opacity: 0.7">
        <el-steps :active="active" align-center finish-status="success" style="margin-top: 15px">
          <el-step title="选择歌单来源"/>
          <el-step title="上传所需文件①"/>
          <el-step title="上传所需文件②"/>
          <el-step title="选择转换歌单"/>
          <el-step title="预览转换结果"/>
          <el-step title="下载转换结果"/>
        </el-steps>
      </el-header>

      <div>
        <el-icon style="margin-left: 25px;margin-top: 25px;color: white;font-size: 30px;cursor: pointer;"
                 @click="back()">
          <Back/>
        </el-icon>
      </div>
      <el-main class="cover-main">
        <transition :name="transitionName" mode="out-in">
          <component :is="componentName" :source="source" @changeLogo="(sourceName) => changeLogo(sourceName)"
                     @next="(msg,num) => next(msg,num)"/>
        </transition>
        <!--            <choose-music-list-source @next="(msg) => next(msg)"/>-->
        <!--                  <upload-files1/>-->
        <!--      <upload-files2 :source="source"/>-->

      </el-main>
    </el-container>
    <transition name="icon-fade">
      <div v-if="logoName==='CloudMusic'" key="1"
           :style="{background: 'url('+logoPath+') no-repeat center center'}" class="source-icon"
           style="background-size: cover;"></div>
      <div v-else-if="logoName==='QQMusic'" key="2"
           :style="{background: 'url('+logoPath+') no-repeat center center'}" class="source-icon"
           style="background-size: cover;"></div>
      <div v-else-if="logoName==='KugouMusic'" key="3"
           :style="{background: 'url('+logoPath+') no-repeat center center'}" class="source-icon"
           style="background-size: cover;"></div>
      <div v-else-if="logoName==='KuwoMusic'" key="4"
           :style="{background: 'url('+logoPath+') no-repeat center center'}" class="source-icon"
           style="background-size: cover;"></div>

    </transition>
  </div>
</template>

<style>
:root {
  --start-color: ;
  --end-color: ;
  --background-end-color: #000000;
  --start-color1: ;
}

.icon-fade-enter-active {
  animation: iconFadeIn 0.8s ease;
}

@keyframes iconFadeIn {
  0% {
    opacity: 0;
  }
}

.icon-fade-leave-active {
  animation: iconFadeOut 0.8s ease;
}

@keyframes iconFadeOut {
  100% {
    opacity: 0;
  }
}


@keyframes CloudMusicFadeIn {
  0% {
    background-color: var(--start-color);
  }
  100% {
    background-color: var(--end-color);
  }
}

@keyframes QQMusicFadeIn {
  0% {
    background-color: var(--start-color);
  }
  100% {
    background-color: var(--end-color);
  }
}

@keyframes KugouMusicFadeIn {
  0% {
    background-color: var(--start-color);
  }
  100% {
    background-color: var(--end-color);
  }
}

@keyframes KuwoMusicFadeIn {
  0% {
    background-color: var(--start-color);
  }
  100% {
    background-color: var(--end-color);
  }
}

@keyframes fadeOut {
  0% {
    background-color: var(--start-color);
  }
  100% {
    background-color: var(--end-color);
  }
}

@keyframes gradientTransition {
  0% {
    background-color: #caaf00;
  }
  15% {
    background-color: #cc4e00;
  }
  30% {
    background-color: #a31a18;
  }
  45% {
    background-color: #179a5e;
  }
  60% {
    background-color: #006acc;
  }
  75% {
    background-color: #00a1cc;
  }
  90% {
    background-color: #ccba36;
  }
  100% {
    background-color: #caaf00;
  }
}

@keyframes prepareGradientTransition {
  0% {
    background-color: black;
  }
  100% {
    background-color: #caaf00;
  }
}

@keyframes backToBlack {
  0% {
    background-color: var(--start-color1);
  }
  100% {
    background-color: black;
  }
}

.source-icon {
  height: 20vw;
  width: 20vw;
  position: absolute;
  bottom: 0;
  right: 0;
  margin-bottom: -3vw;
  margin-right: -3vw;
  filter: grayscale(1000%) brightness(1000%);
  opacity: 0.3;
}

html, body {
  background-color: var(--background-end-color);
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.nextPage-enter-active {
  animation: slide-in 0.5s ease forwards;
}

.nextPage-leave-active {
  animation: slide-out 0.5s ease forwards;
}

.previousPage-enter-active {
  animation: slide-in-reverse 0.5s ease forwards;
}

.previousPage-leave-active {
  animation: slide-out-reverse 0.5s ease forwards;
}

@keyframes slide-in {
  from {
    transform: translateX(10%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-out {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-10%);
    opacity: 0;
  }
}

@keyframes slide-in-reverse {
  from {
    transform: translateX(-10%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-out-reverse {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(10%);
    opacity: 0;
  }
}


.cover-container {
  height: 100vh;
  width: 100vw;
}

.cover-row {
  height: 100%;
  align-items: center;
}


.cover-main {
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cover-title {
  text-align: center;
  color: white;
}

.cover-copy {
  text-align: center;
  color: white;
}
</style>


<script lang="ts" setup>
import {ref, shallowRef} from "vue";
import chooseMusicListSource from "./chooseMusicListSource.vue"
import uploadFiles1 from "./uploadFiles1.vue"
import uploadFiles2 from "./uploadFiles2.vue"
import {Back} from "@element-plus/icons-vue";

const componentName = shallowRef(chooseMusicListSource)

const active = ref(0)
const source = ref('')
const logoPath = ref('')
const logoName = ref('')
const transitionName = ref('')

function changeLogo(sourceName) {
  stopChange.value = true
  logoPath.value = new URL('../assets/' + sourceName + '.png', import.meta.url).href
  logoName.value = sourceName
}

function next(msg: string, num: number) {
  if (num !== -1)
    transitionName.value = 'nextPage'
  active.value = active.value + num
  source.value = msg
  switch (active.value) {
    case 0:
      componentName.value = chooseMusicListSource
      break
    case 1:
      componentName.value = uploadFiles1
      break
    case 2:
      componentName.value = uploadFiles2
      break
    case 3:
      componentName.value = chooseMusicList
      break
    case 4:
      componentName.value = previewMusicList
      break
    case 5:
      componentName.value = downloadMusicList
      break
    default:
      return;
  }
}

const firstEnter = ref(true)
const stopChange = ref(false)


function loadAnimation() {
  if (!firstEnter.value) {
    return
  }
  firstEnter.value = false
  const body = document.body.style;
  setTimeout(() => {
    body.animation = 'prepareGradientTransition 1s ease';
  }, 500);
  if (stopChange.value) {
    return
  }
  setTimeout(() => {
    if (stopChange.value) {
      return
    }
    body.animation = 'gradientTransition 15s ease infinite';
  }, 1500);
}

const emit = defineEmits(["changePage"]);

function changePage() {
  emit("changePage", 0);
}

function back() {
  if (active.value === 0) {
    stopChange.value = true
    const body = document.body;
    const style = window.getComputedStyle(body)
    document.documentElement.style.setProperty('--start-color1', style.backgroundColor);
    document.body.style.animation = 'backToBlack 0.5s ease forwards'
    changePage()
    return
  }
  transitionName.value = 'previousPage'
  next(source.value, -1)
}
</script>