
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

if (navigator.storage && navigator.storage.persist)
    navigator.storage.persist().then(function (persistent) {
        if (persistent)
            console.log("Storage will not be cleared except by explicit user action");
        else
            console.log("Storage may be cleared by the UA under storage pressure.");
    });

const app = createApp(App)

app.use(router)

app.mount('#app')
