<template>
  <div
    id="article"
    v-if="Object.keys(articleInfo).length !== 0"
    @click="commentContainerRef.handleblur"
  >
    <div class="content_container">
      <div class="article-suspended-panel">
        <div class="iconbtn" @click="handleLike">
          <el-badge
            class="item"
            type="primary"
            :value="articleInfo.like.length"
            :hidden="articleInfo.like.length === 0"
          >
            <i
              :class="[
                'iconfont',
                'icon-dianzan',
                articleInfo.like.includes(userInfo._id) ? 'is-like' : '',
              ]"
            >
            </i>
          </el-badge>
        </div>
        <div class="iconbtn" @click="gotoComment">
          <el-badge :value="commentTotal" class="item" type="info">
            <i class="iconfont icon-pinglun"> </i>
          </el-badge>
        </div>
        <div class="iconbtn">
          <el-badge class="item" type="primary">
            <i class="iconfont icon-jubao"> </i>
          </el-badge>
        </div>
      </div>
      <div class="content-center">
        <textEditor :isEdit="false" :articleHTML="articleInfo.content">
          <template #extra>
            <div id="article_info">
              <h1>{{ articleInfo.title }}</h1>
              <div class="info_wrapper">
                <img :src="articleInfo.authorInfo?.avatar" alt="" />
                <div class="author_info">
                  <div class="author_name">
                    <span>{{ articleInfo.authorInfo.userName }}</span>
                  </div>
                  <div class="meta_info">
                    <span
                      >{{
                        Utils.formatDate(
                          articleInfo.createTime,
                          "YYYY年MM月DD日 HH:mm"
                        )
                      }}&nbsp;&nbsp;</span
                    >
                    <span>·&nbsp;&nbsp;阅读&nbsp;{{ articleInfo.view }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </textEditor>
        <comment-container
          style="width: 54rem"
          ref="commentContainerRef"
          :articleOrThemeId="articleOrThemeId"
          :userInfo="userInfo"
          :commentLength="articleInfo.comment.length"
        ></comment-container>
      </div>
      <div class="sidebar">
        <userInfo-card :otherUserInfo="articleInfo.authorInfo"></userInfo-card>
      </div>
    </div>
    <el-backtop :visibility-height="100" :bottom="50" />
  </div>
</template>

<script setup lang="ts">
import {ref, onBeforeMount, onUnmounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import {storeToRefs} from "pinia";
import {articleOrThemeStore} from "@/store/articleOrTheme";
import {userStore} from "@/store/user";
import Utils from "@/utils";

const route = useRoute();
const router = useRouter();
const store = articleOrThemeStore();
// 获取文章信息
const {articleInfo, commentTotal} = storeToRefs(store);
// 获取用户信息
const {userInfo} = storeToRefs(userStore());
const commentContainerRef = ref();
const articleOrThemeId = route.params._id;

const articleId = route.params._id;
onBeforeMount(async () => {
  await store.getArticle(articleId as string);
  commentContainerRef.value.getCommentList();
});

// 未登录的回调
const isLogin = () => {
  if (userInfo.value._id == "") {
    router.push({path: "/login", query: {redirect: route.fullPath}});
    return false;
  } else {
    return true;
  }
};

// 文章点赞
const handleLike = () => {
  isLogin();
  const hasValue = articleInfo.value.like.indexOf(userInfo.value._id);
  if (hasValue !== -1) {
    store.cancelLike("articles", articleInfo.value._id, userInfo.value._id);
  } else {
    store.saveLike("articles", articleInfo.value._id, userInfo.value._id);
  }
};
// 滑动到评论
const gotoComment = () => {
  document
    .getElementById("comment-container")
    ?.scrollIntoView({behavior: "smooth"});
};

onUnmounted(() => {
  store.updateStateData("articleInfo", {});
  store.updateStateData("commentList", []);
});
</script>

<style scoped lang="less">
#article {
  margin-bottom: 1.25rem;
  display: flex;
  justify-content: space-around;

  .content_container {
    display: flex;
    .article-suspended-panel {
      position: fixed;
      top: 6rem;
      left: 14rem;
      .iconbtn {
        width: 3.125rem;
        height: 3.125rem;
        line-height: 3.125rem;
        text-align: center;
        border-radius: 50%;
        margin-bottom: 1.25rem;
        background-color: #fff;
        cursor: pointer;
        i {
          font-size: 1.5rem;
          color: #8a919f;
          &:hover {
            color: #5e5f63;
          }
        }
        .is-like {
          color: @blue;
          &:hover {
            color: @blue;
          }
        }
      }
    }
    .content-center {
      padding-bottom: 1.25rem;
      #article_info {
        margin-bottom: 1.25rem;
        h1 {
          margin-top: 0;
        }
        .info_wrapper {
          display: flex;
          align-items: center;
          img {
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 50%;
          }
          .author_info {
            margin-left: 0.625rem;
            .meta_info {
              color: #8a919f;
            }
          }
        }
      }
    }
    .sidebar {
      position: fixed;
      top: 5rem;
      right: 4rem;
      width: 14rem;
      background-color: #fff;
      .authorInfo {
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
            background-color: @blue;
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
    }
  }
}
</style>
