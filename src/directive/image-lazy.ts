import loadingErrorImg from "@/assets/images/loading-error.png";
import {useIntersectionObserver} from "@vueuse/core";

export default {
  mounted(el: any, binding: any) {
    const {stop} = useIntersectionObserver(
      // 监听目标元素
      el,
      ([{isIntersecting}], observerElement) => {
        if (isIntersecting) {
          el.onerror = () => {
            el.src = loadingErrorImg;
          };
          el.src = binding.value;
          stop();
        }
      }
    );
  },
};
