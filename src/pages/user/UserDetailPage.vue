<script setup lang="ts">
import {useLoginUserStore} from "@/stores/user.ts";
import {reactive} from "vue";
import {editUser} from "@/api/userController.ts";
import {message} from "ant-design-vue";


const loginUserStore = useLoginUserStore()
const loginUser = loginUserStore?.loginUser

const formState = reactive<API.UserEditRequest>({
  userName: loginUser?.userName || '',
  userProfile: loginUser?.userProfile || '',
  userAvatar: loginUser?.userAvatar || '',
})

const handleSubmit = async (values: any) => {
  const res = await editUser({
    id: loginUser.id,
    ...values,
  })
  // Record user state if login is successful
  if (res.data.code === 0 && res.data.data) {
    await loginUserStore.fetchLoginUser()
    message.success("Update successfully")
  } else {
    message.error('Login fails ' + res.data.message)
  }
}


</script>

<template>
  <a-card title="User Profile" style="max-width: 1200px; ">
    <div style="display: flex; flex-direction: column; gap: 24px; ">
      <a-avatar :src="formState.userAvatar" alt="" style="width: 120px; height: 120px;"/>

      <div style="width: 100%">
        <a-typography-paragraph>

          <a-typography-title :level="5">User ID</a-typography-title>
          <a-typography>{{loginUser?.id}}</a-typography>

          <a-typography-title :level="5">Account</a-typography-title>
          <a-typography>{{loginUser?.userAccount}}</a-typography>

          <a-typography-title :level="5">Role</a-typography-title>
          <a-tag v-if="loginUser?.userRole === 'admin'" color="green">Admin</a-tag>
          <a-tag v-else color="blue">User</a-tag>
        </a-typography-paragraph>

        <a-form layout="vertical" :model="formState" @finish="handleSubmit">
          <a-typography-title :level="5">Avatar URL</a-typography-title>
          <a-form-item name="userAvatar" label="">
            <a-input v-model:value="formState.userAvatar" />
          </a-form-item>
          <a-typography-title :level="5">Name</a-typography-title>
          <a-form-item name="userName" label="">
            <a-input v-model:value="formState.userName"  />
          </a-form-item>

          <a-typography-title :level="5">Introduction</a-typography-title>
          <a-form-item  name="userProfile" label="">
            <a-textarea
                v-model:value="formState.userProfile"
                :rows="3"
                style="margin-top: 4px;"
            />
          </a-form-item>

          <a-form-item>
            <a-button type="primary" html-type="submit" style="width: 100%">Edit
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </a-card>
</template>




<style scoped>
</style>