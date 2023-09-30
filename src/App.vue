<template>
  <transition name="welcome">
    <el-collapse-transition v-if="show">
      <el-container class="cover-container">
        <el-main class="cover-main">
          <el-row class="cover-row">
            <el-col :span="24" class="cover-title">
              <transition name="text" appear>
                <div>
                  <el-text style="font-size:60px;color: white">欢迎使用椒盐歌单助手</el-text>
                </div>
              </transition>
              <br>
              <transition name="button" appear>
                <div>
                  <el-button class="transition-text" type="primary" size="large" @click="show = false"
                             style="font-size:25px; margin-top: 50px; padding: 20px 30px;">开始
                  </el-button>
                </div>
              </transition>
            </el-col>

          </el-row>
        </el-main>
        <transition name="footer" appear>
          <el-footer class="cover-footer">
            <el-row class="cover-row">
              <el-col :span="24" class="cover-copy"><p>© 2023 HWinZnieJ All rights reserved.</p></el-col>
            </el-row>
          </el-footer>
        </transition>
        <el-footer hidden></el-footer>
      </el-container>
    </el-collapse-transition>
  </transition>
</template>

<style>
.text-enter-active {
  animation: up 1s ease;
}

.button-enter-active {
  animation: up2 1.2s ease;
}

.footer-enter-active {
  animation: up2 1.6s ease;
}

.background-enter-active {
  animation: down 2s;
}

@keyframes up {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes up2 {
  0% {
    opacity: 0;
    transform: translateY(50px);
  }
  30% {
    opacity: 0;
    transform: translateY(50px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.welcome-leave-active {
  animation: collapse 1s ease;
}

@keyframes collapse {
  0% {
    height: 100vh;
    opacity: 1;
  }
  100% {
    height: 0;
    opacity: 0;
  }
}

html, body {
  background-color: black;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.cover-container {
  height: 100vh;
  width: 100vw;
  background: url("./assets/background.jpg") no-repeat center center;
  background-size: cover;
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


<script setup lang="ts">
import {ElCollapseTransition} from 'element-plus'
import {ref} from "vue";

const show = ref(true)
</script>