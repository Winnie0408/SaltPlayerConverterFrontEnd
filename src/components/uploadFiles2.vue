<script lang="ts" setup>
import {computed, ref} from 'vue'
import {ElNotification, genFileId, UploadInstance, UploadProps, UploadRawFile} from "element-plus";
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

function showLoadingSpinner(show: boolean) {
  emit("showLoadingSpinner", show)
}

function uploadMusicList(file: UploadRawFile) {
  file = file.file
  if (file.size > 1024 * 1024 * 20) {
    makeNoti('文件大小超出限制 (20MiB)', '请重新选择', 'warning')
    return
  }
  showLoadingSpinner(true)
  const formData = new FormData()
  formData.append('databaseFile', file)
  axios({
    method: 'POST',
    url: '/uploadDatabase',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(backEnd => {
    makeNoti('上传成功', '点击 下一步 以继续', 'success')
    success.value = true
    showLoadingSpinner(false)
  }).catch(err => {
    makeNoti('上传失败，请重试', '错误详情：' + err.response.data.msg, 'error')
    showLoadingSpinner(false)
  })
}

function handleSelect(file: UploadRawFile) {
  tips.value = '您已选择文件：' + file.name + "，"
  tips2.value = '点击重新上传'
  isUpload.value = true
}

const props = defineProps({
  source: String
})

const getDbName = computed(() => {
  switch (props.source) {
    case 'QQMusic':
      return 'QQMusic'
    case 'CloudMusic':
      return 'cloudmusic.db'
    case 'KugouMusic':
      return 'kugou_music_phone_v7.db'
    case 'KuwoMusic':
      return 'kwplayer.db'
    default:
      return '？'
  }
})

const emit = defineEmits(["next", "showLoadingSpinner"]);

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
    <el-col style="text-align: center">
      <div style="margin-top: 25px">
        <el-text style="font-size:6vh;color: white;">请上传我们所需要的文件</el-text>
        <p style="margin-top: 2px"></p>
        <el-text style="text-align: center;font-size:3vh;color: white;">数据库：{{ getDbName }}</el-text>
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