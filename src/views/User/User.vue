<template>
  <div id="page">
    <div class="content">
      <div class="center">
        <div class="user-info-container">
          <img :src="userEntireInfo.avatar" alt="" />
          <div class="info-box">
            <div class="info-box-header">
              <span>{{ userEntireInfo.userName }}</span>
            </div>
            <div class="info-box-center">
              <div class="grade">
                <i class="iconfont icon-dengji">
                  <span>{{
                    Utils.handleExperience(userEntireInfo.experience)[0]
                  }}</span>
                </i>
              </div>
            </div>
            <div class="info-box-footer">
              <div class="introduction">
                <span v-if="!userEntireInfo.signature">
                  该用户很高冷，没有留下个性签名
                </span>
                <template v-else>
                  <el-tooltip placement="bottom" effect="light">
                    <template #content>
                      {{ userEntireInfo.signature }}
                    </template>
                    <span> {{ userEntireInfo.signature }}</span>
                  </el-tooltip>
                </template>
              </div>
              <div class="settingBtn" @click="handleSettingBtn">
                编辑个人资料
              </div>
            </div>
          </div>
        </div>
        <navigation
          mode="horizontal"
          :container-style="{
            'padding-left': '12px',
            'padding-top': '10px',
          }"
          :nav-list="navlist"
          @handleItemClick="handleItemClick"
        ></navigation>
        <div class="list-wrap">
          <entry-list-container
            :tabs="tabs"
            :contentStyle="{backgroundColor: 'none'}"
            :extra-data="{authorId: userInfo._id}"
            :hasTab="curNav?.type !== 'theme'"
            :reqUrl="reqUrl"
            :curNav="curNav"
            @handleSort="handleSort"
          >
            <template v-if="curNav?.type === 'theme'" #item="{listData}">
              <li v-for="(item, index) in listData" :key="item._id">
                <div class="base">
                  <div class="list-header">
                    <img :src="item.authorInfo.avatar" alt="" />
                    <div class="list-header-content">
                      <div class="userName">{{ item.authorInfo.userName }}</div>
                      <div class="time" v-dateFormat="'MM月DD日 HH:mm'">
                        {{ item.createTime }}
                      </div>
                    </div>
                  </div>
                  <div class="list-content">
                    <div v-html="item.content"></div>
                  </div>
                </div>
                <div class="action">
                  <i
                    :class="[
                      'iconfont',
                      'icon-dianzan',
                      item.like.includes(userInfo._id) ? 'is-like' : '',
                    ]"
                    @click="handleIconClick('like', item)"
                    >&nbsp;{{ item.likeCount || "点赞" }}
                  </i>
                  <i
                    :class="[
                      'iconfont',
                      'icon-pinglun',
                      selectedComment === item._id ? 'is-click' : '',
                    ]"
                    @click="handleIconClick('comment', item, index)"
                    >&nbsp;{{ item.commentCount || "评论" }}
                  </i>
                </div>
                <comment-container
                  v-show="selectedComment === item._id"
                  ref="commentContainerRef"
                  :articleOrThemeId="item._id"
                  :userInfo="userInfo"
                  :commentLength="item.comment.length"
                ></comment-container>
              </li>
            </template>
          </entry-list-container>
        </div>
      </div>
      <aside-sidebar>
        <template #aside>
          <ul class="follow-block">
            <li>
              <span>粉丝</span>
              <span>{{ userEntireInfo.fansCount }}</span>
            </li>
            <li>
              <span>关注</span>
              <span>{{ userEntireInfo.attentionsCount }}</span>
            </li>
          </ul>
          <ul class="more-block">
            <li>
              <span>发布文章</span>
              <span>{{ userEntireInfo.articlesCount }}</span>
            </li>
            <li>
              <span>收藏</span>
              <span>{{ userEntireInfo.favoritesCount }}</span>
            </li>
            <li>
              <span>加入于</span>
              <span>
                {{ Utils.formatDate(userEntireInfo.createTime, "YYYY-MM-DD") }}
              </span>
            </li>
          </ul>
        </template>
      </aside-sidebar>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onBeforeMount} from "vue";
import {userStore} from "@/store/user";
import {commonStore} from "@/store/common";
import {navListType} from "@/store/type";
import Utils from "@/utils";
import {useTheme} from "@/hooks/use-theme";

const {getUserEntireInfoAction} = userStore();
const {updateStateData} = commonStore();

const emits = defineEmits(["getSearchContent"]);
const [
  route,
  router,
  store,
  commentContainerRef,
  selectedComment,
  userInfo,
  handleIconClick,
  isLogin,
] = useTheme();
// 列表标签
const tabs = [
  {title: "最新", value: 2},
  {title: "热门", value: 3},
];
// 导航标签
const navlist = [
  {label: "文章", value: "article", type: "article"},
  {label: "话题", value: "theme", type: "theme"},
];

// 用户完整信息
const userEntireInfo = ref<any>({});
// 导航默认选中
const curNav = ref<navListType>();
// 请求地址
const reqUrl = ref("/articles/lists");

onBeforeMount(async () => {
  await updateStateData("entryList", []);
  let url = `/users/${router.currentRoute.value.params._id}`;
  const res = await getUserEntireInfoAction(url);
  if (res.code === 200) {
    userEntireInfo.value = res.data;
  }
  curNav.value = navlist[0];
});

// 处理导航选中
const handleItemClick = (curNavObj: navListType) => {
  if (curNavObj.type === "theme") {
    reqUrl.value = `/${curNavObj.type}s/lists`;
  } else {
    reqUrl.value = "/articles/lists";
  }
  curNav.value = curNavObj;
};

// 处理排序改动
const handleSort = () => {
  emits("getSearchContent");
};

// 点击修改资料
const handleSettingBtn = () => {
  router.push("/user/settings");
};
</script>

<style scoped lang="less">
#user {
  .content {
    margin: 1.25rem auto;
    width: 60rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .user-info-container {
      display: flex;
      width: 700px;
      padding: 30px;
      margin-bottom: 20px;
      box-sizing: border-box;
      background-color: #fff;
      box-shadow: 0 1px 2px 0 rgb(0 0 0 / 5%);
      img {
        margin-right: 30px;
        width: 90px;
        height: 90px;
        border-radius: 50%;
      }
      .info-box {
        width: 100%;
        .info-box-header {
          span {
            font-size: 24px;
            font-weight: bolder;
          }
        }
        .info-box-center {
          margin-top: 12px;
          .grade {
            i {
              position: relative;
              top: -6px;
              font-size: 18px;
              color: #007fff;
              span {
                position: absolute;
                top: -1px;
                left: 26px;
                color: #fff;
              }
            }
          }
        }
        .info-box-footer {
          margin: 6px 0;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .introduction {
            width: 350px;
            font-size: 14px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            &:hover {
              color: #007fff;
            }
          }
          .settingBtn {
            width: 120px;
            height: 30px;
            padding: 3px 10px;
            box-sizing: border-box;
            border-radius: 5px;
            color: #007fff;
            border: 2px solid #007fff;
            cursor: pointer;
          }
        }
      }
    }
    .list-wrap {
      margin-top: 20px;

      li {
        margin-bottom: 10px;
        background-color: #fff;
        .base {
          padding: 20px 20px 0 20px;
          border-bottom: 1px solid #e9e9eb;
          .list-header {
            display: flex;
            img {
              width: 50px;
              height: 50px;
              border-radius: 50%;
            }
            .list-header-content {
              margin-left: 10px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              .userName {
                font-size: 20px;
                font-weight: bolder;
              }
              .time {
                color: #8a919f;
              }
            }
          }
          .list-content {
            padding-left: 50px;
          }
        }
        .action {
          display: flex;
          justify-content: space-around;
          i {
            margin: 5px 15px;
            flex: 1;
            text-align: center;
            cursor: pointer;
            color: @fontColor;
            font-size: 21px;
            &:hover {
              // color: #8a919f;
              font-weight: bolder;
              opacity: 0.7;
            }
          }
          .is-like {
            color: @red;
            font-weight: bolder;
            &:hover {
              color: @red;
            }
          }
          .is-click {
            color: #007fff;
            font-weight: bolder;
          }
        }
      }
    }
    .follow-block {
      margin-bottom: 10px;
      display: flex;
      justify-content: space-evenly;
      background-color: #fff;
      box-shadow: 0 1px 2px 0 rgb(0 0 0 / 5%);
      li {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        padding: 10px;
        span {
          &:nth-child(2) {
            font-weight: bolder;
          }
        }
      }
    }
    .more-block {
      padding: 0 10px;
      background-color: rgba(255, 255, 255, 0.7);
      li {
        display: flex;
        justify-content: space-between;
        padding: 15px 0;
        box-sizing: border-box;
        &:not(:last-child) {
          border-bottom: 1px solid @borderColor;
        }
      }
    }
  }
}
</style>
