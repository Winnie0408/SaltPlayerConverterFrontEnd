<script lang="ts" setup>
import axios from "axios";

const props = defineProps({
  source: String,
})

const emit = defineEmits(["next"]);

function next() {
  emit("next", props.source, 1);
}

function downloadAll() {
  window.open(axios.getUri() + "/downloadAll")
}
</script>

<template>
  <el-row style="margin-top: -10vh">
    <el-col>
      <el-text style="font-size:6vh;color: white;">就快完成了！</el-text>
      <div style="margin-top: 25px;text-align: center">
        <el-text style="font-size:3vh;color: white;">请点击按钮，下载转换结果</el-text>
      </div>

      <div align="center">
        <el-button size="large" style="font-size: large; margin-top: 25px; width: 10vh;" type="primary"
                   @click="downloadAll">
          下载
        </el-button>
      </div>
    </el-col>
  </el-row>

</template>

<style scoped>

</style>