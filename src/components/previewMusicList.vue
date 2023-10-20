<script lang="ts" setup>
import {ElCollapseTransition, ElNotification} from 'element-plus'
import {nextTick, onMounted, ref} from "vue";
import {Check, Close, QuestionFilled} from '@element-plus/icons-vue'
import axios from "axios";

const props = defineProps({
  source: String,
  selectedMusicList: Array
})

const emit = defineEmits(["next", "showLoadingSpinner"]);

function next() {
  emit("next", props.source, 1);
}

const selectedMusicList = ref([])
const selectedMusicListCount = ref(0)
const progress = ref(0)

const enableParenthesesRemoval = ref(false)
const enableArtistNameMatch = ref(true)
const enableAlbumNameMatch = ref(true)
const similarity = ref(85)
const sourceChn = ref('歌单来源')

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
const collapseTransition = ref([])
const dialogVisibleSave = ref(false)
const dialogVisibleSkip = ref(false)
const dialogVisibleFinish = ref(false)
const successNum = ref(0)
const modeSaved = ref('')

const loading = ref(false)

function getConvertResult() {
  loading.value = true
  successNum.value = 0
  tableSimple.value = null
  tableDetailed.value = null
  tableSimpleData.value = []
  tableDetailedData.value = []
  modeSaved.value = mode.value
  const modeF = mode.value === '分离匹配' ? 'true' : 'false'
  axios({
    method: 'GET',
    url: '/attemptConvert',
    params: {
      similarityF: similarity.value,
      enableParenthesesRemovalF: enableParenthesesRemoval.value,
      enableArtistNameMatchF: enableArtistNameMatch.value,
      enableAlbumNameMatchF: enableAlbumNameMatch.value,
      playlistId: selectedMusicList.value[progress.value].playListId,
      modeF: modeF
    }
  }).then(backEnd => {
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
      collapseTransition.value.push(false)
      if (backEnd.data[count.value][0][0] === 'true') {
        successNum.value++
      }
    }
    loading.value = false
    // unfoldNotMatched()
  }).catch(err => {
    makeNoti('转换结果获取失败，请重试', '错误详情：' + err.response.data.msg, 'error')
    loading.value = false
  })
}

function unfoldNotMatched() {
  tableSimpleData.value.forEach(row => {
    if (row.autoMatched === 'false') {
      tableSimple.value.toggleRowExpansion(row)
    }
  })
  makeNoti('操作完成', '请继续其他操作', 'success', 3000)
}

function unfoldAll() {
  tableSimpleData.value.forEach(row => {
    tableSimple.value.toggleRowExpansion(row, true)
  })
  makeNoti('操作完成', '请继续其他操作', 'success', 3000)
}

function foldAll() {
  tableSimpleData.value.forEach(row => {
    tableSimple.value.toggleRowExpansion(row, false)
  })
  makeNoti('操作完成', '请继续其他操作', 'success', 3000)
}

const toggleRowExpansion = (row) => {
  const delay = ref(0)
  if (collapseTransition.value[row.index] === true)
    delay.value = 300;
  collapseTransition.value[row.index] = false;
  setTimeout(() => {
    tableSimple.value.toggleRowExpansion(row);
  }, delay.value)
  // tableSimple.value.toggleRowExpansion(row);
}

const showRowTransition = (row) => {
  nextTick(() => {
    collapseTransition.value[row.index] = true;
  })
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
    cb(backEnd.data)
  }).catch(err => {
    makeNoti('搜索失败，请重试', '错误详情：' + err.response.data.msg, 'error')
  })
}

const manualSelectMusicId = ref(-1)

const handleSelect = (item) => {
  manualSelectMusicId.value = item.musicId
}

function saveManualMatch(rowIndex: number) {
  if (queryInput.value.includes(' - ') && manualSelectMusicId.value !== -1) {
    if (tableSimpleData.value[modifyRow.value / 3].autoMatched === 'false') {
      successNum.value++;
    }

    tableDetailedData.value[modifyRow.value].localMusic = queryInput.value.split(' - ')[0]
    tableDetailedData.value[modifyRow.value].similarity = "手动匹配"

    tableDetailedData.value[modifyRow.value + 1].localMusic = queryInput.value.split(' - ')[1]
    tableDetailedData.value[modifyRow.value + 1].similarity = "手动匹配"

    tableDetailedData.value[modifyRow.value + 2].localMusic = queryInput.value.split(' - ')[2]
    tableDetailedData.value[modifyRow.value + 2].similarity = "手动匹配"

    tableSimpleData.value[modifyRow.value / 3].autoMatched = "manual"
    tableSimpleData.value[modifyRow.value / 3].songId = manualSelectMusicId.value

    dialogVisibleModify.value[rowIndex] = false;
    tableSimple.value.toggleRowExpansion(tableSimpleData.value[rowIndex], false)
    makeNoti('保存成功', '', 'success', 3000)
    jumpToNextFailItem(200, rowIndex)
  } else {
    makeNoti('保存失败', '请点击弹出框中的项', 'error')
  }
}

function rebuildIndex() {
  tableSimpleData.value.forEach((row, index) => {
    row.index = index
  })
}

const deleteAll = ref(false)

function handleDelete(rowIndex: number) {
  if (tableSimpleData.value[deleteRow.value / 3].autoMatched !== 'false') {
    successNum.value--;
  }
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
    makeNoti('已删除该歌单所有匹配失败的歌曲', '', 'success')
  } else
    makeNoti('删除成功', '', 'success')
  rebuildIndex()
  dialogVisibleDelete.value[rowIndex] = false;
  tableSimple.value.toggleRowExpansion(tableSimpleData.value[rowIndex], false)
  jumpToNextFailItem(200, rowIndex)
}

function jumpToNextFailItem(delay: number = 0, rowIndex: number = 0) {
  const modified = ref(false)
  setTimeout(() => {
    // tableSimple.value.clearSort()
    for (const i = ref(rowIndex); i.value < tableSimple.value.data.length; i.value++) {
      if (tableSimple.value.data[i.value].autoMatched === 'false') {
        modified.value = true
        tableSimple.value.setCurrentRow(tableSimple.value.data[i.value])
        nextTick(() => {
          tableSimple.value.scrollTo({
            top: (i.value - 1) * tableSimple.value.$el.querySelector('tbody tr').clientHeight,
            behavior: 'smooth'
          })
        })
        nextTick(() => {
          toggleRowExpansion(tableSimple.value.data[i.value])
        })
        return
      }
    }
    if (modified.value === false) {
      makeNoti('没有匹配失败的项了', '', 'info')
    }
  }, delay)
}

function showLoadingSpinner(show: boolean) {
  emit("showLoadingSpinner", show)
}

const checkList = ref(['true', 'false', 'manual'])

function saveCurrentMusicList() {
  if (tableSimpleData.value.length === 0) {
    dialogVisibleSave.value = false
    makeNoti('歌单数据未加载', '请先点击 预览结果 按钮', 'error')
    return
  }
  if (checkList.value.length === 0) {
    makeNoti('请至少选择一种保存类型', '', 'error')
    return
  }
  if (resultData.value === "共 0 首\n") {
    makeNoti('没有可保存的歌曲', '', 'error')
    return
  }
  showLoadingSpinner(true)
  const result = {};
  tableSimpleData.value.forEach((row) => {
    if (checkList.value.includes(row.autoMatched))
      result[row.index] = row.songId;
  });
  axios({
    method: 'POST',
    url: '/saveCurrentMusicList',
    data: {
      playlistId: selectedMusicList.value[progress.value].playListId,
      result: result
    }
  }).then(backEnd => {
    dialogVisibleSave.value = false
    makeNoti('歌单保存成功', '', 'success')
    showLoadingSpinner(false)
    if (progress.value === selectedMusicListCount.value - 1) {
      dialogVisibleFinish.value = true;
      return
    }
    successNum.value = 0
    tableSimple.value = null
    tableDetailed.value = null
    tableSimpleData.value = []
    tableDetailedData.value = []
    dialogVisibleModify.value = []
    dialogVisibleDelete.value = []
    dialogVisibleSkip.value = false
    progress.value++
  }).catch(err => {
    makeNoti('保存失败，请重试', '错误详情：' + err.response.data.msg, 'error')
    showLoadingSpinner(false)
  })
}

function skipCurrentMusicList() {
  if (progress.value === selectedMusicListCount.value - 1) {
    dialogVisibleSkip.value = false
    dialogVisibleFinish.value = true;
    return
  }
  dialogVisibleSkip.value = false
  makeNoti('已放弃当前歌单的匹配', '', 'info')
  successNum.value = 0
  tableSimple.value = null
  tableDetailed.value = null
  tableSimpleData.value = []
  tableDetailedData.value = []
  dialogVisibleModify.value = []
  dialogVisibleDelete.value = []
  dialogVisibleSave.value = false
  progress.value++
}

function handleSame(props) {
  collapseTransition.value[props.$index] = false;
  if (props.row.autoMatched === 'false') {
    successNum.value++;
  }
  setTimeout(() => {
    tableSimpleData.value[props.$index].autoMatched = 'manual';
    props.row.autoMatched = 'manual';
    tableSimple.value.toggleRowExpansion(tableSimpleData.value[props.$index], false)
  }, 300)
  jumpToNextFailItem(300, props.$index)
  makeNoti('保存成功', '', 'success', 3000)
}

const mode = ref('分离匹配')

function spanMethod({row, column, rowIndex, columnIndex}) {
  if (modeSaved.value === '分离匹配')
    return;
  if (columnIndex === 3) {
    if (rowIndex === 0)
      return {
        rowspan: 3,
        colspan: 1
      };
    else {
      return {
        rowspan: 0,
        colspan: 0
      };
    }
  }
}

const makeNoti = (title: string, message: string, type: string, duration: number = 5000) => {
  ElNotification({
    title: title,
    message: message,
    type: type + '',
    customClass: 'notification' + type.slice(0, 1).toUpperCase() + type.slice(1).toLowerCase(),
    duration: duration,
  })
}

const resultData = ref('')
const resultSongCount = ref(0)

function getResultData() {
  if (tableSimpleData.value.length === 0) {
    dialogVisibleSave.value = false
    makeNoti('歌单数据未加载', '请先点击 预览结果 按钮', 'error')
    return
  }
  if (checkList.value.length === 0) {
    makeNoti('请至少选择一种保存类型', '', 'error')
    return
  }
  resultData.value = ''
  const No = ref(1)
  tableSimpleData.value.forEach((row) => {
    if (checkList.value.includes(row.autoMatched)) {
      resultData.value += No.value++ + '. ' + tableDetailedData.value[row.index * 3].localMusic + ' - ';
      resultData.value += tableDetailedData.value[row.index * 3 + 1].localMusic + ' - ';
      resultData.value += tableDetailedData.value[row.index * 3 + 2].localMusic + '\n';
    }
  });
  resultSongCount.value = No.value - 1
  resultData.value = '共 ' + resultSongCount.value + ' 首' + '\n' + resultData.value
}

// TODO
// 移动端适配
</script>

<template>
  <el-row :gutter="40" style="margin-top: -80px;width: 90%; align-items: center;">
    <el-col :span="7" style="text-align: center;margin-top: 20px">
      <div style="width: 100%;border-radius: 10px;background-color: white;height: 100%; ">
        <div
            style="background-color: lightgray; border-top-left-radius: 10px; border-top-right-radius: 10px;padding-bottom: 8px;padding-top: 8px">
          <el-text style="font-size: 18px;">第 {{ progress + 1 }} 个，共 {{ selectedMusicListCount }} 个</el-text>
          <br>
          <el-text style="font-size: 20px; width: 98%" truncated>
            当前歌单：{{ props.selectedMusicList[progress].playListName }}
          </el-text>
          <br>
          <el-text style="font-size: 18px;">包含歌曲：{{ props.selectedMusicList[progress].songNum }}首
          </el-text>

        </div>
        <div style="margin-top: 5px">
          <el-text style="font-size: 25px;">转 换 控 制</el-text>
          <el-tooltip>
            <template #content>
              由于酷狗音乐自身原因，<br>非【我喜欢】歌单中歌曲的专辑信息未保存到数据库中，<br>建议关闭【专辑名称匹配】功能，以提升自动匹配成功率。<br>（禁用后，专辑名称的相似度将始终显示为100%）
            </template>
            <el-icon color="#A0A0A0" size="20" style="position: relative;left: 10px"
                     v-show="props.source==='KugouMusic'">
              <QuestionFilled/>
            </el-icon>
          </el-tooltip>
        </div>
        <p></p>
        <div align="center">
          <el-text style="font-size: 18px;margin-top: 10px;">相似度阈值：{{ similarity }}%</el-text>
          <br>
          <el-slider v-model="similarity" :show-tooltip="false"
                     style="margin-top: 10px; width: 90%"/>
        </div>
        <el-row align="middle" justify="center" style="margin-top: 10px" type="flex">
          <el-radio-group v-model="mode" size="large">
            <el-tooltip
                content="将歌曲的[歌名] [歌手] [专辑]分别进行匹配，<br>找到相似度最大的歌曲。<br>表格中将显示每个匹配项的相似度。"
                placement="top-start"
                raw-content>
              <el-radio-button label="分离匹配"/>
            </el-tooltip>
            <el-tooltip
                content="将歌曲的[歌名] [歌手] [专辑]拼接成一个字符串，<br>进行匹配，找到相似度最大的歌曲。<br>表格中将显示整体匹配的相似度。"
                placement="top-end"
                raw-content>
              <el-radio-button label="总体匹配"/>
            </el-tooltip>
          </el-radio-group>
        </el-row>
        <el-row align="middle" justify="center" style="margin-top: 8px;cursor:pointer;user-select: none" type="flex">
          <el-text style="margin-right: 15px; font-size: 18px"
                   @click="enableParenthesesRemoval=!enableParenthesesRemoval">启用括号去除
          </el-text>
          <el-switch
              v-model="enableParenthesesRemoval"
              :active-icon="Check"
              :inactive-icon="Close"
              inline-prompt
              size="large"
              style="margin-left: 17px"/>
        </el-row>
        <el-row align="middle" justify="center" style="margin-top: 8px;cursor:pointer;user-select: none" type="flex">
          <el-text style="margin-right: 15px;font-size: 18px"
                   @click="enableArtistNameMatch=!enableArtistNameMatch">启用歌手名匹配
          </el-text>
          <el-switch
              v-model="enableArtistNameMatch"
              :active-icon="Check"
              :inactive-icon="Close"
              inline-prompt
              size="large"/>
        </el-row>
        <el-row align="middle" justify="center" style="margin-top: 8px;cursor:pointer;user-select: none" type="flex">
          <el-text style="margin-right: 15px;font-size: 18px"
                   @click="enableAlbumNameMatch=!enableAlbumNameMatch">启用专辑名匹配
          </el-text>
          <el-switch
              v-model="enableAlbumNameMatch"
              :active-icon="Check"
              :inactive-icon="Close"
              inline-prompt
              size="large"/>
        </el-row>

        <el-button size="large"
                   style="font-size: large; margin-top: 10px;margin-bottom: 15px; width: 150px;border-radius: 8px"
                   type="primary"
                   @click="getConvertResult">
          预览歌单
        </el-button>
        <br>
        <el-button size="large"
                   style="font-size: large; margin-top: 5px;margin-bottom: 15px; width: 130px;border-radius: 8px"
                   type="success"
                   @click="resultData='';resultSongCount=0;dialogVisibleSave=true;getResultData()">
          保存当前歌单
        </el-button>
        <el-dialog
            v-model="dialogVisibleSave"
            align-center
            append-to-body
            style="border-radius: 10px"
            title="请确认"
            width="40%">
          <el-text style="font-size: 18px;margin-top: 15px;">按照表格保存当前歌单的匹配结果，并进入下一个歌单？</el-text>
          <div style="margin-top: 8px; margin-bottom: 8px">
            <el-text style="font-size: 15px;">要保存的类型：</el-text>
            <el-checkbox-group v-model="checkList" @change="getResultData">
              <el-checkbox label="true">自动匹配成功</el-checkbox>
              <el-checkbox label="false">自动匹配失败</el-checkbox>
              <el-checkbox label="manual">手动匹配</el-checkbox>
            </el-checkbox-group>
          </div>
          <el-text style="font-size: 18px;margin-top: 5px">转换结果预览：</el-text>
          <el-input
              v-model="resultData"
              :autosize="{ minRows: 2, maxRows: 9 }"
              readonly style="margin-top: 10px"
              type="textarea"/>
          <br>
          <template #footer>
            <span class="dialog-footer">
              <el-button
                  @click="dialogVisibleSave = false">取消
              </el-button>
              <el-button type="success" @click="saveCurrentMusicList">
                保存</el-button>
            </span>
          </template>
        </el-dialog>

        <el-button size="large"
                   style="font-size: large; margin-top: 5px;margin-bottom: 15px; width: 130px;border-radius: 8px"
                   type="danger"
                   @click="dialogVisibleSkip=true">
          放弃当前歌单
        </el-button>
        <el-dialog
            v-model="dialogVisibleSkip"
            align-center
            append-to-body
            style="border-radius: 10px"
            title="请确认"
            width="40%">
          <el-text style="font-size: 18px;margin-top: 15px">确认要放弃当前歌单的匹配，并进入下一个歌单？</el-text>
          <br>
          <template #footer>
            <span class="dialog-footer">
              <el-button
                  @click="dialogVisibleSkip = false">取消
              </el-button>
              <el-button type="danger" @click="skipCurrentMusicList">
                放弃</el-button>
            </span>
          </template>
        </el-dialog>

        <el-dialog
            v-model="dialogVisibleFinish"
            align-center
            append-to-body
            style="border-radius: 10px"
            title="🎉恭喜！"
            width="40%">
          <el-text style="font-size: 18px;margin-top: 15px">您已经完成了所有歌单的匹配操作！胜利就在眼前！<br>点击 确定
            进入下载页面
          </el-text>
          <br>
          <template #footer>
            <span class="dialog-footer">
              <el-button
                  @click="dialogVisibleFinish = false">取消
              </el-button>
              <el-button type="success" @click="next">
                确定</el-button>
            </span>
          </template>
        </el-dialog>

      </div>

    </el-col>
    <el-col :span="17" style="text-align: center;z-index: 1;">
      <div align="center" style="width: 100%;border-radius: 10px;background-color: white;margin-top: 50px">
        <div
            style="background-color: lightgray; border-top-left-radius: 10px; border-top-right-radius: 10px;padding: 5px;">
          <el-text style="font-size: 25px;">歌 单 预 览</el-text>
          <br>
          <el-text v-if="tableSimpleData.length!=0" style="font-size: 16px;">共 {{ tableSimpleData.length }} 首，成功(自动+手动)
            {{ successNum }} 首，失败 {{ tableSimpleData.length - successNum }} 首
          </el-text>
        </div>

        <el-table
            ref="tableSimple"
            v-loading="loading"
            :data="tableSimpleData"
            :row-style="rowStyle"
            border
            empty-text="暂无数据" fit highlight-current-row
            max-height="450" style="width: 100%; border-radius: 10px;font-size: 16px;"
            table-layout="auto"
            @row-click="toggleRowExpansion"
            @expand-change="showRowTransition">
          @expand-change="showRowTransition">
          <el-table-column type="expand" width="1">
            <template #default="props">
              <el-collapse-transition>
                <div v-show="collapseTransition[props.$index]"
                     style="margin-left: 25px;margin-right: 25px">
                  <p style="font-size: 8px"></p>
                  <el-text style="font-size: 16px; font-weight: bold">匹配详情</el-text>
                  <el-button icon="Delete" style="font-size: 15px; float: right;border-radius: 8px" type="danger"
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

                    <el-text style="font-size: 15px;margin-top: 15px">当前歌曲：</el-text>
                    <br>
                    <el-text style="font-size: 18px;margin-top: 15px">歌名：{{ tableDetailedData[deleteRow].source }}
                    </el-text>
                    <br>
                    <el-text style="font-size: 18px;margin-top: 15px">歌手：{{
                        tableDetailedData[deleteRow + 1].source
                      }}
                    </el-text>
                    <br>
                    <el-text style="font-size: 18px;margin-top: 15px">专辑：{{
                        tableDetailedData[deleteRow + 2].source
                      }}
                    </el-text>
                    <br><br>

                    <el-text style="margin-right: 15px;font-size: 16px;color: red;font-weight: bold;cursor: pointer"
                             @click="deleteAll=!deleteAll">
                      放弃当前歌单所有自动匹配失败的歌曲
                    </el-text>
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
                      <el-button type="danger" @click="handleDelete(tableSimpleData.indexOf(props.row));">
                        确定
                      </el-button>
                    </span>
                    </template>

                  </el-dialog>

                  <el-button icon="Edit" style="font-size: 15px; float: right; margin-right: 10px;border-radius: 8px"
                             type="primary"
                             @click="dialogVisibleModify[tableSimpleData.indexOf(props.row)] = true; modifyRow = tableSimpleData.indexOf(props.row) * 3; manualSelectMusicId = -1; queryInput=''">
                    修改
                  </el-button>

                  <el-button icon="Check" style="font-size: 15px; float: right;border-radius: 8px" type="success"
                             @click="handleSame(props)">
                    相同
                  </el-button>
                  <el-dialog
                      v-model="dialogVisibleModify[tableSimpleData.indexOf(props.row)]"
                      align-center
                      append-to-body
                      style="border-radius: 10px"
                      title="修改匹配结果"
                      width="40%">
                    <el-text style="font-size: 15px;margin-top: 15px">当前歌曲：</el-text>
                    <br>
                    <el-text style="font-size: 18px;margin-top: 15px;cursor: pointer"
                             @click="queryInput+=tableDetailedData[modifyRow].source">
                      歌名：{{ tableDetailedData[modifyRow].source }}
                    </el-text>
                    <br>
                    <el-text style="font-size: 18px;margin-top: 15px;cursor:pointer;"
                             @click="queryInput+=tableDetailedData[modifyRow+1].source">歌手：{{
                        tableDetailedData[modifyRow + 1].source
                      }}
                    </el-text>
                    <br>
                    <el-text style="font-size: 18px;margin-top: 15px;cursor: pointer"
                             @click="queryInput+=tableDetailedData[modifyRow+2].source">专辑：{{
                        tableDetailedData[modifyRow + 2].source
                      }}
                    </el-text>

                    <div style="margin-bottom: 8px;margin-top: 8px">
                      <el-text style="font-size: 15px;">Tips：点击上方文字可直接将其填入搜索框</el-text>
                    </div>
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
                          @click="dialogVisibleModify[tableSimpleData.indexOf(props.row)] = false">取消
                      </el-button>
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
                      :span-method="spanMethod"
                      border
                      fit max-height="500" style="width: 100%; font-size: 16px;margin-bottom: 15px"
                      table-layout="auto">
                    <el-table-column align="center" label="类型" prop="type" width="60"></el-table-column>
                    <el-table-column :label="sourceChn" prop="source" show-overflow-tooltip></el-table-column>
                    <el-table-column label="本地音乐" prop="localMusic" show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column align="center" label="相似度" prop="similarity"
                                     width="100"></el-table-column>
                  </el-table>
                </div>
              </el-collapse-transition>
            </template>

          </el-table-column>
          <el-table-column align="center" label="序号" type="index" width="60"></el-table-column>
          <el-table-column label="歌名" prop="songName" show-overflow-tooltip></el-table-column>
          <el-table-column label="歌手" prop="songArtist" show-overflow-tooltip></el-table-column>
          <el-table-column label="专辑" prop="songAlbum" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="自动匹配成功" prop="autoMatched"
                           width="145">
            <template #default="scope">
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
        <el-popconfirm
            cancel-button-text="取消"
            confirm-button-text="确定"
            title="该操作可能导致页面卡顿，是否继续？（请等待完成通知弹出后，再继续操作）"
            width="300px"
            @confirm="unfoldAll">
          <template #reference>
            <el-button size="large" style="font-size: 16px;margin-top: 15px;margin-bottom: 15px;border-radius: 8px"
                       type="info">展开所有项
            </el-button>
          </template>
        </el-popconfirm>

        <el-popconfirm
            cancel-button-text="取消"
            confirm-button-text="确定"
            title="该操作可能导致页面卡顿，是否继续？（请等待完成通知弹出后，再继续操作）"
            width="300px"
            @confirm="foldAll">
          <template #reference>
            <el-button size="large" style="font-size: 16px;margin-top: 15px;margin-bottom: 15px;border-radius: 8px"
                       type="info">收起所有项
            </el-button>
          </template>
        </el-popconfirm>

        <el-popconfirm
            cancel-button-text="取消"
            confirm-button-text="确定"
            title="该操作可能导致页面卡顿，是否继续？（请等待完成通知弹出后，再继续操作）"
            width="300px"
            @confirm="unfoldNotMatched">
          <template #reference>
            <el-button size="large" style="font-size: 16px;margin-top: 15px;margin-bottom: 15px;border-radius: 8px"
                       type="info">展开所有匹配失败的项
            </el-button>
          </template>
        </el-popconfirm>

        <el-button size="large" style="font-size: 16px;margin-top: 15px;margin-bottom: 15px;border-radius: 8px"
                   type="primary"
                   @click="jumpToNextFailItem">跳转到第一个匹配失败的项
        </el-button>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>
:deep(.el-table) .el-table__expanded-cell {
  padding: 0;
/* background-color: rgba(110, 110, 110, 0.20) !important; */
}

:deep(.el-table__body) tr.current-row > td {
  background: rgba(110, 110, 110, 0.20) !important;
}

:deep(.el-table__expand-icon) {
  display: none !important;
}

</style>