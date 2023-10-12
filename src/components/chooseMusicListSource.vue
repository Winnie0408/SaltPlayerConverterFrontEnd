<script lang="ts" setup>
import {ref} from 'vue'
import axios from "axios";
import {ElLoading, ElNotification} from "element-plus";

const value = ref('')
const options = [
  {
    value: 'CloudMusic',
    label: '网易云音乐'
  },
  {
    value: 'QQMusic',
    label: 'QQ音乐'
  },
  {
    value: 'KugouMusic',
    label: '酷狗音乐'
  },
  {
    value: 'KuwoMusic',
    label: '酷我音乐'
  }
]

const emit = defineEmits(["next", "changeLogo"]);

function next() {
  emit("next", value.value, 1);
}

function changeLogo(sourceName: string) {
  emit("changeLogo", sourceName);
}

function setBackgroundColor() {
  if (value.value === '') {
    return
  }

  const body = document.body;
  const style = window.getComputedStyle(body)
  document.documentElement.style.setProperty('--start-color', style.backgroundColor);
  const endColor = ref('')
  switch (value.value) {
    case 'CloudMusic':
      // document.body.style.animation = 'none'
      // document.body.style.backgroundColor = '#a31a18'
      endColor.value = '#a31a18'
      break
    case 'QQMusic':
      // document.body.style.animation = 'none'
      // document.body.style.backgroundColor = '#179a5e'
      // document.body.style.backgroundImage = 'linear-gradient(-45deg, #caaf00 0%, #179a5e 100%)'
      endColor.value = '#179a5e'
      break
    case 'KugouMusic':
      // document.body.style.animation = 'none'
      // document.body.style.backgroundColor = '#006acc'
      endColor.value = '#006acc'
      break
    case 'KuwoMusic':
      // document.body.style.animation = 'none'
      // document.body.style.backgroundColor = '#ccba36'
      // document.body.style.backgroundImage = 'linear-gradient(-45deg, #ccba36 0%, #cc4e00 100%)'
      endColor.value = '#ccba36'
      break
    default:
      return;
  }
  changeLogo(value.value)
  document.documentElement.style.setProperty('--end-color', endColor.value);
  document.documentElement.style.setProperty('--background-end-color', endColor.value);
  document.body.style.animation = value.value + 'FadeIn 0.8s ease'
}

function resetBackgroundColor() {
  changeLogo('')
  const body = document.body;
  const style = window.getComputedStyle(body)
  document.documentElement.style.setProperty('--start-color', style.backgroundColor);
  document.documentElement.style.setProperty('--end-color', '#caaf00');
  document.body.style.animation = 'fadeOut 0.8s ease'
  setTimeout(() => {
    document.body.style.animation = 'gradientTransition 20s ease infinite'
  }, 800);
}

const loading = ref(null)

const fullscreenLoading = () => {
  loading.value = ElLoading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0,0,0,0.7)',
  })
}

function nextStep() {
  if (value.value === '') {
    makeNoti('请选择歌单来源', '', 'warning')
    return
  }
  fullscreenLoading()
  axios({
    method: 'get',
    url: '/init',
    params: {
      source: value.value
    }
  }).then(backEnd => {
    loading.value.close()
    next();
  }).catch(err => {
    makeNoti('初始化失败', "错误详情：" + err.response.data.msg, 'error')
    loading.value.close()
  })
}

const makeNoti = (title: string, message: string, type: string) => {
  ElNotification({
    title: title,
    message: message,
    type: type + '',
    customClass: 'notification' + type.slice(0, 1).toUpperCase() + type.slice(1).toLowerCase(),
    duration: 5000,
  })
}
</script>

<template>
  <el-row style="margin-top: -10vh">
    <el-col>
      <el-text style="font-size:6vh;color: white;">请选择歌单来源</el-text>
      <br>
      <div align="center">
        <el-select v-model="value" clearable placeholder="请选择" size="large"
                   style="margin-top: 25px; width: 20vh;" @change="setBackgroundColor()"
                   @clear="resetBackgroundColor()">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
        </el-select>
        <br>
        <el-button size="large" style="font-size: large; margin-top: 25px; width: 10vh;" type="primary"
                   @click="nextStep()">下一步
        </el-button>
      </div>
    </el-col>
  </el-row>
</template>

<style>
body {
  overflow: hidden;
}

</style>