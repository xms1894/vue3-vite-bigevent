<script setup>
import { ref } from 'vue'
import { useUserStore } from '../../stores'
import { userUpdatePasswordService } from '../../api/user.js'
// import { useRouter } from 'vue-router'
import router from '@/router'

const formRef = ref()
const pwdForm = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})

// 自定义校验：新密码和原密码不能一样
const validateNewPassword = (rule, value, callback) => {
  if (value === pwdForm.value.old_pwd) {
    callback(new Error('新密码不能与原密码相同'))
  } else {
    callback()
  }
}

// 自定义校验：新密码和确认密码必须一致
const validateConfirmPassword = (rule, value, callback) => {
  if (value !== pwdForm.value.new_pwd) {
    callback(new Error('新密码与确认密码不一致'))
  } else {
    callback()
  }
}

// 校验规则
const rules = {
  old_pwd: [
    { required: true, message: '原密码不能为空', trigger: 'blur' },
    { min: 6, max: 15, message: '原密码必须在6-15位之间', trigger: 'blur' }
  ],
  new_pwd: [
    { required: true, message: '新密码不能为空', trigger: 'blur' },
    { min: 6, max: 15, message: '新密码必须在6-15位之间', trigger: 'blur' },
    { validator: validateNewPassword, trigger: 'blur' }
  ],
  re_pwd: [
    { required: true, message: '确认密码不能为空', trigger: 'blur' },
    { min: 6, max: 15, message: '确认密码必须在6-15位之间', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

// 提交处理函数
const userStore = useUserStore()
// const router = useRouter()
const handleSubmit = async () => {
  //const formRef = ref(null) // 获取表单引用
  await formRef.value.validate(/* (valid) => {
    if (valid) {
      alert('密码修改成功!')
      // 在这里处理密码修改逻辑
    } else {
      console.log('表单校验失败!')
      return false
    }
  } */)
  await userUpdatePasswordService(pwdForm.value)
  ElMessage.success('密码修改成功')

  userStore.setToken('')
  userStore.setUser({})

  router.push('/login')
}

// 重置表单
const resetForm = () => {
  pwdForm.value.old_pwd = ''
  pwdForm.value.new_pwd = ''
  pwdForm.value.re_pwd = ''
}
</script>
<template>
  <page-container title="修改密码">
    <el-form :model="pwdForm" :rules="rules" ref="formRef" label-width="120px" style="width: 50%">
      <el-form-item label="原密码" prop="old_pwd">
        <el-input type="password" v-model="pwdForm.old_pwd" show-password></el-input>
      </el-form-item>

      <el-form-item label="新密码" prop="new_pwd">
        <el-input type="password" v-model="pwdForm.new_pwd" show-password></el-input>
      </el-form-item>

      <el-form-item label="确认密码" prop="re_pwd">
        <el-input type="password" v-model="pwdForm.re_pwd" show-password></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSubmit">修改密码</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </page-container>
</template>
