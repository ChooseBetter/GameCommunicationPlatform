<template>
  <div id="comment-container">
    <div class="comment_header">
      <div class="comment_header_left">评论&nbsp;{{ commentLength }}</div>
      <div class="comment_header_right">
        <div
          v-for="item in sortlist"
          :key="item.value"
          :class="['item', queryInfo.sort === item.value ? 'active' : '']"
          @click="handleSort(item.value)"
        >
          <i :class="['iconfont', item.icon]"></i> {{ item.label }}
        </div>
      </div>
    </div>
    <div class="comment_body">
      <div class="comment_card__input">
        <img v-imageLazy="userInfo.avatar" alt="" />
        <div
          ref="commentInputInner"
          :class="['comment_input_inner', isFocus ? 'is-focus' : '']"
          @click.stop="handleFocus($event)"
        >
          <el-input
            v-model="commentTextArea"
            autosize
            type="textarea"
            :placeholder="userInfo._id === '' ? '请先登录' : '发布评论'"
            @click.stop="handleFocus"
          >
          </el-input>
          <div v-show="isFocus" class="comment_input_actions">
            <div class="action" @click="handleComment">评论</div>
          </div>
        </div>
      </div>
      <comment-list-wrapper
        ref="commentlistwrapper"
        :commentList="commentList"
        :queryInfo="queryInfo"
      ></comment-list-wrapper>
      <InfiniteLoading
        :loading="loading"
        @infinite="getCommentList"
      ></InfiniteLoading>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive} from "vue";
import {useRoute, useRouter} from "vue-router";
import {storeToRefs} from "pinia";
import {articleOrThemeStore} from "@/store/articleOrTheme";

const props = defineProps({
  userInfo: {
    type: Object,
    required: true,
  },
  articleOrThemeId: {
    type: String,
    required: true,
  },
  commentLength: {
    type: Number,
    default: 0,
  },
  reqUrl: {
    type: String,
    default: "comments",
  },
});
const route = useRoute();
const router = useRouter();
const store = articleOrThemeStore();

// 排序列表
const sortlist = reactive([
  {label: "最新", value: 1, icon: "icon-shizhong"},
  {label: "最热", value: 2, icon: "icon-remen"},
]);

// 当前是否在加载
const loading = ref(true);

// 评论的页数个个数和排序类型
const queryInfo = reactive({
  offset: 0,
  size: 5,
  sort: 1,
});
// 用户评论内容
const commentTextArea = ref("");
const commentlistwrapper = ref();
// 获取文章信息
const {commentList, isFocus, textarea} = storeToRefs(store);

// 获取评论数据
const getCommentList = async () => {
  loading.value = true;
  const data = await store.getComment(props.articleOrThemeId, queryInfo);
  if (data && data.list.length !== 0) {
    queryInfo.offset += 5;
  }
  loading.value = false;
};

// 评论框获取焦点时触发的事件
const handleFocus = (event?: any) => {
  const textareaInner = event.target.firstElementChild?.firstElementChild;
  if (props.userInfo._id == "") {
    router.push({path: "/login", query: {redirect: route.fullPath}});
  } else {
    if (typeof textareaInner !== "undefined") textareaInner.focus();
    isFocus.value = true;
    // 内部评论框
    commentlistwrapper.value.currentComment = "";
    commentlistwrapper.value.isFocusId = "";
  }
};

// 评论排序改变操作
const handleSort = (value: number) => {
  queryInfo.offset = 0;
  queryInfo.size = 5;
  queryInfo.sort = value;
  getCommentList();
};

// 评论提交操作
const handleComment = async () => {
  await store.postComment({
    articleOrThemeId: props.articleOrThemeId as string,
    userId: props.userInfo._id,
    content: commentTextArea.value,
  });
  handleblur();
  queryInfo.offset = 0;
  getCommentList();
  console.log(props.articleOrThemeId);
};

// 点击其他区域，将评论框收起
const handleblur = () => {
  // 外部评论框
  commentTextArea.value = "";
  isFocus.value = false;
  // 内部评论框
  commentlistwrapper.value.currentComment = "";
  commentlistwrapper.value.isFocusId = "";
  textarea.value = "";
};

defineExpose({
  getCommentList,
  queryInfo,
  handleblur,
});
</script>

<style scoped lang="less">
#comment-container {
  margin: 1.25rem auto 0 auto;
  padding: 1.5rem 0;

  border-radius: @containerRadius;
  background: #fff;
  .comment_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 2.5rem;
    padding: 0 2rem;
    .comment_header_left {
      font-weight: bolder;
    }
    .comment_header_right {
      width: 8.75rem;
      height: 2rem;
      display: flex;
      justify-content: space-around;
      align-items: center;
      background: #f2f3f5;
      color: #8a919f;
      .item {
        cursor: pointer;
        padding: 0.125rem 0.4375rem;
      }
      .active {
        color: @blue;
        background: #fff;
      }
    }
  }
  .comment_body {
    .comment_card__input {
      display: flex;
      justify-content: space-between;
      padding: 0 2rem 1rem 2rem;
      border-bottom: 1px solid #dcdfe6;
      img {
        margin-right: 1rem;
        width: @imageSize;
        height: @imageSize;
        border-radius: 50%;
      }
      .comment_input_inner {
        width: 100%;
        overflow: hidden;
        background-color: #f6f6f8;
        border-radius: 0.9375rem;
        &.is-focus {
          border: 0.0625rem solid #8a919f;
        }
        :deep(.el-textarea) {
          position: relative;
          right: -0.9375rem;
          textarea {
            --el-input-focus-border: #dcdfe6 !important;
            --el-input-focus-border-color: #dcdfe6 !important;
            padding: 0.625rem 2.1875rem 0.625rem 0px;
            min-height: 2.5rem !important;
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
            padding: 0.625rem 1.5625rem;
            margin: 0 0.625rem 0.625rem 0;
            cursor: pointer;
            border: none;
            border-radius: 1.25rem;
            color: #fff;
            background-color: rgb(250, 74, 74);
          }
        }
      }
    }
  }
}
</style>
