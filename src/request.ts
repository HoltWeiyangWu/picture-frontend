import axios from "axios";
import {message} from "ant-design-vue";

const myAxios = axios.create({
    baseURL: "http://172.20.112.1:8080/api",
    timeout: 50000,
    withCredentials: true
})

myAxios.interceptors.response.use(
    function (config) {
        // Do something before request is send
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
)

myAxios.interceptors.response.use(
    function (response) {
        const {data} = response
        // User not login
        if (data.code === 40100) {
            // User is not requesting user info and not at login page, then redirect
            if (!response.request.responseURL.includes('user/get/login') &&
            !window.location.href.includes('user/login')) {
                message.warning('Please login')
                window.location.href = `/user/login?redirect=${window.location.href}`
            }
        }
        return response
    },
    function (error) {
        // Do something with response error
        return Promise.reject(error);
    }
)

export default myAxios;