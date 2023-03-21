<template>
  <div id="swiper-slide">
    <el-carousel :interval="5000">
      <el-carousel-item v-for="item in props.swiperList" ::key="item">
        <el-image :src="item.imgUrl">
          <template #error>
            <div class="image-slot">
              <el-icon :size="50"><icon-picture /></el-icon>
            </div>
          </template>
        </el-image>
        <h1>{{ item.label }}</h1>
        <span>{{ item.info }}</span>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup lang="ts">
import {Picture as IconPicture} from "@element-plus/icons-vue";

interface swiperListType {
  label: string;
  info: string;
  imgUrl: string;
}
const props = defineProps<{
  swiperList: swiperListType[];
}>();
</script>

<style scoped lang="less">
.el-image {
  width: 100%;
  height: 100%;
  background-size: cover;
}
.image-slot {
  width: 100%;
  height: 100%;
  text-align: center;
  margin: 20% 0;
}
#swiper-slide {
  box-shadow: 0 0 5px 1px @fontColor;
  .el-carousel__container {
    position: relative;
    h1 {
      position: absolute;
      left: 1.25rem;
      bottom: 3.125rem;
      color: #fff;
      text-shadow: 0.0625rem 0.0625rem 0.0625rem grey;
    }
    span {
      position: absolute;
      left: 1.25rem;
      bottom: 1.875rem;
      color: #fff;
      text-shadow: 0.0625rem 0.0625rem 0.0625rem grey;
      font-size: 1.125rem;
    }
  }
}
</style>
