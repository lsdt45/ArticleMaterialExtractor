import { createApp } from 'vue';
import App from './App.vue';
import router from '@renderer/router';
import { pinia } from '@renderer/store/store';

const app = createApp(App);

app.use(router);
app.use(pinia);
app.mount('#app');
