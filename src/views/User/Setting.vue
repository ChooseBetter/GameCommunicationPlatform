<template>
  <div id="setting">
    <div class="setting-header">
      <i class="iconfont icon-arrow-left" @click="handleBack"
        ><span>返回个人主页</span></i
      >
    </div>
    <div class="setting-container">
      <div class="settring-aside">
        <navigation
          ref="navigationRef"
          :nav-list="navList"
          :curRoute="curRoute"
          @handleSelect="handleSelect"
        >
          <template #item="{item}">
            <div class="item">
              <el-icon><component :is="item.icon"></component></el-icon
              ><span>{{ item.label }}</span>
            </div>
          </template>
        </navigation>
      </div>
      <router-view v-slot="{Component}">
        <keep-alive>
          <component
            :is="Component"
            :userEntireInfo="userEntireInfo"
            @reacquireUserEntireInfo="getUserEntireInfo"
          />
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch, onBeforeMount} from "vue";
import router from "@/router";
import {userStore} from "@/store/user";

const {userInfo, getUserEntireInfoAction} = userStore();
const navList = ref([
  {label: "个人资料", value: "profile", icon: "Postcard"},
  {label: "账号设置", value: "account", icon: "Setting"},
  {label: "消息设置", value: "message", icon: "BellFilled"},
]);
const userEntireInfo = ref<any>({});
const curRoute = ref();

onBeforeMount(() => {
  getUserEntireInfo();
});

// 获取用户完整数据
const getUserEntireInfo = async () => {
  let url = `/users/${userInfo._id}`;
  const res = await getUserEntireInfoAction(url);
  if (res.code === 200) {
    userEntireInfo.value = res.data;
  }
};

// 返回个人主页
const handleBack = () => {
  router.push(`/user/${userInfo._id}`);
};

const handleSelect = (key: string) => {
  router.push(`/user/settings/${key}`);
};

watch(
  () => router.currentRoute.value,
  (newValue) => {
    curRoute.value = newValue;
    getUserEntireInfo();
  },
  {immediate: true, deep: true}
);
</script>

<style scoped lang="less">
#setting {
  margin: 20px auto;
  width: 1000px;
  .setting-header {
    padding-left: 22px;
    height: 45px;
    line-height: 45px;
    font-weight: bolder;
    background-color: #fff;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 5%);
    i {
      color: #909090;
      cursor: pointer;
    }
  }
  .setting-container {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    .settring-aside {
      padding: 5px;
      width: 215px;
      background-color: #fff;
      .item {
        display: flex;
        align-items: center;
        i {
          margin-right: 10px;
          font-size: 24px;
        }
      }
    }
  }
}
</style>
