import {defineStore} from "pinia";
import {
  articleOrThemeStateType,
  publishFormType,
  postCommentType,
  queryInfoType,
} from "./type";
import {
  reqArticle,
  reqSquare,
  reqComment,
  createComment,
  saveLike,
} from "@/service/articleOrTheme";
import {reqIncreaseExperience, PublishRequest} from "@/service/user";
import {ElMessage} from "element-plus";
import {userStore} from "@/store/user";
import {commonStore} from "@/store/common";
const {updateUserInfo} = userStore();
const {updateEntryListAction} = commonStore();

const config = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

export const articleOrThemeStore = defineStore("articleOrTheme", {
  persist: {
    key: "article",
    storage: window.sessionStorage,
    paths: ["catrgoryList", "tagList", "articleInfo"],
  },
  state: (): articleOrThemeStateType => {
    return {
      articleInfo: {},
      squareInfo: {},
      commentList: [], // 评论列表
      commentTotal: 0, // 评论数
      currentLike: [], // 当前选中的点赞
      isFocus: false, // 控制外部评论框聚焦
      currentComment: "", // 内部当前选中评论框
      isFocusId: "", // 控制内部评论框聚焦
      textarea: "",
    };
  },
  actions: {
    // 发布操作
    async publishAction(url: string, payload: publishFormType) {
      const res1 = await PublishRequest(`/${url}/publish`, payload, config);
      if (res1.code === 200) {
        ElMessage({
          type: "success",
          message: res1.msg,
        });
        const res2 = await reqIncreaseExperience("/users/increaseExp", {
          _id: payload.authorId,
          expNumber: url === "/articles" ? 20 : 10,
        });
        updateUserInfo(res2.data);
      } else {
        ElMessage({
          type: "warning",
          message: res1.msg,
        });
      }
    },
    // 获取指定文章信息
    async getArticle(_id: string) {
      const res = await reqArticle(`/articles/${_id}`);
      if (res.data) {
        this.articleInfo = res.data;
        return res.data;
      } else {
        return Promise.reject(res.msg);
      }
    },
    // 获取指定广场信息
    async getSquare(_id: string) {
      const res = await reqSquare(`/squares/${_id}`);
      if (res.data) {
        this.squareInfo = res.data;
        return res.data;
      } else {
        return Promise.reject(res.msg);
      }
    },
    // 获取基础评论
    async getComment(articleOrThemeId: string, queryInfo: queryInfoType) {
      const res = await reqComment(
        `/comments/list/${articleOrThemeId}`,
        queryInfo
      );
      if (res.code === 200) {
        // 当offset为0时，说明是最初请求数据或者提交评论
        if (queryInfo.offset === 0) {
          this.commentList = res.data.list;
        } else {
          this.commentList.push(...res.data.list);
        }
        this.commentTotal = res.data.total;
        return res.data;
      } else {
        return Promise.reject(res.msg);
      }
    },
    // 获取更多评论
    async getMoreComment(commentId: string) {
      const res = await reqComment(`/comments/subComment/list/${commentId}`);
      if (res.code === 200) {
        this.commentList.map((item) => {
          if (item._id === res.data.list[0].parentId) {
            item.subCommentList.push(...res.data.list);
            console.log(item.subCommentList);
          }
        });
      }
    },
    // 评论提交操作
    async postComment(payload: postCommentType) {
      const res = await createComment("/comments/create", payload);
      const res2 = await reqIncreaseExperience("/users/increaseExp", {
        _id: payload.userId,
        expNumber: 5,
      });
      updateUserInfo(res2.data);
      return res;
    },
    async saveLike(url: string, commentId: string, userId: string) {
      const res1 = await this.likeAction(
        `/${url}/save/${commentId}`,
        url,
        userId
      );
      const res2 = await reqIncreaseExperience("/users/increaseExp", {
        _id: userId,
        expNumber: 3,
      });
      updateUserInfo(res2.data);
      return res1;
    },
    async cancelLike(url: string, commentId: string, userId: string) {
      return this.likeAction(`/${url}/cancel/${commentId}`, url, userId);
    },
    async likeAction(url: string, type: string, userId: string) {
      if (type === "articles") {
        const res = await saveLike(url, {userId: userId});
        const {like, likeCount} = res.data;
        this.articleInfo.like = like;
        this.articleInfo.likeCount = likeCount;
        return res;
      } else if (type === "comments") {
        const res = await saveLike(url, {userId: userId});
        const {_id, like, likeCount} = res.data;
        this.commentListMap(this.commentList, _id, like, likeCount);
        return res;
      } else if (type === "themes") {
        const res = await saveLike(url, {userId: userId});
        updateEntryListAction(res.data);
      }
    },
    commentListMap(
      target: any[],
      _id: string,
      like: string[],
      likeCount: number
    ) {
      target.map((item) => {
        if (item._id === _id) {
          item.like = like;
          item.likeCount = likeCount;
        } else if (item.subCommentList && item.subCommentList.length !== 0) {
          this.commentListMap(item.subCommentList, _id, like, likeCount);
        }
      });
    },
    // 修改state中的数据
    updateStateData(key: string, value: any) {
      (this as any)[key] = value;
    },
  },
});
