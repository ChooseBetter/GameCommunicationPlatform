<template>
  <nav-header ref="navheaderRef" v-if="$route.meta.isShowHeader"></nav-header>
  <router-view
    :key="$route.matched[0]?.path"
    @getSearchContent="getSearchContent"
  ></router-view>
  <div
    v-if="$route.meta.isShowHeader"
    class="complaint"
    @click="$router.push('/square/6411be69b83fae67a42c77f6')"
  >
    <el-icon><Message /></el-icon>
  </div>
</template>
<script setup lang="ts">
import {ref} from "vue";
import {commonStore} from "@/store/common";

const {updateStateData} = commonStore();
const navheaderRef = ref();

// 获取搜索框内容
const getSearchContent = () => {
  updateStateData("content", navheaderRef.value.searchContent);
};
</script>
<style lang="less">
body {
  background-color: #f4f4f5;
}
html,
body {
  width: 100%;
  height: 100%;
}
#app {
  width: 100%;
  height: 100%;
}
li {
  list-style: none;
  cursor: pointer;
}
ul {
  margin: 0;
  padding: 0;
}
.complaint {
  position: fixed;
  right: 40px;
  bottom: 100px;
  width: 40px;
  height: 40px;
  line-height: 50px;
  border-radius: 50%;
  background-color: #fff;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
  &:hover {
    background-color: #f2f6fc;
  }
  i {
    font-size: 20px;
    color: #007fff;
  }
}
</style>
