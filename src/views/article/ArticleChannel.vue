<script setup>
import { ref } from 'vue'
import { artGetChannelsService, artDelChannelService } from '../../api/article'
import { Edit, Delete } from '@element-plus/icons-vue'

// import { ChannelEdit } from './components/ChannelEdit.vue'
import ChannelEdit from './components/ChannelEdit.vue'

const channelList = ref([])

const loading = ref(false)

const dialog = ref()
const getChannelList = async () => {
  loading.value = true
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  // channelList.value = []
  loading.value = false
  // console.log(channelList.value)
}
getChannelList()

const handleDelChannel = async (row) => {
  // console.log(row, $index)
  await ElMessageBox.confirm('你确定要删除该分类么', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
  await artDelChannelService(row.id)
  ElMessage.success('删除成功')
  getChannelList()
}
const handleEditChannel = (row) => {
  // console.log(row, $index)
  dialog.value.open(row)
}
const handleAddChannel = () => {
  // dialogVisible.value = true
  dialog.value.open({})
}

const handleSuccess = () => {
  getChannelList()
}
</script>
<template>
  <page-container title="文章分类">
    <template #extra>
      <el-button @click="handleAddChannel">添加分类</el-button>
    </template>

    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="cate_name" label="分类名称"></el-table-column>
      <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row, $index }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="handleEditChannel(row, $index)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="handleDelChannel(row, $index)"
          ></el-button>
        </template>
      </el-table-column>

      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>

    <channel-edit ref="dialog" @success="handleSuccess"></channel-edit>
  </page-container>
</template>

<style lang="scss" scoped></style>
