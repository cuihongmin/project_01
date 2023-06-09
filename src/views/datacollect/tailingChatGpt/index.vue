<!-- LoginRegister.vue -->
<template>
  <div>
    <el-tabs type="border-card" class="card">
      <el-tab-pane label="登录" class="pane">
        <el-form :model="loginForm" ref="loginForm" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="loginForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitLoginForm">登录</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="注册" class="pane">
        <el-form :model="registerForm" ref="registerForm" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="registerForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="registerForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="registerForm.confirmPassword" type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitRegisterForm">注册</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

export default {
    name: "TailingChatGpt",
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      registerForm: {
        username: '',
        password: '',
        confirmPassword: ''
      }
    }
  },
  methods: {
    submitLoginForm() {
      // 提交登录表单的逻辑
      console.log('登录表单数据：', this.loginForm)
    },
    submitRegisterForm() {
      // 提交注册表单的逻辑
      console.log('注册表单数据：', this.registerForm)
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  width:500px;
  padding: 50px;
//   display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../../../assets/image/login-background.jpg");
  background-size: cover;
}

// .pane {
//     width: 200px;
  

// }
</style>