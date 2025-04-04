import { createRouter, createWebHistory } from 'vue-router'
import HomePage from "@/pages/HomePage.vue";
import UserLoginPage from "@/pages/UserLoginPage.vue";
import UserRegisterPage from "@/pages/UserRegisterPage.vue";
import UserManagePage from "@/pages/UserManagePage.vue";

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
      path: '/admin/userManage',
      name: 'user manage',
      component: UserManagePage
    }
  ],
})

export default router
