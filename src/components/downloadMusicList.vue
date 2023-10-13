<script lang="ts" setup>
import axios from "axios";
import {ref} from "vue";
import {ElNotification} from "element-plus";
import JSConfetti from 'js-confetti'

const props = defineProps({
  source: String,
})

const emit = defineEmits(["next", "showLoadingSpinner", "hideBackButton"]);

function next() {
  emit("next", props.source, 1);
}

function showLoadingSpinner(show: boolean) {
  emit("showLoadingSpinner", show)
}

function hideBackButton() {
  emit("hideBackButton")
}

const showDownload = ref(true)
const title = ref('就快完成了！')
const message = ref('请点击按钮，下载转换结果')

async function downloadAll() {
// 该方法无法唤起第三方下载器（？）
  showLoadingSpinner(true)
  await axios.get(axios.getUri() + "/downloadAll", {
    responseType: 'blob',
  }).then(backEnd => {
    showLoadingSpinner(false)
    const blob = new Blob([backEnd.data], {type: backEnd.headers['content-type']});
    const objectUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = '转换结果.zip';
    document.body.appendChild(link);
    link.click(); // 模拟点击链接来下载文件
    document.body.removeChild(link);
    makeNoti('成功发起下载请求', '', 'success')
    next()
    showDownload.value = false
    title.value = "🎉 恭喜！您已完成所有操作"
    message.value = ""
    showConfetti()
  }).catch(err => {
    showLoadingSpinner(false)
    switch (err.response.status) {
      case 403:
        makeNoti('下载失败', '请先完成初始化', 'error')
        break;
      case 404:
        makeNoti('下载失败', '您似乎没有对任何歌单进行转换操作', 'error')
        break;
      default:
        makeNoti('下载失败', '', 'error')
    }
  });
}

function deleteAll() {
  showLoadingSpinner(true)
  hideBackButton()
  axios.delete("/deleteAll").then(backEnd => {
    showLoadingSpinner(false)
    makeNoti('删除成功', '', 'success')
  }).catch(err => {
    showLoadingSpinner(false)
    makeNoti('删除失败', '错误详情：' + err.response.data.msg, 'error')
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

function refresh() {
  window.location.reload()
}

const confetti = new JSConfetti()

function showConfetti() {
  if (message.value === '')
    confetti.addConfetti()
}
</script>

<template>
  <el-row style="margin-top: -10vh">
    <el-col>
      <el-text style="font-size:6vh;color: white;cursor: pointer;user-select: none" @click="showConfetti">{{
          title
        }}
      </el-text>
      <div style="margin-top: 25px;text-align: center">
        <el-text style="font-size:3vh;color: white;">{{ message }}</el-text>
      </div>

      <div align="center">
        <transition mode="out-in" name="button-exchange">
          <el-button v-if="showDownload" size="large" style="font-size: large; margin-top: 25px; width: 18vh;"
                     type="primary"
                     @click="downloadAll">
            下载转换结果
          </el-button>
          <div v-else>
            <el-button size="large" style="font-size: large; margin-top: 25px; width: 18vh;margin-right: 20px"
                       type="primary"
                       @click="refresh">
              开始新的转换
            </el-button>
            <el-button size="large" style="font-size: large; margin-top: 25px; width: 25vh;" type="danger"
                       @click="deleteAll">
              删除您的数据与文件
            </el-button>
          </div>
        </transition>
      </div>
    </el-col>
  </el-row>

</template>

<style scoped>
.button-exchange-enter-active {
  animation-name: fadeIn;
  animation-duration: 0.25s;
}


.button-exchange-leave-active {
  animation: fadeOut 0.25s;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>