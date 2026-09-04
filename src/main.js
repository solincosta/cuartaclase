import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import MenuComponent from './components/MenuComponent.vue'
import BannerComponent from './components/BannerComponent.vue'
import CardComponent from './components/CardComponent.vue'

const app = createApp(App).use(router);

app.component("MenuComponent", MenuComponent);
app.component("BannerComponent", BannerComponent);
app.component("CardComponent", CardComponent);

app.mount('#app');
