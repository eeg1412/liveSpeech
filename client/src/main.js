import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import router from './router'
import store from './store'
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import './assets/css/common.css'
import 'primevue/resources/primevue.min.css'
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css';

createApp(App).use(store).use(router).use(PrimeVue).use(ToastService).use(ConfirmationService).mount('#app')
