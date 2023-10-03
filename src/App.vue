<template>
  <transition name="pageTransition" @changePage="(num)=>ChangePage(num)">
    <component :is="activeComponent"/>
  </transition>
</template>

<style scoped>
.pageTransition-leave-active {
  animation: collapse 0.5s ease;
}

@keyframes collapse {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-10vh);
    opacity: 0;
  }
}

.pageTransition-enter-active {
  animation-name: collapse-reverse;
  animation-duration: 0.5s;
  animation-timing-function: ease;
  animation-delay: 0.5s;
}

@keyframes zoomIn {
  0% {
    opacity: 0;
    transform: translateY(10vh);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.pageTransitionReverse-enter-active {
  animation-name: collapse-reverse;
  animation-duration: 1s;
  animation-timing-function: ease;
  animation-delay: 0.5s;
}

@keyframes collapse-reverse {
  0% {
    transform: translateY(-10vh);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.pageTransitionReverse-leave-active {
  animation: zoomIn-reverse 0.5s ease;
}

@keyframes zoomIn-reverse {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(10vh);
  }
}

html, body {
  background-color: black;
  margin: 0;
  padding: 0;
  overflow: hidden;
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

.cover-footer {
  height: 10vh;
  background-color: rgba(0, 0, 0, 0.5);
}

.cover-copy {
  text-align: center;
  color: white;
}
</style>


<script lang="ts" setup>
import {ref, shallowRef} from "vue";
import welcomePage from "./components/welcomePage.vue";
import mainPage from "./components/mainPage.vue";

const activeComponent = shallowRef(welcomePage);
const transitionName = ref('');

function ChangePage(num: number) {
  if (num === 1) {
    console.log("111")
    transitionName.value = 'pageTransition'
    activeComponent.value = mainPage;
  } else if (num === 0) {
    console.log("000")
    transitionName.value = 'pageTransitionReverse'
    activeComponent.value = welcomePage;
  }
}
</script>