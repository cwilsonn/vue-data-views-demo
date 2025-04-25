// Third-party
import { createApp } from 'vue';
import { router } from '@/routes';

// Assets
import './assets/main.css';

// Components
import App from './App.vue';

const app = createApp(App);

app.use(router);
app.mount('#app');
