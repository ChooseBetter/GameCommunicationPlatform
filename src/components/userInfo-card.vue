<template>
  <div class="userInfo-card">
    <div class="user-item">
      <img v-imageLazy="otherUserInfo.avatar" alt="" />
      <div class="info-box">
        <div class="userName">
          <div>{{ otherUserInfo.userName }}</div>
          <div class="grade">
            <i class="iconfont icon-dengji">
              <span>
                {{ Utils.handleExperience(otherUserInfo.experience)[0] }}
              </span>
            </i>
          </div>
        </div>
        <div class="signature">
          {{ otherUserInfo.signature }}
        </div>
      </div>
    </div>
    <div class="operate-btn">
      <el-button
        type="primary"
        :disabled="otherUserInfo._id === userInfo._id"
        @click="handleAttention(otherUserInfo._id)"
        >{{
          userInfo.attentionsList.includes(otherUserInfo._id)
            ? "已关注"
            : "关注"
        }}</el-button
      >
    </div>
    <div class="statistics-item">
      <div class="icon-container">
        <i class="iconfont icon-dianzan"></i>
      </div>
      拥有粉丝数&nbsp;{{ otherUserInfo.fansCount }}
    </div>
    <div class="statistics-item">
      <div class="icon-container">
        <i class="iconfont icon-chakan"></i>
      </div>
      发布文章数&nbsp;{{ otherUserInfo.articlesCount }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {storeToRefs} from "pinia";
import {userStore} from "@/store/user";
import {commonStore} from "@/store/common";
import {reqAttention} from "@/service/user";
import Utils from "@/utils";

interface Props {
  otherUserInfo: any;
}
const props = withDefaults(defineProps<Props>(), {
  otherUserInfo: {},
});

const {userInfo} = storeToRefs(userStore());
const {updateUserInfo} = userStore();
const {updateEntryListAction} = commonStore();

// 是否关注了
const hasAttention = computed(() => {
  return (_id: string) => {
    return userInfo.value.attentionsList.includes(_id);
  };
});

// 点击关注
const handleAttention = async (_id: string) => {
  const {data} = await reqAttention("/users/attention", {
    _id,
    userId: userInfo.value._id,
    hasAttention: hasAttention.value(_id),
  });
  updateEntryListAction(data[0]);
  updateUserInfo(data[1]);
};
</script>

<style scoped lang="less">
.userInfo-card {
  padding: 15px;
  .user-item {
    display: flex;
    align-items: center;

    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }
    .info-box {
      margin-left: 15px;
      span {
        display: inline-block;
        width: 100%;
      }
      .userName {
        display: flex;
        font-size: 20px;
        div {
          max-width: 85px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .grade {
          i {
            position: relative;
            top: -7px;
            font-size: 12px;
            color: #007fff;
            span {
              position: absolute;
              top: -1px;
              left: 18px;
              font-size: 12px;
              color: #fff;
            }
          }
        }
      }
      .signature {
        width: 100px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #8a919f;
      }
    }
  }
  .operate-btn {
    padding: 15px 0;
    border-bottom: 1px solid @borderColor;
    button {
      width: 100%;
      padding: 5px 15px;
      color: #fff;
      border: none;
      border-radius: 5px;
    }
  }
  .statistics-item {
    padding: 10px 0;
    line-height: 100%;
    font-size: 16px;
    .icon-container {
      display: inline-block;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      text-align: center;
      line-height: 30px;
      color: rgb(123, 185, 255);
      background-color: rgb(225, 239, 255);
      i {
        font-size: 22px;
      }
    }
  }
}
</style>
