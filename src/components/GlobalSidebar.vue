<template>
  <a-layout-sider
      v-if="loginUserStore.loginUser.id"
      width="200"
      breakpoint="lg"
      collapsed-width="0"
      style="background: #fff">
    <a-menu
        v-model:selectedKeys="current"
        mode="inline"
        :items="items"
        @click="doMenuClick"
    >
    </a-menu>
  </a-layout-sider>

</template>

<script setup lang="ts">
import {computed, h, ref} from 'vue';
import {HomeOutlined, UserOutlined} from '@ant-design/icons-vue';
import {MenuProps} from 'ant-design-vue';
import {useRouter} from "vue-router";
import {useLoginUserStore} from "@/stores/user.ts";
import hasAccess from "@/access/hasAccess.ts";

const loginUserStore = useLoginUserStore();
loginUserStore.fetchLoginUser();

const fullMenu = [
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: 'All Pictures',
  },
  {
    key: '/mySpace',
    icon: () => h(UserOutlined),
    label: 'My Pictures',
  },
];

// Add router
const router = useRouter();
const menuToRouteItem = (menuItem: any) => {
  return router.getRoutes().find(routeItem => routeItem.path === menuItem.key);
}

// Filter out option to user management page based on user state or meta
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
</script>

<style scoped>
</style>