import animateNum from "./animate-number";
import dateFormat from "./date-format";
import imageLazy from "./image-lazy";

const directives: any = {
  animateNum,
  dateFormat,
  imageLazy,
};
export default {
  install(app: any) {
    Object.keys(directives).forEach((key: any) => {
      app.directive(key, directives[key]);
    });
  },
};
