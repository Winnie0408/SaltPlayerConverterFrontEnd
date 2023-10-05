<script lang="ts" setup>

import {onMounted, ref} from "vue";
import {Check, Close} from '@element-plus/icons-vue'
import axios from "axios";

const props = defineProps({
  source: String,
  selectedMusicList: Array
})

const emit = defineEmits(["next"]);


function next() {
  emit("next", props.source, 1);
}

const selectedMusicList = ref([])
const selectedMusicListCount = ref(0)
const progress = ref(0)

onMounted(() => {
  selectedMusicList.value = props.selectedMusicList
  selectedMusicListCount.value = selectedMusicList.value.length
})

const tableSimple = ref(null)
const tableDetailed = ref(null)
const tableSimpleData = ref([])
const tableDetailedData = ref([])
const enableParenthesesRemoval = ref(false)
const enableArtistNameMatch = ref(true)
const enableAlbumNameMatch = ref(true)
const similarity = ref(85)
const sourceChn = ref('歌单来源')

function getData() {
  tableSimple.value = null
  tableDetailed.value = null
  tableSimpleData.value = []
  tableDetailedData.value = []
  console.log('111' + enableParenthesesRemoval.value)
  console.log('222' + enableArtistNameMatch.value)
  console.log('333' + enableAlbumNameMatch.value)
  axios({
    method: 'GET',
    url: '/attemptConvert',
    params: {
      similarityF: similarity.value,
      enableParenthesesRemovalF: enableParenthesesRemoval.value,
      enableArtistNameMatchF: enableArtistNameMatch.value,
      enableAlbumNameMatchF: enableAlbumNameMatch.value,
      playlistId: selectedMusicList.value[progress.value].playListId
    }
  }).then(backEnd => {
    console.log(backEnd.data)
    sourceChn.value = backEnd.data.sourceChn
    for (const count = ref(0); count.value < backEnd.data.total; count.value++) {
      tableDetailedData.value.push({
        type: "歌名",
        source: backEnd.data[count.value][1][0],
        localMusic: backEnd.data[count.value][1][1],
        similarity: backEnd.data[count.value][1][2]
      })
      tableDetailedData.value.push({
        type: "歌手",
        source: backEnd.data[count.value][2][0],
        localMusic: backEnd.data[count.value][2][1],
        similarity: backEnd.data[count.value][2][2]
      })
      tableDetailedData.value.push({
        type: "专辑",
        source: backEnd.data[count.value][3][0],
        localMusic: backEnd.data[count.value][3][1],
        similarity: backEnd.data[count.value][3][2]
      })
      tableSimpleData.value.push({
        index: count.value,
        songName: backEnd.data[count.value][1][0],
        songArtist: backEnd.data[count.value][2][0],
        songAlbum: backEnd.data[count.value][3][0],
        autoMatched: backEnd.data[count.value][0][0],
        songId: backEnd.data[count.value][0][1]
      })
    }
  }).catch(err => {
    console.log(err)
  })
}

const toggleRowExpansion = (row) => {
  tableSimple.value.toggleRowExpansion(row);
}

function rowStyle() {
  return 'cursor: pointer;'
}
</script>

<template>
  <el-row :gutter="15" style="margin-top: -10vh;width: 98%">
    <el-col :span="8" style="text-align: center">
      <!--      <el-text style="font-size:5vh;color: white;">请预览转换结果</el-text>-->
      <!--      <br>-->
      <div style="width: 100%;border-radius: 10px;background-color: white;">
        <div style="background-color: lightgray; border-top-left-radius: 10px; border-top-right-radius: 10px;">
          <p style="height: 1px;"></p>
          <el-text style="font-size: 2vh;">当前歌单名：{{ props.selectedMusicList[progress].playListName }}</el-text>
          <br>
          <el-text style="font-size: 2vh;">包含歌曲：{{ props.selectedMusicList[progress].songNum }}首
          </el-text>
          <p style="height: 1px;"></p>
        </div>
        <el-text style="font-size: 2.8vh;">转 换 配 置</el-text>
        <p></p>
        <div align="center">
          <el-text style="font-size: 2vh;margin-top: 10px;">相似度阈值</el-text>
          <br>
          <el-slider v-model="similarity" show-input size="large"
                     style="margin-top: 10px; width: 90%"/>
        </div>
        <el-row align="middle" justify="center" style="margin-top: 10px" type="flex">
          <el-text style="margin-right: 15px; font-size: 2vh">启用括号去除</el-text>
          <el-switch
              v-model="enableParenthesesRemoval"
              :active-icon="Check"
              :inactive-icon="Close"
              inline-prompt
              size="large"
              style="margin-left: 17px"/>
        </el-row>
        <el-row align="middle" justify="center" type="flex">
          <el-text style="margin-right: 15px;font-size: 2vh">启用歌手名匹配</el-text>
          <el-switch
              v-model="enableArtistNameMatch"
              :active-icon="Check"
              :inactive-icon="Close"
              inline-prompt
              size="large"/>
        </el-row>
        <el-row align="middle" justify="center" type="flex">
          <el-text style="margin-right: 15px;font-size: 2vh">启用专辑名匹配</el-text>
          <el-switch
              v-model="enableAlbumNameMatch"
              :active-icon="Check"
              :inactive-icon="Close"
              inactive-text="启用专辑名匹配"
              inline-prompt
              size="large"/>
        </el-row>
        <el-button size="large" style="font-size: large; margin-top: 15px;margin-bottom: 15px; width: 10vw;"
                   type="primary"
                   @click="getData">
          预览结果
        </el-button>
      </div>

      <!--        <el-button id="nextStep" key="2" size="large"-->
      <!--                   style="font-size: large; margin-top: 25px; width: 10vh;" type="primary" @click="saveSelection">下一步-->
      <!--        </el-button>-->
    </el-col>
    <el-col :span="16" style="text-align: center">
      <div align="center" style="width: 100%;border-radius: 10px;background-color: white;margin-top: 15px">
        <div style="background-color: lightgray; border-top-left-radius: 10px; border-top-right-radius: 10px;">
          <el-text style="font-size: 3vh;">转 换 结 果</el-text>
        </div>

        <el-table
            ref="tableSimple"
            :data="tableSimpleData"
            :row-style="rowStyle"
            border
            fit max-height="500" style="width: 100%; border-radius: 10px;font-size: 16px"
            table-layout="auto"
            @row-click="toggleRowExpansion">
          <el-table-column type="expand">
            <template #default="props">
              <div style="margin-left: 25px;margin-right: 25px;">
                <el-text style="font-size: 2vh; font-weight: bold">匹配详情</el-text>
                <p></p>
                <el-table
                    ref="tableDetailed"
                    :data="tableDetailedData.slice(props.$index * 3, props.$index * 3 + 3)"
                    border
                    fit max-height="500" style="width: 100%; font-size: 16px;margin-bottom: 15px"
                    table-layout="auto">
                  <el-table-column align="center" label="类型" prop="type" width="60"></el-table-column>
                  <el-table-column :label="sourceChn" prop="source" show-overflow-tooltip sortable></el-table-column>
                  <el-table-column label="本地音乐" prop="localMusic" show-overflow-tooltip
                                   sortable></el-table-column>
                  <el-table-column align="center" label="相似度" prop="similarity" sortable
                                   width="100"></el-table-column>
                </el-table>
              </div>
            </template>

          </el-table-column>
          <el-table-column align="center" label="序号" type="index" width="60"></el-table-column>
          <el-table-column label="歌名" prop="songName" show-overflow-tooltip sortable></el-table-column>
          <el-table-column label="歌手" prop="songArtist" show-overflow-tooltip sortable></el-table-column>
          <el-table-column label="专辑" prop="songAlbum" show-overflow-tooltip sortable></el-table-column>
          <el-table-column align="center" label="自动匹配成功" prop="autoMatched" sortable
                           width="145">
            <template #default="scope">
              <!--              <el-icon color="green" v-if="scope.row.autoMatched==='true'" style="font-size: 20px">-->
              <!--                <Check/>-->
              <!--              </el-icon>-->
              <!--              <el-icon color="red" v-else>-->
              <!--                <Close/>-->
              <!--              </el-icon>-->
              <el-tag v-if="scope.row.autoMatched === 'true'" style="font-size: 17px;width: 40px;" type="success">是
              </el-tag>
              <el-tag v-else style="font-size: 17px; width: 40px;" type="danger">否</el-tag>
            </template>
          </el-table-column>
          <el-table-column v-if="false" label="歌曲ID" prop="songId"></el-table-column>
        </el-table>

      </div>
    </el-col>
  </el-row>
</template>

<style scoped>

</style>