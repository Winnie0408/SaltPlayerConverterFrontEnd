import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import postCssPxToRem from 'postcss-pxtorem'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    // css: {
    //     postcss: {
    //         plugins: [
    //             postCssPxToRem({
    //                 rootValue: 15,
    //                 propList: ['font-size','zoom'],
    //             })
    //         ]
    //     }
    // },
})
