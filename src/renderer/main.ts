import { createApp } from 'vue';
import App from './App.vue';
import '@renderer/common/styles/index.scss';
import router from '@renderer/router';

const app = createApp(App);

app.use(router);
app.mount('#app');
