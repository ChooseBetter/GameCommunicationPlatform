<template>
  <div id="club">
    <div class="content-container">
      <div class="header">
        <div class="club-info-container">
          <img :src="squareInfo.avatar" alt="" />
          <div class="club-info">
            <div class="info-header">{{ squareInfo.squareName }}</div>
            <div class="info-introduce">{{ squareInfo.introduce }}</div>
          </div>
        </div>
      </div>
      <div class="share">
        <img
          :src="
            userInfo.avatar
              ? userInfo.avatar
              : 'http://localhost:3000/files/picture/1670991521700.jpg'
          "
          alt=""
        />
        <div
          class="input"
          placeholder="快来分享"
          @click="handleDialogVisible"
        ></div>
      </div>
      <div class="list-wrap">
        <entry-list-container
          ref="entryListContainerRef"
          :width="800"
          :contentStyle="{backgroundColor: 'none'}"
          :reqUrl="`/themes/list/${router.currentRoute.value.params._id}`"
        >
          <template #item="{listData}">
            <li v-for="(item, index) in listData" :key="item._id">
              <div class="base">
                <div class="list-header">
                  <img :src="item.authorInfo.avatar" alt="" />
                  <div class="list-header-content">
                    <div class="userName">{{ item.authorInfo.userName }}</div>
                    <div class="time">
                      {{ Utils.formatDate(item.createTime, "MM月DD日 HH:mm") }}
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
    <aside-sidebar
      :width="300"
      :sidebarConfig="sidebarConfig"
      :listData="listData"
    >
      <template #detail="{blockData}">
        <ul class="detail">
          <li>
            <span class="label">话题数</span>
            <span class="number">{{ squareInfo.themeCount }}</span>
          </li>
          <li>
            <span class="label">点赞数</span>
            <span class="number">{{ squareInfo.likeCount }}</span>
          </li>
          <li>
            <span class="label">评论数</span>
            <span class="number">{{ squareInfo.commentCount }}</span>
          </li>
        </ul>
      </template>
      <template #announcement="{blockData}">
        <div class="announcement">{{ blockData }}</div>
      </template>
    </aside-sidebar>
    <page-modal ref="pageModalRef" :modalConfig="modalConfig">
      <richEditor @handleClose="handleClose"></richEditor>
    </page-modal>
  </div>
</template>

<script setup lang="ts">
import {ref, watch, onBeforeMount} from "vue";
import {sidebarConfig} from "./sidebarConfig";
import {modalConfig} from "./modalConfig";
import richEditor from "./rich-editor.vue";
import {storeToRefs} from "pinia";
import {articleOrThemeStore} from "@/store/articleOrTheme";
import {useTheme} from "@/hooks/use-theme";
import Utils from "@/utils";

const {getSquare} = articleOrThemeStore();
const {squareInfo} = storeToRefs(articleOrThemeStore());
const listData = ref<any>([]);
const pageModalRef = ref();
const entryListContainerRef = ref();
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

onBeforeMount(async () => {
  const squareId = router.currentRoute.value.params._id;
  await getSquare(squareId as string);
});

watch(squareInfo, () => {
  listData.value.push("11111", squareInfo.value.announcement);
});

// 展示dialog的操作
const handleDialogVisible = () => {
  if (!userInfo.value._id) {
    router.push({
      path: "/login",
      query: {redirect: router.currentRoute.value.path},
    });
  } else {
    pageModalRef.value.dialogVisible = true;
  }
};
// 关闭dialog
const handleClose = () => {
  entryListContainerRef.value.resetQueryInfo();
  pageModalRef.value.dialogVisible = false;
};
</script>

<style scoped lang="less">
#page-modal {
  :deep(.w-e-text-container) {
    background-color: #f2f3f5;
  }
}
#club {
  margin: 1.25rem auto;
  width: 70rem;
  display: flex;
  justify-content: space-between;
  .content-container {
    .header {
      width: 800px;
      background-color: #fff;
      .club-info-container {
        display: flex;
        padding: 1rem;
        img {
          width: 5rem;
          height: 5rem;
          border-radius: 0.3125rem;
          margin-right: 1.25rem;
        }
        .club-info {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          .info-header {
            font-size: 1.25rem;
            font-weight: bolder;
          }
          .info-introduce {
            margin-top: 10px;
            color: @fontColor;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
      }
    }
    .share {
      margin-top: 20px;
      padding: 20px;
      height: 36px;
      display: flex;
      background-color: #fff;
      img {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        margin-right: 20px;
      }
      .input {
        padding-left: 10px;
        width: 100%;
        line-height: 36px;
        color: #8a919f;
        background-color: #f2f3f5;
        &::before {
          content: attr(placeholder);
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
  }
  .detail {
    display: flex;
    justify-content: space-evenly;
    li {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px 15px;
      color: #71777c;
      font-weight: bolder;
      .number {
        margin-top: 10px;
        color: #007fff;

        opacity: 0.5;
      }
    }
  }
  .announcement {
    padding: 15px;
    color: #8a919f;
  }
}
</style>
