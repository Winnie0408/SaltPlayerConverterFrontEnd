<template>
  <transition mode="out-in" name="pageTransition" @changePage="ChangePage">
    <main-page/>
  </transition>
</template>

<style scoped>
.pageTransition-leave-active {
  animation: collapse 1s ease;
}

@keyframes collapse {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh);
    opacity: 0;
  }
}

.pageTransition-enter-active {
  animation: zoomIn 0.5s ease;
}

@keyframes zoomIn {
  0% {
    opacity: 0.5;
    transform: translateY(20vh);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
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
import {shallowRef} from "vue";
import welcomePage from "./components/welcomePage.vue";
import mainPage from "./components/mainPage.vue";

const activeComponet = shallowRef(welcomePage);

function ChangePage() {
  activeComponet.value = mainPage;
}
</script>