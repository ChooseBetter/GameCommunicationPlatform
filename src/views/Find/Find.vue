<template>
  <div id="forget-password">
    <div class="header">
      <i class="iconfont icon-hudun"></i>
      <span class="title">安全中心</span>
    </div>
    <el-card class="content-container">
      <div class="steps">
        {{ curActive }}
        <el-steps
          :space="300"
          :active="curActive"
          finish-status="success"
          align-center
        >
          <el-step title="验证码" />
          <el-step title="重置密码" />
          <el-step title="完成" />
        </el-steps>
      </div>
      <div class="content">
        <router-view
          :key="$route.fullPath"
          @changeStep="changeStep"
        ></router-view>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";

const curActive = ref(0);

const changeStep = (step: number) => {
  curActive.value = step;
};
</script>

<style scoped lang="less">
#forget-password {
  width: 100%;
  height: 100%;
  background-color: rgb(249, 251, 255);
  .header {
    display: flex;
    width: 100%;
    height: 3.75rem;
    line-height: 3.75rem;
    color: #fff;
    font-weight: bolder;
    padding-left: 3.75rem;
    box-sizing: border-box;
    background-color: rgb(58, 119, 253);
    .iconfont {
      font-size: 1.5rem;
    }
    .title {
      padding-left: 0.3125rem;
    }
  }
  .content-container {
    width: 60rem;
    margin: 100px auto;
    .steps {
      margin-top: 50px;
    }
    .content {
      width: 25rem;
      margin: 50px auto 50px auto;
    }
  }
}
</style>
