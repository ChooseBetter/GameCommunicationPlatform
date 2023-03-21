<template>
  <div id="success">
    <el-button type="primary" @click="gotoLogin">返回登录界面</el-button>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
const router = useRouter();
const emits = defineEmits(["changeStep"]);
const gotoLogin = () => {
  emits("changeStep", 3);
  router.push("/login");
};
</script>

<style scoped>
#success {
  text-align: center;
}
</style>
