<script setup lang="ts">
import {reactive} from "vue";
import {userLogin} from "@/api/userController.ts";
import {useLoginUserStore} from "@/stores/user.ts";
import {useRouter} from "vue-router";
import {message} from "ant-design-vue";


const router = useRouter()
const loginUserStore = useLoginUserStore()

const formState = reactive<API.UserLoginRequest>({
  userAccount: '',
  userPassword: '',
})

const handleSubmit = async (values: any) => {
  const res = await userLogin(values)
  // Record user state if login is successful
  if (res.data.code === 0 && res.data.data) {
    await loginUserStore.fetchLoginUser()
    message.success("Login successfully")
    await router.push({
      path: "/",
      replace: true,
    })
  } else {
    message.error('Login fails ' + res.data.message)
  }
}


</script>

<template>
  <div id="userLoginPage">
    <h2 class="title">Holt's Picture Cloud Centre - User Login</h2>
    <div class="description">Edit pictures online with your friends</div>
    <a-form :model="formState" name="basic" autoComplete="off" @finish="handleSubmit">
      <a-form-item name="userAccount" :rules="[{required: true, message: 'Please fill out the field'}]">
        <a-input v-model:value="formState.userAccount" placeholder="User account here"></a-input>
      </a-form-item>
      <a-form-item name="userPassword"
                   :rules="[{required: true, message: 'Please fill out the password'},
                   {min:8, message: 'Password must be at least 8 characters long'}
                   ]">
        <a-input-password v-model:value="formState.userPassword" placeholder="Password here"/>
      </a-form-item>
      <div class="tips">
        New to Picture Cloud Centre?
        <RouterLink to="/user/register">Register</RouterLink>
      </div>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%">Login</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped>
#userLoginPage {
  max-width: 360px;
  margin: 0 auto;
}

.title {
  text-align: center;
  margin-bottom: 20px;
}

.description {
  text-align: center;
  color: #bbbbbb;
  margin-bottom: 20px;
}

.tips {
  text-align: right;
  color: #bbbbbb;
  font-size: 13px;
  margin-bottom: 20px;
}
</style>