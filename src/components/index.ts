import {defineAsyncComponent} from "vue";
export default {
  install(app: any) {
    const components = import.meta.glob("./*.vue");
    for (let [key, value] of Object.entries(components)) {
      let componentName = key.replace("./", "").split(".")[0];
      app.component(componentName, defineAsyncComponent(value));
    }
  },
};
