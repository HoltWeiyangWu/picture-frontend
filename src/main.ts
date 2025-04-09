import { createApp } from 'vue'

import router from './router'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import App from './App.vue'
import 'ant-design-vue/dist/reset.css'
import "@/access/index.ts"

const app = createApp(App)
app.use(Antd)
app.use(createPinia())
app.use(router)
app.mount('#app')
