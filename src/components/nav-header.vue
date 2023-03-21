<template>
  <el-affix position="top">
    <div class="nav-header">
      <!-- 头部左侧logo -->
      <div class="header-left">
        <div class="logo">
          <img src="@/assets/vue.svg" alt="" /> <span>游戏交流平台</span>
        </div>
        <ul class="header-left-list">
          <li
            v-for="item in list"
            :key="item.value"
            @click="handleItemClick(item)"
          >
            <span :class="{isActive: item.value === current}">
              {{ item.label }}
            </span>
          </li>
        </ul>
      </div>
      <!-- 头部右侧 -->
      <div class="header-right">
        <!-- 搜索框 -->
        <el-input
          class="searchBox"
          placeholder="搜索"
          v-model="searchContent"
          @keyup.enter.native="handleSearch"
        >
          <template #append>
            <el-button icon="Search" @click="handleSearch"></el-button>
          </template>
        </el-input>
        <!-- 右侧列表 -->
        <ul class="header-right-list">
          <li>
            <el-button
              class="link"
              icon="edit"
              link
              @click="$router.push('/publish')"
              >发布</el-button
            >
          </li>
          <li class="message-bell">
            <el-dropdown>
              <el-badge :max="99" class="item">
                <el-icon color="#A8ABB2" size="30px"><BellFilled /></el-icon>
              </el-badge>

              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>评论</el-dropdown-item>
                  <el-dropdown-item>点赞</el-dropdown-item>
                  <el-dropdown-item>关注</el-dropdown-item>
                  <el-dropdown-item>系统消息</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </li>
          <li v-if="token && userInfo">
            <el-popover placement="bottom" :width="200" trigger="click">
              <template #reference>
                <el-avatar
                  class="el-dropdown-link"
                  :size="30"
                  :src="userInfo.avatar"
                >
                </el-avatar>
              </template>
              <template #default>
                <div class="user-card">
                  <div class="user-info" @click="handleDropwnList('user')">
                    <img :src="userInfo.avatar" alt="" />
                    <span>{{ userInfo.userName }}</span>
                  </div>
                  <div class="user-detail">
                    <div class="progress">
                      <div class="core">
                        <span
                          >等级:<span class="grade">
                            {{ Utils.handleExperience(userInfo.experience)[0] }}
                          </span></span
                        >
                      </div>
                      <el-progress
                        :percentage="
                          Utils.handleExperience(userInfo.experience)[1]
                        "
                        :stroke-width="18"
                        text-inside
                      />
                    </div>
                    <ul class="user-meta">
                      <li>
                        <span class="item-count">
                          {{ userInfo.attentionsList.length }}
                        </span>
                        <span class="item-name">关注</span>
                      </li>
                      <li>
                        <span class="item-count">{{ userInfo.fansCount }}</span>
                        <span class="item-name">粉丝</span>
                      </li>
                      <li>
                        <span class="item-count">
                          {{ userInfo.favoritesCount }}</span
                        >
                        <span class="item-name">收藏</span>
                      </li>
                    </ul>
                  </div>
                  <ul class="dropdown-list">
                    <li
                      v-for="item in dropdownList"
                      :key="item.value"
                      @click="handleDropwnList(item.value)"
                    >
                      <el-icon><component :is="item.icon" /></el-icon>
                      <span>{{ item.label }}</span>
                    </li>
                  </ul>
                  <div class="group">
                    <div>设置</div>
                    <div @click="handleExit">退出登录</div>
                  </div>
                </div>
              </template>
            </el-popover>
          </li>
          <li v-else>
            <el-button
              class="login-register"
              type="primary"
              @click="
                router.push({path: '/login', query: {redirect: route.fullPath}})
              "
            >
              登录&nbsp;&nbsp;|&nbsp;&nbsp;注册
            </el-button>
          </li>
        </ul>
      </div>
    </div>
  </el-affix>
</template>

<script setup lang="ts">
import {ref, reactive} from "vue";
import {storeToRefs} from "pinia";
import {userStore} from "@/store/user";
import {commonStore} from "@/store/common";
import {useRoute, useRouter} from "vue-router";
import Utils from "@/utils";

const store = userStore();
const route = useRoute();
const router = useRouter();
// 获取token、userInfo来判断是否登录
const {token, userInfo} = storeToRefs(store);
const {content} = storeToRefs(commonStore());
// 左侧list当前选中
const current = ref(1);
// 左侧list数据
const list = ref([
  {label: "首页", value: 1},
  {label: "频道", value: 2},
]);
// 搜索框内容
const searchContent = ref("");

// 下拉列表
const dropdownList = reactive([
  {label: "我的主页", value: "user", icon: "User"},
  {label: "我的收藏", value: "collect", icon: "Star"},
]);

// 头部左侧列表点击事件
interface itemType {
  label: string;
  value: number;
}

// 左侧list点击事件
const handleItemClick = (item: itemType) => {
  current.value = item.value;
  if (item.value === 1) {
    router.push("/");
  }
};

// 处理下拉列表的点击事件
const handleDropwnList = (value: string) => {
  if (value === "user") {
    router.push(`/user/${userInfo.value._id}`);
  }
};

// 退出登录
const handleExit = () => {
  store.Logout();
  if (router.currentRoute.value.matched[0].path === "/user") {
    router.push("/");
  }
};

// 搜索事件
const handleSearch = () => {
  content.value = searchContent.value;
  router.push({path: "/search", query: {content: searchContent.value}});
};

defineExpose({
  searchContent,
});
</script>

<style scoped lang="less">
:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color))
    inset;
}
.el-button:hover,
.el-button:active {
  background: @blue;
  color: #ffffff;
  border-color: @blue;
}
:deep(.el-progress-bar__outer) {
  background-color: rgb(196, 222, 255);
}
.nav-header {
  padding: 0 1.875rem;
  width: 100%;
  min-width: 60rem;
  height: 3.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  border-bottom: 0.125rem solid #e9e9eb;
  background-color: #fff;
  .header-left {
    margin: 0 1.25rem;
    height: 100%;
    display: flex;
    align-items: center;
    .logo {
      margin-right: 0.625rem;
      display: flex;
      align-items: center;
      cursor: pointer;
      span {
        display: inline-block;
        font-weight: bolder;
        white-space: nowrap;
      }
    }
    .header-left-list {
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: space-around;
      align-items: center;
      li {
        box-sizing: content-box;
        color: @fontColor;
        span {
          margin: 0 0.5rem;
          display: block;
          height: 3.75rem;
          line-height: 3.75rem;
          box-sizing: border-box;
          overflow: hidden;
        }
        .isActive {
          color: #000;
          font-weight: bolder;
          border-bottom: 0.2rem solid @red;
        }
      }
    }
  }
  .header-right {
    margin: 0 1.25rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .searchBox {
      margin-right: 3rem;
      width: 20rem;
    }
    .header-right-list {
      display: flex;
      justify-content: space-around;
      align-items: center;
      li {
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin: 0 0.625rem;
        width: 100%;
        height: 3.75rem;
        .link {
          font-size: 1rem;
          color: @blue;
        }
        .login-register {
          margin-left: 0.625rem;
        }
      }
    }
  }
}
.user-card {
  width: 174px;
  .user-info {
    height: 40px;
    display: flex;
    align-items: center;
    cursor: pointer;
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    span {
      padding-left: 10px;
      font-size: 20px;
      font-weight: bolder;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .user-detail {
    margin: 12px 0 6px;
    height: 115px;
    border-bottom: 1px solid #e9e9eb;
    .progress {
      padding: 5px;
      height: 50px;
      border-radius: 5px;
      box-sizing: border-box;
      background: linear-gradient(
        rgba(30, 128, 255, 0.1),
        rgba(30, 128, 255, 0.05)
      );
      .core {
        color: #1e80ff;
        .grade {
          margin-left: 5px;
          font-weight: bolder;
        }
      }
      .el-progress {
        margin: 3px 0;
      }
    }
    .user-meta {
      padding: 12px 0;
      display: flex;
      justify-content: space-around;
      align-items: center;
      li {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 50px;
        height: 40px;
        .item-count {
          font-weight: bolder;
        }
      }
    }
  }
  .dropdown-list {
    padding: 6px 0 12px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-items: center;
    border-bottom: 1px solid #e9e9eb;
    li {
      display: flex;
      align-items: center;
      padding: 6px;
      &:hover {
        background-color: #f2f2f5;
      }
      i {
        height: 18px;
      }
      span {
        display: inline-block;
        margin-left: 3px;
        height: 18px;
      }
    }
  }
  .group {
    display: flex;
    justify-content: space-between;
    div {
      margin-top: 6px;
      cursor: pointer;
      color: #8e9a9f;
      &:hover {
        color: @fontColor;
      }
    }
  }
}
</style>
