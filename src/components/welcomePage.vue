<template>
  <el-container class="cover-container">
    <div v-loading="loading" style="position: fixed; right: 65px;top: 35px;"/>
    <el-main class="cover-main">
      <el-row class="cover-row">
        <el-col :span="24" class="cover-title">
          <transition appear name="text">
            <div>
              <el-text style="font-size:5.5vw;color: white">欢迎使用椒盐歌单助手</el-text>
            </div>
          </transition>
          <br>
          <transition appear name="button">
            <div>
              <div style="display: flex;justify-content: center;align-items: center">
                <el-text style="color: white;font-size: 25px">允许发送统计数据</el-text>
                <el-switch
                    v-model="allowStatistic"
                    size="large"
                    style="margin-left: 15px"
                />
              </div>
              <br>
              <el-button class="transition-text" size="large"
                         style="font-size:25px; margin-top: 15px; padding: 20px 30px;"
                         type="primary"
                         @click="testServer">开始
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

<style>
.notificationError {
  background-color: rgb(255, 235, 235) !important;
  border: rgb(255, 235, 235) !important;
}

.notificationSuccess {
  background-color: rgb(220, 255, 220) !important;
  border: rgb(220, 255, 220) !important;
}

.notificationWarning {
  background-color: rgb(250, 250, 200) !important;
  border: rgb(255, 255, 200) !important;
}

.notificationInfo {
  background-color: rgb(230, 230, 230) !important;
  border: rgb(230, 230, 230) !important;
}

.el-loading-text {
  font-size: 20px !important;
}
</style>


<script lang="ts" setup>
import {ElNotification} from 'element-plus'
import {ref} from 'vue'
import axios from "axios";

const emit = defineEmits(["changePage", "showLoadingSpinner"]);

function changePage() {
  emit("changePage", 1);
}

const loading = ref(false)
const allowStatistic = ref(true)

function testServer() {
  loading.value = true
  axios({
    method: 'GET',
    url: '/test',
    params: {
      allowStatistic: allowStatistic.value
    }
  }).then((backEnd) => {
    loading.value = false
    changePage()
  }).catch(err => {
    loading.value = false
    connectServerFailedNoti(err)
  })
}

const connectServerFailedNoti = (err) => {
  ElNotification({
    title: '服务器连接失败',
    message: "错误详情：" + err,
    type: 'error',
    customClass: 'notificationError',
    duration: 5000,
  })
}
</script>