<template>
  <div id="user">
    <router-view></router-view>
    <el-backtop :visibility-height="100" :bottom="50" />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
#user {
  margin: 0 auto;
}
</style>
