<template>
  <div id="publish-container">
    <textEditor ref="textEditorRef"></textEditor>
    <div class="bottom-action-bar">
      <div class="button-container">
        <el-button size="large" @click="$router.push('/')">返回</el-button>
        <el-button type="primary" size="large" @click="publishAction">
          发布文章
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";

// text-editor的组件实例
const textEditorRef = ref();

// 发布文章操作
const publishAction = () => {
  // 调用text-editor中的publishData方法
  textEditorRef.value.publishData();
};
</script>

<style scoped lang="less">
#publish-container {
  .bottom-action-bar {
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: space-around;
    position: fixed;
    bottom: 0;
    align-items: center;
    background-color: #fff;
    border-top: 1px solid @borderColor;
  }
}
</style>
