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
          <a-dropdown>
            <ASpace>
              <a-avatar :src="loginUserStore.loginUser.userAvatar"/>
              {{ loginUserStore.loginUser.userName ?? 'Anonymous' }}
            </ASpace>
            <template #overlay>
              <a-menu>
                <a-menu-item @click="doLogout">
                  <LogoutOutlined/>
                  Logout
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
        <div v-else>
          <a-button type="primary" href="/user/login">Login</a-button>
        </div>
      </div>
    </a-col>
  </a-row>

</template>

<script setup lang="ts">
import {computed, h, ref} from 'vue';
import {HomeOutlined, LogoutOutlined} from '@ant-design/icons-vue';
import {MenuProps, message} from 'ant-design-vue';
import {useRouter} from "vue-router";
import {useLoginUserStore} from "@/stores/user.ts";
import {logout} from "@/api/userController.ts";
import hasAccess from "@/access/hasAccess.ts";

const loginUserStore = useLoginUserStore();
loginUserStore.fetchLoginUser();

const fullMenu = [
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: 'Home',
    title: 'Home',
  },
  {
    key: '/admin/userManage',
    label: 'Manage Users',
    title: 'Manage Users',
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
];

// Add router
const router = useRouter();
const menuToRouteItem = (menuItem: any) => {
  return router.getRoutes().find(routeItem => routeItem.path === menuItem.key);
}

// Filter out option to user management page based on user state or meta =
const filterCallback = (menuItem) => {
  const routeItem = menuToRouteItem(menuItem);
  if (routeItem?.meta?.hideInMenuBar) {
    return false
  }
  return hasAccess(loginUserStore.loginUser,
      routeItem?.meta?.access as string)
}

// Takes a list of menu items, convert them to route items and
const filterMenuItems = (menuItems = [] as MenuProps['items']) => {
  return menuItems
      .filter(menuItem => filterCallback(menuItem))
}

const items = computed<MenuProps['items']>(() => filterMenuItems(fullMenu))

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

// Logout user
const doLogout = async () => {
  const res = await logout();
  if (res.data.code === 0) {
    loginUserStore.setLoginUser({
      userName: 'Not logged in',
    });
    message.success("Logged out successfully");
    await router.push('/user/login');
  } else {
    message.error("Fail to log out: " + res.data.message);
  }
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