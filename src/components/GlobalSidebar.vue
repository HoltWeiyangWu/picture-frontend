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
import {computed, h, ref, watchEffect} from 'vue';
import {HomeOutlined, UserOutlined, TeamOutlined} from '@ant-design/icons-vue';
import {MenuProps, message} from 'ant-design-vue';
import {useRouter} from "vue-router";
import {useLoginUserStore} from "@/stores/user.ts";
import hasAccess from "@/access/hasAccess.ts";
import {SPACE_TYPE_ENUM} from "@/constants/space.ts";
import {listMyTeamSpace} from "@/api/spaceUserController.ts";

const loginUserStore = useLoginUserStore();
loginUserStore.fetchLoginUser();

const fixedMenuItems = [
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
  {
    key: '/addSpace?type=' + SPACE_TYPE_ENUM.TEAM,
    icon: () => h(TeamOutlined),
    label: 'Create Team',
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
const filterMenuItems = (menuItemList = [] as MenuProps['items']) => {
  return menuItemList
      .filter(menuItem => filterCallback(menuItem))
}

const items = computed<MenuProps['items']>(() => filterMenuItems(menuItems.value))

// Highlight the selected item
const current = ref<string[]>([]);
router.afterEach((to, from, next) => {
  current.value = [to.path];
})
// Update route
const doMenuClick = ({key}: { key: string }) => {
  router.push(key)
}

// Include team space in menu
const teamSpaceList = ref<API.SpaceUserVO[]>([])
const menuItems = computed(() => {
  if (teamSpaceList.value.length < 1) {
    return fixedMenuItems
  }
  const teamSpaceSubMenuItems = teamSpaceList.value.map((spaceUser: API.SpaceUserVO)=>{
    const space = spaceUser.spaceVO
    return {
      key: '/space/' + spaceUser.spaceId,
      label: space?.spaceName
    }
  })
  const teamSpaceMenuGroup = {
    type: 'group',
    label: 'My Team',
    key: 'teamSpace',
    children: teamSpaceSubMenuItems,
  }
  return [...fixedMenuItems, teamSpaceMenuGroup]
})

const fetchTeamSpaceList = async () => {
  const res = await listMyTeamSpace()
  if (res.data.code === 0 && res.data.data) {
    teamSpaceList.value = res.data.data
  } else {
    message.error("Failed to load team: " + res.data.message)
  }
}

watchEffect(()=>{
  if (loginUserStore.loginUser.id) {
    fetchTeamSpaceList()
  }
})

</script>

<style scoped>
</style>