import {createApp} from "vue";
import App from "./App.vue";
import router from "./router";
import {createPinia} from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "element-plus/dist/index.css";
import "normalize.css";

import PluginCom from "./components/index";
import directive from "@/directive";

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(router);
app.use(pinia);
app.use(PluginCom);
app.use(directive);
app.mount("#app");
