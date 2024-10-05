<script setup>
import { ref } from 'vue'
import { artGetChannelsService } from '../../../api/article.js'

defineProps({
  mV: { type: [Number, String] },
  width: { type: String }
})
const emit = defineEmits(['update:mV'])

const channelList = ref([])
const getChannelList = async () => {
  const res = await artGetChannelsService()
  // console.log(res.data)
  channelList.value = res.data.data
  // console.log(channelList)
  // console.log(channelList.value) // 最后才注释的
}
getChannelList()
</script>

<template>
  <el-select
    :modelValue="mV"
    @update:modelValue="emit('update:mV', $event)"
    style="width: 250px"
    :style="width"
  >
    <el-option
      v-for="channel1 in channelList"
      :key="channel1.id"
      :label="channel1.cate_name"
      :value="channel1.id"
    ></el-option>
  </el-select>
</template>
