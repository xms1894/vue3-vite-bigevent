<script setup>
import PageContainer from '../../components/PageContainer.vue'
import { ref } from 'vue'
import { useUserStore } from '../../stores'

import { userUpdateInfoService } from '../../api/user.js'

const formRef = ref()
const {
  user: { email, id, nickname, username },
  getUser
} = useUserStore()
// 表单数据
const form = ref({
  id,
  username, // 示例禁用的用户名
  nickname,
  email
})

// 校验规则
const rules = {
  nickname: [
    { required: true, message: '昵称不能为空', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称必须在2-20位之间', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '邮箱不能为空', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: ['blur', 'change'] }
  ]
}

// 提交处理函数
const handleSubmit = async () => {
  //const formRef = ref(null) // 获取表单引用
  await formRef.value.validate()
  await userUpdateInfoService(form.value)

  getUser()
  ElMessage.success('修改成功')
}
</script>
<template>
  <page-container title="基本资料">
    <!-- 表单部分 -->
    <template #default>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" style="width: 50%">
        <el-form-item label="登录名称" prop="username">
          <el-input v-model="form.username" disabled></el-input>
        </el-form-item>

        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="form.nickname"></el-input>
        </el-form-item>

        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">提交修改</el-button>
        </el-form-item>
      </el-form>
    </template>
  </page-container>
</template>
