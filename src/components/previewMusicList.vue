<script lang="ts" setup>

import {nextTick, onMounted, ref} from "vue";
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
const dialogVisibleModify = ref([])
const dialogVisibleDelete = ref([])
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
      dialogVisibleModify.value.push(false)
      dialogVisibleDelete.value.push(false)
    }
    // unfoldNotMatched()
  }).catch(err => {
    console.log(err)
  })
}

function unfoldNotMatched() {
  tableSimpleData.value.forEach(row => {
    if (row.autoMatched === 'false') {
      tableSimple.value.toggleRowExpansion(row)
    }
  })
}

function unfoldAll() {
  tableSimpleData.value.forEach(row => {
    tableSimple.value.toggleRowExpansion(row, true)
  })
}

function foldAll() {
  tableSimpleData.value.forEach(row => {
    tableSimple.value.toggleRowExpansion(row, false)
  })
}

const toggleRowExpansion = (row) => {
  tableSimple.value.toggleRowExpansion(row);
}

function rowStyle() {
  return 'cursor: pointer;'
}

const modifyRow = ref(-1)
const deleteRow = ref(-1)

const queryInput = ref('')

const querySearchAsync = (queryString, cb) => {
  axios({
    method: 'GET',
    url: '/searchLocalMusic',
    params: {
      queryString: queryString
    }
  }).then(backEnd => {
    console.log(backEnd.data)
    cb(backEnd.data)
  }).catch(err => {
    console.log(err)
  })
}

const manualSelectMusicId = ref(-1)

const handleSelect = (item) => {
  manualSelectMusicId.value = item.musicId
}

function saveManualMatch(rowIndex: number) {
  if (queryInput.value.includes(' - ')) {
    tableDetailedData.value[modifyRow.value].localMusic = queryInput.value.split(' - ')[0]
    tableDetailedData.value[modifyRow.value].similarity = "手动匹配"

    tableDetailedData.value[modifyRow.value + 1].localMusic = queryInput.value.split(' - ')[1]
    tableDetailedData.value[modifyRow.value + 1].similarity = "手动匹配"

    tableDetailedData.value[modifyRow.value + 2].localMusic = queryInput.value.split(' - ')[2]
    tableDetailedData.value[modifyRow.value + 2].similarity = "手动匹配"

    tableSimpleData.value[modifyRow.value / 3].autoMatched = "manual"
    dialogVisibleModify.value[rowIndex] = false;
  }
}

const deleteAll = ref(false)

function handleDelete(rowIndex: number) {
  tableSimpleData.value.splice(deleteRow.value / 3, 1)
  tableDetailedData.value.splice(deleteRow.value, 3)
  if (deleteAll.value) {
    for (const i = ref(0); i.value < tableSimpleData.value.length; i.value++) {
      if (tableSimpleData.value[i.value].autoMatched === 'false') {
        tableSimpleData.value.splice(i.value, 1)
        tableDetailedData.value.splice(i.value * 3, 3)
        i.value--
      }
    }
  }
  dialogVisibleDelete.value[rowIndex] = false;
}

function jumpToNextFailItem() {
  tableSimple.value.clearSort()
  for (const i = ref(0); i.value < tableSimple.value.data.length; i.value++) {
    if (tableSimple.value.data[i.value].autoMatched === 'false') {
      tableSimple.value.toggleRowExpansion(tableSimple.value.data[i.value], true)
      nextTick(() => {
        // tableSimple.value.setScrollTop(i.value * tableSimple.value.$el.querySelector('tbody tr').clientHeight)
        tableSimple.value.scrollTo({top: i.value * tableSimple.value.$el.querySelector('tbody tr').clientHeight, behavior: 'smooth'})
      })
      return
    }
  }
}
</script>

<template>
  <el-row :gutter="20" style="margin-top: -10vh;width: 98%; align-items: center">
    <el-col :span="8" style="text-align: center;">
      <!--      <el-text style="font-size:5vh;color: white;">请预览转换结果</el-text>-->
      <!--      <br>-->
      <div style="width: 100%;border-radius: 10px;background-color: white;height: 450px;">
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
        <el-row align="middle" justify="center" style="margin-top: 20px" type="flex">
          <el-text style="margin-right: 15px; font-size: 2vh">启用括号去除</el-text>
          <el-switch
              v-model="enableParenthesesRemoval"
              :active-icon="Check"
              :inactive-icon="Close"
              inline-prompt
              size="large"
              style="margin-left: 17px"/>
        </el-row>
        <el-row align="middle" justify="center" style="margin-top: 10px" type="flex">
          <el-text style="margin-right: 15px;font-size: 2vh">启用歌手名匹配</el-text>
          <el-switch
              v-model="enableArtistNameMatch"
              :active-icon="Check"
              :inactive-icon="Close"
              inline-prompt
              size="large"/>
        </el-row>
        <el-row align="middle" justify="center" style="margin-top: 10px" type="flex">
          <el-text style="margin-right: 15px;font-size: 2vh">启用专辑名匹配</el-text>
          <el-switch
              v-model="enableAlbumNameMatch"
              :active-icon="Check"
              :inactive-icon="Close"
              inline-prompt
              size="large"/>
        </el-row>
        <el-button size="large" style="font-size: large; margin-top: 25px;margin-bottom: 15px; width: 10vw;"
                   type="primary"
                   @click="getData">
          预览结果
        </el-button>
      </div>

      <!--        <el-button id="nextStep" key="2" size="large"-->
      <!--                   style="font-size: large; margin-top: 25px; width: 10vh;" type="primary" @click="saveSelection">下一步-->
      <!--        </el-button>-->
    </el-col>
    <el-col :span="16" style="text-align: center;z-index: 1;">
      <div align="center" style="width: 100%;border-radius: 10px;background-color: white;margin-top: 50px">
        <div style="background-color: lightgray; border-top-left-radius: 10px; border-top-right-radius: 10px;">
          <el-text style="font-size: 3vh;">转 换 结 果</el-text>
        </div>

        <el-table
            ref="tableSimple"
            :data="tableSimpleData"
            :row-style="rowStyle"
            border fit
            max-height="450" style="width: 100%; border-radius: 10px;font-size: 16px;"
            table-layout="auto"
            @row-click="toggleRowExpansion">
          <el-table-column type="expand">
            <template #default="props">
              <div style="margin-left: 25px;margin-right: 25px;">
                <el-text style="font-size: 2vh; font-weight: bold">匹配详情</el-text>
                <el-button icon="Delete" style="font-size: 1.8vh; float: right;" type="danger"
                           @click="dialogVisibleDelete[tableSimpleData.indexOf(props.row)]=true;deleteAll=false;deleteRow=tableSimpleData.indexOf(props.row)*3">
                  放弃
                </el-button>

                <el-dialog
                    v-model="dialogVisibleDelete[tableSimpleData.indexOf(props.row)]"
                    align-center
                    append-to-body
                    style="border-radius: 10px"
                    title="确认要放弃匹配这首歌吗？"
                    width="40%">

                  <el-text style="font-size: 1.2vw;margin-top: 15px">当前歌曲：</el-text>
                  <br>
                  <el-text style="font-size: 1.2vw;margin-top: 15px">歌名：{{ tableDetailedData[deleteRow].source }}
                  </el-text>
                  <br>
                  <el-text style="font-size: 1.2vw;margin-top: 15px">歌手：{{
                      tableDetailedData[deleteRow + 1].source
                    }}
                  </el-text>
                  <br>
                  <el-text style="font-size: 1.2vw;margin-top: 15px">专辑：{{
                      tableDetailedData[deleteRow + 2].source
                    }}
                  </el-text>
                  <br><br>

                  <el-text style="margin-right: 15px;font-size: 2vh">放弃当前歌单所有匹配失败的歌曲</el-text>
                  <el-switch
                      v-model="deleteAll"
                      :active-icon="Check"
                      :inactive-icon="Close"
                      inline-prompt
                      size="large"/>

                  <template #footer>
                    <span class="dialog-footer">
                      <el-button
                          @click="dialogVisibleDelete[tableSimpleData.indexOf(props.row)] = false">取消</el-button>
                      <el-button type="primary" @click="handleDelete(tableSimpleData.indexOf(props.row));">
                        确定
                      </el-button>
                    </span>
                  </template>

                </el-dialog>

                <el-button icon="Edit" style="font-size: 1.8vh; float: right; margin-right: 5px" type="primary"
                           @click="dialogVisibleModify[tableSimpleData.indexOf(props.row)] = true; modifyRow = tableSimpleData.indexOf(props.row) * 3; manualSelectMusicId = -1; queryInput=''">
                  修改
                </el-button>
                <el-dialog
                    v-model="dialogVisibleModify[tableSimpleData.indexOf(props.row)]"
                    align-center
                    append-to-body
                    style="border-radius: 10px"
                    title="修改匹配结果"
                    width="40%">
                  <el-text style="font-size: 1.2vw;margin-top: 15px">当前歌曲：</el-text>
                  <br>
                  <el-text style="font-size: 1.2vw;margin-top: 15px;cursor: pointer"
                           @click="queryInput+=tableDetailedData[modifyRow].source">
                    歌名：{{ tableDetailedData[modifyRow].source }}
                  </el-text>
                  <br>
                  <el-text style="font-size: 1.2vw;margin-top: 15px;cursor:pointer;"
                           @click="queryInput+=tableDetailedData[modifyRow+1].source">歌手：{{
                      tableDetailedData[modifyRow + 1].source
                    }}
                  </el-text>
                  <br>
                  <el-text style="font-size: 1.2vw;margin-top: 15px;cursor: pointer"
                           @click="queryInput+=tableDetailedData[modifyRow+2].source">专辑：{{
                      tableDetailedData[modifyRow + 2].source
                    }}
                  </el-text>
                  <br>
                  <el-text style="font-size: 1.2vw;margin-top: 15px">点击文字可直接将其输入
                  </el-text>
                  <br>
                  <el-autocomplete
                      v-model="queryInput"
                      :debounce=500
                      :fetch-suggestions="querySearchAsync"
                      clearable
                      placeholder="搜索您的曲库..."
                      style="width: 60%; font-size: 30px"
                      @select="handleSelect">
                  </el-autocomplete>

                  <template #footer>
                    <span class="dialog-footer">
                      <el-button
                          @click="dialogVisibleModify[tableSimpleData.indexOf(props.row)] = false">取消</el-button>
                      <el-button type="primary" @click="saveManualMatch(tableSimpleData.indexOf(props.row));">
                        确定
                      </el-button>
                    </span>
                  </template>

                </el-dialog>
                <p></p>
                <el-table
                    ref="tableDetailed"
                    :data="tableDetailedData.slice(tableSimpleData.indexOf(props.row) * 3, tableSimpleData.indexOf(props.row) * 3 + 3)"
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
              <el-tag v-else-if="scope.row.autoMatched === 'false'" style="font-size: 17px; width: 40px;" type="danger">
                否
              </el-tag>
              <el-tag v-else-if="scope.row.autoMatched === 'manual'" style="font-size: 17px; width: 90px;">手动匹配
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column v-if="false" label="歌曲ID" prop="songId"></el-table-column>
        </el-table>
        <el-button size="large" style="font-size: 16px;margin-top: 15px;margin-bottom: 15px;margin-right: 10px"
                   type="info"
                   @click="unfoldAll">展开所有项
        </el-button>
        <el-button size="large" style="font-size: 16px;margin-top: 15px;margin-bottom: 15px;margin-right: 10px"
                   type="info"
                   @click="foldAll">收起所有项
        </el-button>
        <el-button size="large" style="font-size: 16px;margin-top: 15px;margin-bottom: 15px;margin-right: 10px"
                   type="info"
                   @click="unfoldNotMatched">展开所有匹配失败的项
        </el-button>
        |
        <el-button size="large" style="font-size: 16px;margin-top: 15px;margin-bottom: 15px" type="primary"
                   @click="jumpToNextFailItem">跳转并展开下一匹配失败的项
        </el-button>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>

</style>