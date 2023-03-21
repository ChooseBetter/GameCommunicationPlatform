<template>
  <div id="comment-Item">
    <li class="comment-item">
      <img v-imageLazy="liData.userInfo?.avatar" alt="" />
      <div class="comment_info">
        <div class="comment_header">
          <div class="userName">
            <el-popover placement="top" width="250px">
              <template #reference>
                {{ liData.userInfo?.userName }}
              </template>
              <template #default>
                <userInfo-card :otherUserInfo="liData.userInfo">
                </userInfo-card>
              </template>
            </el-popover>
          </div>
          <div v-if="liData.beRepliedId">
            &nbsp;&nbsp;回复&nbsp;
            <div class="userName">
              <el-popover placement="top" width="250px">
                <template #reference>
                  {{ liData.beRepliedInfo?.userName }}
                </template>
                <template #default>
                  <userInfo-card :otherUserInfo="liData.beRepliedInfo">
                  </userInfo-card>
                </template>
              </el-popover>
            </div>
          </div>
        </div>
        <div class="comment_text">{{ liData.content }}</div>
        <div class="commmet_meta">
          <div class="comment_meta_left" v-dateFormat>
            {{ liData.createTime }}
          </div>
          <div class="comment_meta_right">
            <i
              :class="[
                'iconfont',
                'icon-dianzan',
                liData.like.includes(userInfo._id) ? 'is-like' : '',
              ]"
              @click.stop="handleIconClick('like', liData)"
              >&nbsp;{{ liData.likeCount === 0 ? "" : liData.likeCount }}
            </i>
            <i
              :class="[
                'iconfont',
                'icon-pinglun',
                currentComment === liData._id ? 'is-click' : '',
              ]"
              @click.stop="handleIconClick('comment', liData)"
              >&nbsp;{{ isSubComment ? "" : liData.commentCount }}</i
            >
            <i class="iconfont icon-jubao"></i>
          </div>
        </div>
        <div
          v-show="currentComment === liData._id"
          :class="[
            'comment_input_inner',
            isFocusId === currentComment ? 'is-focus' : '',
            isSubComment ? 'sub_comment_input_inner' : '',
          ]"
          @click.stop="handleFocus($event, liData._id)"
        >
          <el-input
            v-model="textarea"
            autosize
            type="textarea"
            :placeholder="
              userInfo._id === ''
                ? '请先登录'
                : `回复 ${liData.userInfo?.userName}`
            "
          />
          <div v-show="isFocusId === liData._id" class="comment_input_actions">
            <div
              class="action"
              @click="
                handleComment(isSubComment, liData._id, liData.userInfo._id)
              "
            >
              评论
            </div>
          </div>
        </div>
        <comment-list-wrapper
          :ulStyle="{'background-color': '#f6f6f8'}"
          :commentId="liData._id"
          :commentList="liData.subCommentList"
          :subCommentTotal="liData.subCommentTotal"
          :isSubComment="true"
          :queryInfo="queryInfo"
        ></comment-list-wrapper>
      </div>
    </li>
  </div>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
import {userStore} from "@/store/user";
import {articleOrThemeStore} from "@/store/articleOrTheme";
import {useRouter, useRoute} from "vue-router";

const route = useRoute();
const router = useRouter();
const store = articleOrThemeStore();
const props = defineProps({
  liData: {
    type: Object,
    required: true,
  },
  userInfo: {
    type: Object,
    required: true,
  },
  isSubComment: {
    type: Boolean,
    default: false,
  },
  commentId: {
    type: String,
    default: "",
  },
  queryInfo: {
    type: Object,
    required: true,
  },
  subCommentTotal: {
    type: Number,
    default: 0,
  },
  reqUrl: {
    type: String,
    default: "comments",
  },
});
// 选中的点赞按钮 当前选中的评论 评论框是否聚焦 评论框内容
const {isFocus, currentComment, isFocusId, textarea} = storeToRefs(store);
const {userInfo} = storeToRefs(userStore());

// 评论操作列表
// 处理icon按钮点击事件
const handleIconClick = (iconType: string, item: any) => {
  const res = isLogin();
  if (!res) return;
  const commentId = item._id;
  if (iconType === "like") {
    // 判断item.like是否有当前用户的id
    const userId = userInfo.value._id;
    const hasValue = item.like.indexOf(userId);
    if (hasValue !== -1) {
      store.cancelLike(props.reqUrl, item._id, userId);
    } else {
      store.saveLike(props.reqUrl, item._id, userId);
    }
  } else if (iconType === "comment") {
    isFocus.value = false;
    // 当前选中评论与传进来的值相等，说明是第二次点击了
    if (currentComment.value === commentId) {
      currentComment.value = "";
      isFocusId.value = "";
    } else {
      currentComment.value = commentId;
    }
  }
};

// 处理评论聚焦
const handleFocus = (event: any, commentId: string) => {
  const textareaInner = event.target.firstElementChild?.firstElementChild;
  const res = isLogin();
  if (!res) return;
  if (isFocusId.value !== commentId) isFocusId.value = commentId;
  if (typeof textareaInner !== "undefined") {
    textareaInner.focus();
  }
};

// 未登录的回调
const isLogin = () => {
  if (userInfo.value._id == "") {
    router.push({path: "/login", query: {redirect: route.fullPath}});
    return false;
  } else {
    return true;
  }
};

// 提交评论
const handleComment = async (
  isSubComment: boolean,
  parentId: string,
  beRepliedId: string
) => {
  const articleOrThemeId = route.params._id;
  if (isSubComment) {
    parentId = props.commentId;
  }
  await store.postComment({
    articleOrThemeId: articleOrThemeId as string,
    parentId,
    beRepliedId,
    userId: userInfo.value._id,
    content: textarea.value,
  });
  isFocusId.value = "";
  currentComment.value = "";
  textarea.value = "";
  await store.getComment(articleOrThemeId as string, {
    offset: 0,
    size: 10,
    sort: props.queryInfo.sort,
  });
};
</script>

<style scoped lang="less">
.comment-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 32px 10px;
  cursor: default;
  img {
    margin-right: 16px;
    width: @imageSize;
    height: @imageSize;
    border-radius: 50%;
    cursor: pointer;
  }
  .comment_info {
    width: 100%;
    .comment_header {
      display: flex;
      align-items: center;
      .userName {
        display: inline-block;
        margin-bottom: 5px;
        font-weight: bolder;
        cursor: pointer;
      }
    }

    .commmet_meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: @fontColor;
      .comment_meta_right {
        display: flex;
        justify-content: space-around;
        align-items: center;
        i {
          margin: 5px 15px;
          cursor: pointer;
          color: @fontColor;
          font-size: 21px;
          &:hover {
            color: #8a919f;
            font-weight: bolder;
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
    .comment_input_inner {
      width: 100%;
      overflow: hidden;
      background-color: #f6f6f8;
      border-radius: 15px;
      box-sizing: border-box;
      border: 1px solid #8a919f;
      &.is-focus {
        border: 1px solid #8a919f !important;
      }
      :deep(.el-textarea) {
        position: relative;
        right: -15px;
        textarea {
          --el-input-focus-border: #dcdfe6 !important;
          --el-input-focus-border-color: #dcdfe6 !important;
          padding: 10px 35px 10px 0px;
          min-height: 40px !important;
          box-sizing: border-box;
          box-shadow: none;
          background-color: #f6f6f8;
          &::-webkit-scrollbar {
            width: 0;
          }
        }
      }
      .comment_input_actions {
        display: inline;
        float: right;
        .action {
          padding: 10px 25px;
          margin: 0 10px 10px 0;
          cursor: pointer;
          border: none;
          border-radius: 20px;
          color: #fff;
          background-color: rgb(250, 74, 74);
        }
      }
    }
    .sub_comment_input_inner {
      border: 1px solid #fff;
      background-color: #fff;
      :deep(.el-textarea) {
        textarea {
          background-color: #fff !important;
        }
      }
    }
  }
}
</style>
