<script setup>
import { ref } from 'vue'
import { artEditChannelService, artAddChannelService } from '../../../api/article.js'
const dialogVisible = ref(false)
const formRef = ref()
const ruleForm1 = ref({
  cate_name: '',
  cate_alias: ''
})
const rules = {
  cate_name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    {
      pattern: /^\S{1,10}$/,
      message: '分类名必须是 1-10位 的非空字符',
      trigger: 'blur'
    }
  ],
  cate_alias: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{1,15}$/,
      message: '分类名必须是 1-15位 的字母或数字',
      trigger: 'blur'
    }
  ]
}

const open = (row) => {
  // console.log(row)
  dialogVisible.value = true
  ruleForm1.value = { ...row }
}
defineExpose({
  open
})

const emit = defineEmits(['success'])
const handleSubmit = async () => {
  await formRef.value.validate()
  // const isEdit = formRef.value.id // WRONGbyme!!!
  const isEdit = ruleForm1.value.id
  if (isEdit) {
    //Edit
    await artEditChannelService(ruleForm1.value)
    ElMessage.success('编辑成功')
  } else {
    //Add
    await artAddChannelService(ruleForm1.value)
    ElMessage.success('添加成功')
  }
  dialogVisible.value = false
  emit('success')
}
</script>

<template>
  <el-dialog v-model="dialogVisible" :title="ruleForm1.id ? '编辑分类' : '添加分类'" width="500">
    <el-form
      ref="formRef"
      :model="ruleForm1"
      :rules="rules"
      label-width="100px"
      style="padding-right: 30px"
    >
      <el-form-item label="分类名称" prop="cate_name">
        <el-input v-model="ruleForm1.cate_name" placeholder="请输入分类名称"></el-input>
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input v-model="ruleForm1.cate_alias" placeholder="请输入分类别名"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>
