import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

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
    server: {
        open: true,
        host: "0.0.0.0",
    }
})
