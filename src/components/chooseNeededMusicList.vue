<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import axios from "axios";
import {ElNotification} from "element-plus";


const table = ref(null)
const tableData = ref([])
const loading = ref(true)

function handleRowClick(row, column, event) {
  table.value.toggleRowSelection(row);
}

function getTableData() {
  axios({
    method: 'GET',
    url: '/databaseSummary'
  }).then(backEnd => {
    for (const id in backEnd.data.playListInfo) {
      tableData.value.push({
        playListId: id,
        playListName: backEnd.data.playListInfo[id][0],
        songNum: backEnd.data.playListInfo[id][1]
      })
    }
    loading.value = false
  }).catch(err => {
    makeNoti('获取歌单信息失败，请重试', '错误详情：' + err.response.data.msg, 'error')
    loading.value = false
  })
}

onMounted(() => {
  getTableData()
})

const selectedRowsTemp = ref([]) // 临时存储选中行的数据

const handleSelectionChange = (selected) => {
  selectedRowsTemp.value = selected
}

const selectedRows = ref([]) // 存储选中行的数据
//selectedRows[2].playListId

function saveSelection() {
  if (selectedRowsTemp.value.length === 0) {
    makeNoti('请选择至少一个歌单', '', 'error')
    return
  }
  selectedRows.value = selectedRowsTemp.value
  emit("saveSelectedMusicList", selectedRows.value);
  next()
}

const props = defineProps({
  source: String
})

const emit = defineEmits(["next", "saveSelectedMusicList"]);

function next() {
  emit("next", props.source, 1);
}

function rowStyle() {
  return 'cursor: pointer;'
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
      <el-text style="font-size:6vh;color: white;">请选择您需要转换的歌单</el-text>
      <br>
      <div align="center">

        <div style="width: 55vw;margin-top: 25px;border-radius: 10px;">
          <el-table
              ref="table"
              v-loading="loading"
              :data="tableData"
              :row-style="rowStyle"
              border empty-text="暂无数据"
              fit max-height="350"
              style="width: 100%; border-radius: 10px;font-size: 16px"
              table-layout="auto"
              @row-click="handleRowClick"
              @selection-change="handleSelectionChange">
            <el-table-column align="center" fixed="left" type="selection" width="50"/>
            <el-table-column align="center" label="序号" type="index" width="60"/>
            <el-table-column label="歌单名" prop="playListName" show-overflow-tooltip sortable/>
            <el-table-column label="歌曲数量" prop="songNum" sortable width="115"/>
          </el-table>

        </div>
        <el-button id="nextStep" size="large"
                   style="font-size: large; margin-top: 25px; width: 10vh;" type="primary" @click="saveSelection">下一步
        </el-button>
      </div>
    </el-col>
  </el-row>

</template>

<style scoped>
::v-deep .el-table__body .el-table__row.hover-row td {
  background-color: rgba(110, 110, 110, 0.20) !important;
}

</style>