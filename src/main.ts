import {createApp} from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import axios from "axios";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'amfe-flexible'

const app = createApp(App)

app.use(ElementPlus)
app.mount('#app')
axios.defaults.baseURL = 'https://saltconv.hwinzniej.top:46000/converter'
axios.defaults.withCredentials = true

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}