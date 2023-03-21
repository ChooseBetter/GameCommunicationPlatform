import {ref} from "vue";
import {articleOrThemeStore} from "@/store/articleOrTheme";
import {useRoute, useRouter} from "vue-router";
import {userStore} from "@/store/user";
import {storeToRefs} from "pinia";

export function useTheme() {
  const route = useRoute();
  const router = useRouter();
  const store = articleOrThemeStore();
  const commentContainerRef = ref();
  const selectedComment = ref("");
  const {userInfo} = storeToRefs(userStore());

  // 处理icon的点击
  const handleIconClick = (iconType: string, item: any, index?: number) => {
    const res = isLogin();
    if (!res) return;
    if (iconType === "like") {
      // 判断item.like是否有当前用户的id
      const userId = userInfo.value._id;
      const hasValue = item.like.indexOf(userId);
      if (hasValue !== -1) {
        store.cancelLike("themes", item._id, userId);
      } else {
        store.saveLike("themes", item._id, userId);
      }
    } else if (iconType === "comment") {
      store.updateStateData("commentList", []);
      store.updateStateData("commentTotal", 0);
      commentContainerRef.value[index as number].queryInfo.offset = 0;
      if (selectedComment.value !== item._id) {
        selectedComment.value = item._id;
        commentContainerRef.value[index as number].getCommentList();
      } else {
        selectedComment.value = "";
      }
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
  return [
    route,
    router,
    store,
    commentContainerRef as any,
    selectedComment,
    userInfo,
    handleIconClick,
    isLogin,
  ];
}
