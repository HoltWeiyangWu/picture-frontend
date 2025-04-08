import router from "@/router"
import {useLoginUserStore} from "@/stores/user.ts";
import {message} from "ant-design-vue";

let firstFetchLoginUser = true;

/**
 * Global authentication
 */
router.beforeEach(async (to, from, next) => {
    const loginUserStore = useLoginUserStore()
    let loginUser = loginUserStore.loginUser
    //
    if (firstFetchLoginUser) {
        await loginUserStore.fetchLoginUser()
        loginUser = loginUserStore.loginUser
        firstFetchLoginUser = false
    }
    const toUrl = to.fullPath
    if (toUrl.startsWith("/admin")) {
        if (!loginUser || loginUser.userRole !== "admin") {
            message.error("No authorisation found")
            next(`/user/login?redirect=${toUrl}`)
            return
        }
    }
    next()
})