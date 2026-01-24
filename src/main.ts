import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// Mount the app
app.mount('#app')

// Log app version for debugging
console.log('Save It! - Vue 3 Edition - v1.0.0')
