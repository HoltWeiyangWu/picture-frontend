import {useLoginUserStore} from "@/stores/user.ts";
import ACCESS_ENUM from "@/access/accessEnum.ts";
import router from "@/router"
import hasAccess from "@/access/hasAccess.ts";

router.beforeEach(async (to, from, next) => {
    const loginUserStore = useLoginUserStore()
    let loginUser = loginUserStore.loginUser


    // Ensure that we have recorded the user state after the initial login
    if (!loginUser || !loginUser.userRole) {
        await loginUserStore.fetchLoginUser();
        loginUser = loginUserStore.loginUser;
    }

    const needAccess = (to.meta?.access as string) ?? ACCESS_ENUM.NOT_LOGIN

    // In case where access is authorised
    if (needAccess !== ACCESS_ENUM.NOT_LOGIN) {
        // User has to log in to access this page
        if (!loginUser || !loginUser.userRole || loginUser.userRole === ACCESS_ENUM.NOT_LOGIN) {
            next(`/user/login/?redirect=${to.fullPath}`)
            return
        }
        // User has no authorisation to access this content
        if (!hasAccess(loginUser, needAccess)) {
            next('/noAuth')
            return
        }
    }
    next()
})