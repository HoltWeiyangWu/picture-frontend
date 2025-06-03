import { createRouter, createWebHistory } from 'vue-router'
import HomePage from "@/pages/HomePage.vue";
import UserLoginPage from "@/pages/user/UserLoginPage.vue";
import UserRegisterPage from "@/pages/user/UserRegisterPage.vue";
import UserManagePage from "@/pages/admin/UserManagePage.vue";
import NoAuthPage from "@/pages/NoAuthPage.vue";
import ACCESS_ENUM from "@/access/accessEnum.ts";
import AddPicturePage from "@/pages/AddPicturePage.vue";
import PictureDetailPage from "@/pages/PictureDetailPage.vue";
import PictureManagePage from "@/pages/admin/PictureManagePage.vue";
import AddPictureBatchPage from "@/pages/admin/AddPictureBatchPage.vue";
import SpaceManagePage from "@/pages/admin/SpaceManagePage.vue";
import AddSpacePage from "@/pages/AddSpacePage.vue";
import MySpacePage from "@/pages/MySpacePage.vue";

import SpaceDetailPage from "@/pages/SpaceDetailPage.vue";
import SpaceAnalysePage from "@/pages/SpaceAnalysePage.vue";
import SpaceUserManagePage from "@/pages/SpaceUserManagePage.vue";
import UserDetailPage from "@/pages/user/UserDetailPage.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/user/login',
      name: 'user login',
      component: UserLoginPage
    },
    {
      path: '/user/register',
      name: 'user register',
      component: UserRegisterPage
    },
    {
      path: '/user/profile',
      name: 'user detail',
      component: UserDetailPage
    },
    {
      path: '/addPicture',
      name: 'Add picture',
      component: AddPicturePage,
      meta: {
        access: ACCESS_ENUM.USER
      }
    },
    {
      path: '/addPicture/batch',
      name: 'Add picture by patch',
      component: AddPictureBatchPage
    },
    {
      path: '/picture/:id',
      name: 'picture details',
      component: PictureDetailPage,
      props: true,
    },
    {
      path: '/space/:id',
      name: 'space details',
      component: SpaceDetailPage,
      props: true,
    },
    {
      path: '/spaceAnalyse',
      name: 'space analyse',
      component: SpaceAnalysePage,
      props: true,
    },
    {
      path: '/addSpace',
      name: 'Add space',
      component: AddSpacePage
    },
    {
      // Middle page to allow routing
      path: '/mySpace',
      name: 'My space',
      component: MySpacePage
    },
    {
      path: '/spaceUserManage/:id',
      name: 'Manage user',
      component: SpaceUserManagePage,
      props: true,
    },
    {
      path: '/admin/userManage',
      name: 'user manage',
      component: UserManagePage,
      meta: {
        access: ACCESS_ENUM.ADMIN,
        // hideInMenuBar: true,
      }
    },
    {
      path: '/admin/pictureManage',
      name: 'picture manage',
      component: PictureManagePage,
      meta: {
        access: ACCESS_ENUM.ADMIN,
      }
    },
    {
      path: '/admin/spaceManage',
      name: 'space manage',
      component: SpaceManagePage,
      meta: {
        access: ACCESS_ENUM.ADMIN,
      }
    },
    {
      path: '/noAuth',
      name: 'no authentication',
      component: NoAuthPage,
    },
  ],
})

export default router
