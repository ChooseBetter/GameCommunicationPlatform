<template>
  <div ref="target" class="infinite-loading" :style="style">
    <div class="loading" v-if="loading">
      <span class="text">正在加载中...</span>
    </div>
    <div class="none" v-else>
      <span class="text">亲，没有更多了</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {useIntersectionObserver} from "@vueuse/core";

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  style: {
    type: Object,
    default: () => ({"background-color": "#fff"}),
  },
});
const emits = defineEmits(["infinite"]);
const target = ref(null);
useIntersectionObserver(
  target,
  ([{isIntersecting}]) => {
    if (isIntersecting) {
      if (!props.loading) {
        emits("infinite");
      }
    }
  },
  {
    threshold: 0,
  }
);
</script>

<style scoped lang="less">
.infinite-loading {
  .loading,
  .none {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    .text {
      color: #999;
      font-size: 16px;
    }
  }
}
</style>
