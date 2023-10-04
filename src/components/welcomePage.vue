<template>
  <el-container class="cover-container">
    <el-main class="cover-main">
      <el-row class="cover-row">
        <el-col :span="24" class="cover-title">
          <transition appear name="text">
            <div>
              <el-text style="font-size:5vw;color: white">欢迎使用椒盐歌单助手</el-text>
            </div>
          </transition>
          <br>
          <transition appear name="button">
            <div>
              <el-button class="transition-text" size="large"
                         style="font-size:25px; margin-top: 25px; padding: 20px 30px;"
                         type="primary"
                         @click="changePage()">开始
              </el-button>
            </div>
          </transition>
        </el-col>

      </el-row>
    </el-main>
    <transition appear name="footer">
      <el-footer class="cover-footer">
        <el-row class="cover-row">
          <el-col :span="24" class="cover-copy"><p>© 2023 HWinZnieJ All rights reserved.</p></el-col>
        </el-row>
      </el-footer>
    </transition>
    <el-footer hidden></el-footer>
  </el-container>
</template>

<style scoped>
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

html, body {
  background-color: black;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.cover-container {
  height: 100vh;
  width: 100vw;
  background: url("../assets/background.jpg") no-repeat center center;
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


<script lang="ts" setup>

const emit = defineEmits(["changePage"]);

function changePage() {
  emit("changePage", 1);
}
</script>