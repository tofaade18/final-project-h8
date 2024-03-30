import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/router";
import store from "./store";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from './plugins/font-awesome'

createApp(App)
  .use(router)
  .use(store)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");

  new Vue({
    router,
    render: h => h(App),
  }).$mount('#app')