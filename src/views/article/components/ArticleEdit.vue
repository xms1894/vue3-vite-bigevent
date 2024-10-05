<script setup>
import { ref } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {
  artPublishService,
  artGetDetailService,
  artEditService
} from '../../../api/article.js'
import { baseURL } from '../../../utils/request.js'

import axios from 'axios'

const visibleDrawer = ref(false)

const defaultForm = {
  title: '',
  cate_id: '',
  cover_img: '',
  content: '',
  state: ''
}
const ruleForm2 = ref({ ...defaultForm })
const imageUrl = ref('')
const onSelectFile = (uploadFile) => {
  // console.log(uploadFile)
  imageUrl.value = URL.createObjectURL(uploadFile.raw)
  ruleForm2.value.cover_img = uploadFile.raw
}

// 提交
const emit = defineEmits(['success1'])
const handlePublish = async (state) => {
  ruleForm2.value.state = state

  const fd = new FormData()
  for (let key in ruleForm2.value) {
    fd.append(key, ruleForm2.value[key])
  }

  if (ruleForm2.value.id) {
    //Edit
    console.log('编辑操作')
    await artEditService(fd)
    ElMessage.success('编辑成功')
    visibleDrawer.value = false
    emit('success1', 'edit')
  } else {
    //Add
    await artPublishService(fd)
    ElMessage.success('添加成功')
    visibleDrawer.value = false

    emit('success1', 'add')
  }
}

const editorRef = ref()
const open = async (row) => {
  visibleDrawer.value = true

  if (row.id) {
    // console.log('编辑回显') // 最后才注释的

    const res = await artGetDetailService(row.id)
    // console.log(res.data) // 最后才注释的
    ruleForm2.value = res.data.data
    imageUrl.value = baseURL + ruleForm2.value.cover_img

    const file = await urlToFile(imageUrl.value, ruleForm2.value.cover_img)
    ruleForm2.value.cover_img = file
  } else {
    ruleForm2.value = { ...defaultForm }
    imageUrl.value = ''
    // console.log('添加') // 最后才注释的

    // editorRef.value.setHTML = ''
    editorRef.value.setHTML('')
  }
  // console.log(row)
}

// From chatGPT
// 将网络图片地址转换成 File 对象的函数
async function urlToFile(url, filename, mimeType) {
  const response = await axios.get(url, {
    responseType: 'blob' // 获取原始数据
  })

  const blob = new Blob([response.data], { type: mimeType }) // 创建 Blob 对象
  const file = new File([blob], filename, { type: mimeType }) // 创建 File 对象
  return file
}

// 示例用法
/* const imageUrl1 = 'https://example.com/image.jpg' // 替换为你的图片 URL
const filename = 'image.jpg'
const mimeType = 'image/jpeg' // 根据图片类型调整

urlToFile(imageUrl1, filename, mimeType)
  .then((file) => {
    console.log('File 对象:', file)
  })
  .catch((error) => {
    console.error('Error fetching image:', error)
  }) */

defineExpose({
  open
})
</script>

<template>
  <el-drawer
    v-model="visibleDrawer"
    :title="ruleForm2.id ? '编辑文章' : '添加文章'"
    direction="rtl"
    size="50%"
  >
    <!-- 发表文章表单 -->
    <el-form :model="ruleForm2" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="ruleForm2.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <channel-select
          v-model="ruleForm2.cate_id"
          style="width: 100%"
        ></channel-select>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auot-upload="false"
          :on-change="onSelectFile"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <quill-editor
            ref="editorRef"
            v-model:content="ruleForm2.content"
            content-type="html"
            theme="snow"
          ></quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="handlePublish('已发布')" type="primary"
          >发布</el-button
        >
        <el-button @click="handlePublish('草稿')" type="info">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
