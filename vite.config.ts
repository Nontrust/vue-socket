import { fileURLToPath, URL } from 'node:url'

import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
// @ts-ignore
export default ({ mode } : {mode: string}) => {
  const env: Record<string, string> = loadEnv(mode, process.cwd(), "");
  return defineConfig({
    define:{
      "process.env": env,
    },
    plugins: [
      vue(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  })
}
