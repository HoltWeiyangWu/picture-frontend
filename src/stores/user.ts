import {defineStore} from "pinia";
import {ref} from "vue";

export const useLoginUserStore = defineStore("loginUser", ()=>{
    const loginUser = ref<any>({
        userName: "not login",
    });

    async function fetchLoginUser() {
        // TODO: Check user state

        // Test
        setTimeout(() => {
            loginUser.value = { userName: 'Test user', id: 1 }
        }, 3000)
    }

    function setLoginUser(newLoginUser: any) {
        loginUser.value = newLoginUser;
    }

    return {loginUser,setLoginUser,fetchLoginUser};
})