<template>
  <div class="comment-wrapper" v-if="props.commentList.length !== 0">
    <ul :style="ulStyle">
      <template v-for="item in props.commentList" :key="item._id">
        <comment-item
          :liData="item"
          :userInfo="userInfo"
          v-bind="$attrs"
        ></comment-item>
      </template>

      <span
        v-if="
          isSubComment &&
          props.subCommentTotal >= 3 &&
          props.commentList.length !== props.subCommentTotal
        "
        class="more"
        @click="handleMoreComment(commentId)"
      >
        查看更多评论
      </span>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
import {userStore} from "@/store/user";
import {articleOrThemeStore} from "@/store/articleOrTheme";

const props = defineProps({
  ulStyle: {
    type: Object,
    default: () => ({}),
  },
  commentId: {
    type: String,
    default: "",
  },
  commentList: {
    type: Array as any,
    default: [],
    required: true,
  },
  isSubComment: {
    type: Boolean,
    default: false,
  },
  subCommentTotal: {
    type: Number,
    default: 0,
  },
});

const store = articleOrThemeStore();
// 选中的点赞按钮 当前选中的评论 评论框是否聚焦 评论框内容
const {currentComment, isFocusId} = storeToRefs(store);
const {userInfo} = storeToRefs(userStore());

// 处理更多评论
const handleMoreComment = (commentId: string) => {
  store.getMoreComment(commentId);
};

defineExpose({
  currentComment,
  isFocusId,
});
</script>

<style scoped lang="less">
.comment-wrapper {
  width: 100%;
  margin-top: 10px;

  .more {
    display: inline-block;
    margin-left: 20px;
    padding-bottom: 5px;
    color: #007fff;
    cursor: pointer;
  }
}
</style>
