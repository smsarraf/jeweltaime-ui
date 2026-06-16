import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { setupAuthInterceptor } from './utils/auth'

// Setup axios interceptors for JWT token handling
setupAuthInterceptor()

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')