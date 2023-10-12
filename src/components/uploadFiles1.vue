<script lang="ts" setup>
import {ref} from 'vue'
import {ElLoading, ElNotification, genFileId, UploadInstance, UploadProps, UploadRawFile} from "element-plus";
import axios from "axios";
import {UploadFilled} from "@element-plus/icons-vue";

const upload = ref<UploadInstance>()
const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  makeNoti('文件数量超出限制', '将替换之前上传的文件', 'info')
  success.value = false
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
  tips.value = '您已选择文件：' + file.name + "，"
  tips2.value = '点击重新上传'
}

const isUpload = ref(false)
const submitUpload = () => {
  if (!isUpload.value) {
    makeNoti('请选择文件', '', 'warning')
    return
  }
  upload.value!.submit()
}

const tips = ref('将文件拖到此处，或')
const tips2 = ref('点击上传')
const success = ref(false)

const loading = ref(null)

const fullscreenLoading = () => {
  loading.value = ElLoading.service({
    lock: true,
    text: '上传中...',
    background: 'rgba(0,0,0,0.7)',
  })
}

function uploadMusicList(file: UploadRawFile) {
  file = file.file
  if (file.size > 1024 * 1024 * 5) {
    makeNoti('文件大小超出限制 (5MiB)', '请重新选择', 'warning')
    return
  }
  fullscreenLoading()
  const formData = new FormData()
  formData.append('musicList', file)
  axios({
    method: 'POST',
    url: '/uploadMusicList',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(backEnd => {
    makeNoti('上传成功', '点击 下一步 以继续', 'success')
    success.value = true
    loading.value.close()
  }).catch(err => {
    makeNoti('上传失败，请重试', '错误详情：' + err.response.data.msg, 'error')
    loading.value.close()
  })
}

function handleSelect(file: UploadRawFile) {
  tips.value = '您已选择文件：' + file.name + "，"
  tips2.value = '点击重新上传'
  isUpload.value = true
}

const emit = defineEmits(["next"]);

const props = defineProps({
  source: String
})

function next() {
  emit("next", props.source, 1);
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
      <div style="margin-top: 25px;text-align: center">
        <el-text style="font-size:6vh;color: white;">请上传我们所需要的文件</el-text>
        <p style="margin-top: 2px"></p>
        <el-text style="font-size:3vh;color: white;">歌曲列表：本地音乐导出.txt</el-text>
      </div>
      <div align="center">
        <el-upload
            ref="upload"
            :auto-upload="false"
            :http-request="uploadMusicList"
            :limit="1"
            :on-change="handleSelect"
            :on-exceed="handleExceed"
            :show-file-list="false"
            action=""
            drag
            style="margin-top: 25px;">
          <el-icon class="el-icon-upload" style="font-size: 50px;margin-bottom: 10px;color: rgb(128,128,128);">
            <upload-filled/>
          </el-icon>
          <div class="el-upload__text" style="text-align: center;font-size: large;">{{ tips }}<em>{{ tips2 }}</em>
          </div>
        </el-upload>
        <transition mode="out-in" name="button-exchange">
          <el-button v-if="!success" id="upload" key="1" size="large"
                     style="font-size: large; margin-top: 25px; width: 10vh;" type="primary" @click="submitUpload">上传
          </el-button>
          <el-button v-else id="nextStep" key="2" size="large"
                     style="font-size: large; margin-top: 25px; width: 10vh;" type="primary" @click="next()">下一步
          </el-button>
        </transition>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>
body {
  overflow: hidden;
}

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