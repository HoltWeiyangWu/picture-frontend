<template>
  <a-row :wrap="false">
    <a-col flex="200px">
      <RouterLink to="/">
        <div class="title-bar">
          <img class="logo" src="../assets/cloud.png" alt="logo">
          <div class="title">Picture Cloud</div>
        </div>
      </RouterLink>
    </a-col>
    <a-col flex="auto">
      <a-menu v-model:selectedKeys="current"
              mode="horizontal"
              :items="items"
              @click="doMenuClick"/>
    </a-col>
    <a-col flex="120px">
      <div class="user-login-status">
        <div v-if="loginUserStore.loginUser.id">
          {{ loginUserStore.loginUser.userName ?? 'Anonymous' }}
        </div>
        <div v-else>
          <a-button type="primary" href="/user/login">Login</a-button>
        </div>
      </div>
    </a-col>
  </a-row>

</template>

<script setup lang="ts">
import {h, ref} from 'vue';
import {HomeOutlined} from '@ant-design/icons-vue';
import {MenuProps} from 'ant-design-vue';
import {useRouter} from "vue-router";
import {useLoginUserStore} from "@/stores/user.ts";
const loginUserStore = useLoginUserStore();
loginUserStore.fetchLoginUser();

const items = ref<MenuProps['items']>([
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: 'Home',
    title: 'Home',
  },
  {
    key: '/about',
    label: 'About',
    title: 'About',
  },

  {
    key: 'others',
    label: h(
        'a',
        {
          href: 'https://github.com/HoltWeiyangWu',
          target: '_blank',
        },
        "Developer"
    ),
    title: 'Developer',
  },
]);

// Add router
const router = useRouter();
// Highlight the selected item
const current = ref<string[]>([]);
router.afterEach((to, from, next) => {
  current.value = [to.path];
})
// Update route
const doMenuClick = ({key}: { key: string }) => {
  router.push({
    path: key,
  })
}
</script>

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: black;
  font-size: 18px;
  margin-left: 16px;
}

.logo {
  height: 48px;
}
</style>