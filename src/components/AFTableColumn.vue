<template>
  <!--判断 slots.default可知道是否存在子元素-->
  <el-table-column v-if="slots.default" :class-name="className" :min-width="minWidth" v-bind="attrs">
    <template #default="scope">
      <slot v-bind="scope"></slot>
    </template>
  </el-table-column>
  <!--使用 slot 自定义 header-->
  <el-table-column v-else-if="slots.header" :class-name="className" :min-width="minWidth" v-bind="attrs">
    <template #header="scope">
      <slot name="header" v-bind="scope"></slot>
    </template>
  </el-table-column>
  <!--默认情况使用原始 el-table-column-->
  <el-table-column v-else :class-name="className" :min-width="minWidth" v-bind="attrs">
  </el-table-column>
</template>
<script lang="ts">
export default {
  name: 'af-table-column',
  // inheritAttrs: false,
}
</script>
<script lang="ts" name="af-table-column" setup>
import {getCurrentInstance, ref, reactive, watch, computed, nextTick, useAttrs, useSlots} from 'vue'
import $consts from '../configs/constants';

const {proxy} = getCurrentInstance() as any;
const attrs = useAttrs() as any;
const slots = useSlots();
let minLength = ref(10); // 初始也不要写成0, 避免未及时设置宽度太丑
let getComputedWidth = ref(10); // 自定义列中获取元素计算的宽度
const values = computed(() => {
  const data = proxy.$parent.data || []
  return data.map((item: any) => item[attrs.prop])
})

// 是否自适应列宽, 默认是
const isFit = computed(() => {
  return (proxy.$parent.$attrs.autoFit === undefined && attrs.fit === undefined) || (proxy.$parent.$attrs.autoFit === false && attrs.fit !== undefined)
})

// 为存在scope的添加className
const className = computed(() => {
  const parentClass = attrs['class-name'] || ''
  const classPre = attrs.prop || `encode-${transChar(attrs.label)}` // 有的列因为有slotScope而不给prop
  return classPre ? `${parentClass} ${classPre}-column` : ''
})

// 列最小宽度
const minWidth = computed(() => {
  if (!attrs.label) return undefined;
  if (!isFit.value) return undefined;
  const maxOne = Math.max(minLength.value, attrs.label.length * (fontRate.value as any).CHAR_RATE) * fontSize.value + 20;
  return attrs.width || Math.max(maxOne, getComputedWidth.value)
})

// 字体大小
const fontSize = computed(() => attrs.fontSize || $consts.fontSize)

// 字体比例
const fontRate = computed(() => {
  return {
    ...$consts.fontRate, // 默认值
    ...attrs.fontRate || {}, // 父组件属性
  }
})

watch(values, (val: any) => {
  return isFit.value !== false &&
      nextTick(() => {
        // 详情中的列表需要在nextTick才能生效
        if (!slots.default) {
          // 存在自定义节点
          minLength.value = getMaxLength(val);
          return;
        }
        setTimeout(() => {
          // 首次获取不到子节点, setTimeout才行
          // 可能存在贴边列, 需要使用包含 fixed 的类名
          const bodyWrapper = attrs.fixed ? (document as any).querySelector(`.el-table__fixed${attrs.fixed === 'right' ? `-${attrs.fixed}` : ''}`).querySelector('.el-table__fixed-body-wrapper') : document.querySelector('.el-table__body-wrapper')
          const nodes = bodyWrapper.querySelectorAll(`.${attrs.prop || `encode-${transChar(attrs.label)}`}-column`)
          if (nodes.length) {
            // 有可能会来不及获取nodes, 就切换菜单进入下一页了, 再研究吧
            const target = reactive<Array<String>>([]);
            const getComputedWidths = reactive<Array<number>>([]);
            Array.from(nodes).map((item: any) => {
              let text = item.innerText;
              target.push(text);
              // 有可能存在自定义列内容超出容器, 取 scrollWidth 才行
              getComputedWidths.push(item.querySelector('.cell').scrollWidth);
            })
            getComputedWidth.value = Math.max(...getComputedWidths);
            minLength.value = getMaxLength(target);
          }
        }, 0)
      })
})

/**
 * 获取数组中元素按字体比例最长长度
 * @param arr
 */
const getMaxLength = (arr: any) => {
  return arr.reduce((length: any, item: any) => {
    if (item) {
      const str = item.toString()
      const char = str.match(/[\u2E80-\u9FFF]/g)
      const charLength = char ? char.length : 0
      const num = str.match(/\d|\./g)
      const numLength = num ? num.length : 0
      const otherLength = str.length - charLength - numLength
      let newLength = charLength * $consts.fontRate.CHAR_RATE + numLength * $consts.fontRate.NUM_RATE + otherLength * $consts.fontRate.OTHER_RATE
      if (str.includes('\n')) newLength = getMaxLength(str.split('\n'))
      if (length < newLength) {
        length = newLength
      }
    }
    return length
  }, 0)
}
/**
 * 转换汉字为class支持的字母
 * @param char
 */
const transChar = (char: any) => {
  return encodeURIComponent(char).replace(/[^a-zA-z]/g, 'eUC')
}


</script>