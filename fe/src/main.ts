import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'
import { clerkPlugin } from '@clerk/vue'

const app = createApp(App)

app.use(clerkPlugin, { publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string })
app.use(router)
app.use(createPinia())

app.mount('#app')