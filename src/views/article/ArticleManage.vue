<script setup>
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'

import ChannelSelect from '../../views/article/components/ChannelSelect.vue'
// import ChannelSelect from './components/ChannelSelect.vue'
import { artGetListService } from '../../api/article.js'
import { formatTime } from '../../utils/format.js'

import ArticleEdit from './components/ArticleEdit.vue'

// import { artDelChannelService } from '../../api/article.js'
import { artDeleteService } from '../../api/article.js'

const articleList = ref([])
const total = ref(0)
const loading = ref(false)

const params = ref({
  pagenum: 1,
  pagesize: 10,
  cate_id: '',
  state: ''
})

const getArticleList = async () => {
  loading.value = true

  const res = await artGetListService(params.value)
  articleList.value = res.data.data
  total.value = res.data.total

  loading.value = false
}
getArticleList()
const handleSizeChange = () => {
  // console.log('每页条数变化了', size)
  /*  params.value.pagenum = 1
  params.value.pagesize = size */
  getArticleList()
}
const handleCurrentChange = () => {
  // console.log('当前页变化了', page)
  // params.value.pages = page
  getArticleList()
}

const handleSearch = () => {
  params.value.pagenum = 1
  getArticleList()
}
const handleReset = () => {
  params.value.pagenum = 1
  params.value.cate_id = ''
  params.value.state = ''
  getArticleList()
}

// 抽屉逻辑

const articleEditRef = ref()
const handleAddArticle = () => {
  articleEditRef.value.open({})
}

// 编辑逻辑
const handleEditArticle = (row) => {
  // console.log(row)
  articleEditRef.value.open(row)
}
// 删除逻辑
const handleDeleteArticle = async (row) => {
  // console.log(row)
  await ElMessageBox.confirm('你确定要删除该分类么', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
  await artDeleteService(row.id)
  ElMessage.success('删除成功')
  getArticleList()
}
/* const handleDelChannel = async (row) => {
  // console.log(row, $index)
  await ElMessageBox.confirm('你确定要删除该分类么', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
  await artDelChannelService(row.id)
  ElMessage.success('删除成功')
  getChannelList()
} */

// const cateId = ref(27305)

// 添加或者编辑成功的回调
const handleSuccess1 = (type) => {
  if (type === 'add') {
    //Add
    const lastpage = Math.ceil((total.value + 1) / params.value.pagesize)
    params.value.pagenum = lastpage
  }

  getArticleList()
}
</script>

<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button type="primary" @click="handleAddArticle">添加文章</el-button>
    </template>

    <!-- 表单区域 -->
    <el-form inline>
      <el-form-item label="文章分类:">
        <!-- <channel-select v-model:model-value="params.cate_id"></channel-select> -->
        <!-- <channel-select v-model:cid="params.cate_id"></channel-select> -->
        <!-- <channel-select v-model="params.cate_id"></channel-select> -->
        <channel-select v-model:mV="params.cate_id"></channel-select>
      </el-form-item>
      <el-form-item label="发布状态:">
        <el-select v-model="params.state" style="width: 250px">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleSearch" type="primary">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table :data="articleList" v-loading="loading">
      <el-table-column label="文章标题">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <el-table-column label="发表时间" prop="pub_date">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            circle
            plain
            type="primary"
            :icon="Edit"
            @click="handleEditArticle(row)"
          ></el-button>
          <el-button
            circle
            plain
            type="danger"
            :icon="Delete"
            @click="handleDeleteArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 5, 10, 15]"
      :background="true"
      layout="jumper,total, sizes, prev, pager, next, "
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />

    <!-- 抽屉区域 -->
    <article-edit ref="articleEditRef" @success1="handleSuccess1"></article-edit>
  </page-container>
</template>

<style lang="scss" scoped></style>
