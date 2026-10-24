import './styles.css'
import { createApp } from 'vue'
import App from './App.vue'
import { install } from 'element-plus'
import 'element-plus/dist/index.css'
import AppShell from './components/AppShell'
import router from './router'
import { useStore } from './store'

const app = createApp({
  onError(error) {
    console.error(error)
  }
})
app.use(router)
app.use(Store)
app.mount('#app')
