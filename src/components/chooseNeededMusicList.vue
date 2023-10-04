<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import axios from "axios";


const table = ref(null)
const tableData = ref([])

function handleRowClick(row, column, event) {
  table.value.toggleRowSelection(row);
}

function getTableData() {
  axios({
    method: 'GET',
    url: '/databaseSummary'
  }).then(backEnd => {
    console.log(backEnd.data)
    for (const id in backEnd.data.playListInfo) {
      tableData.value.push({
        playListId: id,
        playListName: backEnd.data.playListInfo[id][0],
        songNum: backEnd.data.playListInfo[id][1]
      })
    }
  }).catch(err => {
    console.log(err)
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
    console.log('请选择至少一个歌单')
    return
  }
  selectedRows.value = selectedRowsTemp.value
  next()
}

const props = defineProps({
  source: String
})

const emit = defineEmits(["next"]);

function next() {
  emit("next", props.source, 1);
}

</script>

<template>

  <el-row style="margin-top: -10vh">
    <el-col style="text-align: center">
      <el-text style="font-size:6vh;color: white;">请选择您需要转换的歌单</el-text>
      <br>
      <div align="center">

        <div style="width: 70vw;margin-top: 25px;">
          <el-table
              ref="table"
              :data="tableData"
              border fit max-height="350"
              row-style="cursor: pointer;background-color: transparent;" style="width: 100%; border-radius: 10px;"
              table-layout="auto"
              @row-click="handleRowClick"
              @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50"/>
            <el-table-column label="序号" type="index" width="55"/>
            <el-table-column label="歌单名" prop="playListName" show-overflow-tooltip sortable/>
            <el-table-column label="歌曲数量" prop="songNum" sortable width="110"/>
          </el-table>

        </div>
        <!--        <transition name="button-exchange" mode="out-in">-->
        <!--          <el-button v-if="!success" id="upload" size="large" key="1"-->
        <!--                     style="font-size: large; margin-top: 25px; width: 10vh;" type="primary" @click="submitUpload">上传-->
        <!--          </el-button>-->
        <el-button id="nextStep" key="2" size="large"
                   style="font-size: large; margin-top: 25px; width: 10vh;" type="primary" @click="saveSelection">下一步
        </el-button>
        <!--        </transition>-->
      </div>
    </el-col>
  </el-row>

</template>

<style scoped>


</style>