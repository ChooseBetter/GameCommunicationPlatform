<template>
  <navigation
    v-if="$route.meta.isShowNav"
    mode="horizontal"
    :nav-list="navList"
    :nav-style="{position: 'fixed'}"
    :container-style="{'margin-left': '17.1875rem', width: '960px'}"
    @handleItemClick="handleItemClick"
  >
  </navigation>
  <div id="search">
    <div class="content">
      <div class="center">
        <entry-list-container
          :hasTab="curNav.type !== 'user'"
          :reqUrl="reqUrl"
          :curNav="curNav"
        >
          <template v-if="curNav.type === 'user'" #item="{listData}">
            <template v-for="item in listData" :key="item._id">
              <li class="item" v-if="userInfo._id !== item._id">
                <div class="info-wrapper">
                  <img :src="item.avatar" alt="" />
                  <div class="info-box">
                    <div class="info-header">
                      <span>{{ item.userName }}</span>
                      <div class="grade">
                        <i class="iconfont icon-dengji">
                          <span>
                            {{ Utils.handleExperience(item.experience)[0] }}
                          </span>
                        </i>
                      </div>
                    </div>
                    <div class="info-meta">
                      <span v-if="item.articlesCount === 0">
                        {{ item.articlesCount }}&nbsp;文章
                      </span>
                      <span>{{ item.fansCount }}&nbsp;关注者</span>
                    </div>
                  </div>
                </div>
                <el-button
                  type="success"
                  :plain="!hasAttention(item._id)"
                  @click="handleAttention(item._id)"
                >
                  {{ hasAttention(item._id) ? "已关注" : "关注" }}
                </el-button>
              </li>
            </template>
          </template>
        </entry-list-container>
      </div>
    </div>
    <el-backtop :visibility-height="100" :bottom="50" />
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onBeforeMount} from "vue";
import {storeToRefs} from "pinia";
import {userStore} from "@/store/user";
import {commonStore} from "@/store/common";
import {reqAttention} from "@/service/search";
import {navListType} from "@/store/type";
import Utils from "@/utils";

const store = commonStore();
const {formatList, updateStateData, updateEntryListAction} = store;
const {tagList} = storeToRefs(store);
const {updateUserInfo} = userStore();
const {userInfo} = storeToRefs(userStore());
const emits = defineEmits(["getSearchContent"]);
const navList = formatList(tagList.value, "tag");

// 请求地址
const reqUrl = ref("/articles/lists");
// 导航默认选中
const curNav = ref({label: "综合", value: "0", type: "0"});

onBeforeMount(() => {
  updateStateData("entryList", []);
  navList.push({label: "用户", value: "user", type: "user"});
  navList.unshift({label: "综合", value: "0", type: "0"});
});

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

// 处理导航选中
const handleItemClick = (curNavObj: navListType) => {
  if (curNavObj.type === "user") {
    reqUrl.value = `/${curNavObj.type}s/lists`;
  } else {
    reqUrl.value = "/articles/lists";
  }
  curNav.value = curNavObj;
  emits("getSearchContent");
};
</script>

<style scoped lang="less">
#search {
  .content {
    margin: 3.75rem auto;
    width: 60rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .item {
      width: 43.75rem;
      margin: 0 auto;
      padding: 23px 26px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      border-bottom: 1px solid @borderColor;
      .info-wrapper {
        display: flex;
        justify-content: space-between;
        height: 45px;
        img {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          margin-right: 20px;
        }
        .info-box {
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .info-header {
            display: flex;
            font-size: 20px;
            .grade {
              margin-left: 3px;
              i {
                position: relative;
                top: -6px;
                font-size: 12px;
                color: #007fff;
                span {
                  position: absolute;
                  top: -1px;
                  left: 17px;
                  color: #fff;
                }
              }
            }
          }
          .info-meta {
            color: @fontColor;
            font-size: 12px;
            span {
              margin-right: 10px;
            }
          }
        }
      }
      button {
        padding: 0 25px;
        width: 90px;
      }
    }
  }
}
</style>
