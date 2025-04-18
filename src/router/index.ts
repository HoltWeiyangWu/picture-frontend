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
      path: '/addPicture',
      name: 'Add picture',
      component: AddPicturePage
    },
    {
      path: '/picture/:id',
      name: 'picture details',
      component: PictureDetailPage,
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
      path: '/noAuth',
      name: 'no authentication',
      component: NoAuthPage,
    },
  ],
})

export default router
