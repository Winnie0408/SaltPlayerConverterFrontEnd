<template>
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

    <el-main class="cover-main">
      <transition mode="out-in" name="nextPage">
        <component :is="componentName" :source="source" @next="(msg) => next(msg)"/>
      </transition>
      <!--            <choose-music-list-source @next="(msg) => next(msg)"/>-->
      <!--                  <upload-files1/>-->
      <!--      <upload-files2 :source="source"/>-->

    </el-main>
  </el-container>
  <!--  <img src="{{logoPath}}" style="position: fixed; bottom: 0; right: 0; width: 10vh; height: 10vh; margin: 15px;" alt="logo"/>-->
</template>

<style>
element {
  --start-color: ;
  --end-color: ;
  --background-end-color: #000000;
}

@keyframes fadeIn {
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

body {
  animation: gradientTransition 20s ease infinite;
}

html, body {
  background-color: var(--background-end-color);
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.nextPage-enter-active {
  animation: slide-in 0.5s forwards;
}

.nextPage-leave-active {
  animation: slide-out 0.5s forwards;
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

const componentName = shallowRef(chooseMusicListSource)

const active = ref(0)
const source = ref('')
const logoPath = ref('')

function next(msg: string) {
  active.value++
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
  // logoPath.value= '../assets/' + source.value + '.png'
  // console.log(logoPath.value)
}
</script>