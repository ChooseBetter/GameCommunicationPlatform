import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router";
import Utils from "@/utils";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("@/views/Home/Home.vue"),
    meta: {
      title: "首页",
      isShowHeader: true,
    },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login.vue"),
    meta: {
      title: "登录",
      isShowHeader: false,
    },
  },
  {
    path: "/publish",
    name: "publish",
    component: () => import("@/views/Publish.vue"),
    meta: {
      title: "发布",
      isShowHeader: false,
    },
  },
  {
    path: "/article/:_id",
    name: "article",
    component: () => import("@/views/Article.vue"),
    meta: {
      title: "文章",
      isShowHeader: true,
    },
  },
  {
    path: "/find",
    component: () => import("@/views/Find/Find.vue"),
    redirect: "code",
    meta: {
      title: "忘记密码",
      isShowHeader: false,
    },
    children: [
      {path: "code", component: () => import("@/views/Find/Code.vue")},
      {
        path: "reset",
        component: () => import("@/views/Find/Reset.vue"),
      },
      {path: "success", component: () => import("@/views/Find/Success.vue")},
    ],
  },
  {
    path: "/search",
    name: "search",
    component: () => import("@/views/Search.vue"),
    meta: {
      title: "搜索",
      isShowHeader: true,
      isShowNav: true,
    },
  },
  {
    path: "/user",
    component: () => import("@/views/User/index.vue"),
    meta: {
      title: "我的主页",
      isShowHeader: true,
    },
    redirect: ":_id",
    children: [
      {
        path: ":_id",
        name: "user",
        component: () => import("@/views/User/User.vue"),
      },
      {
        path: "settings",
        name: "settring",
        component: () => import("@/views/User/Setting.vue"),
        redirect: "/user/settings/profile",
        children: [
          {
            path: "profile",
            name: "profile",
            component: () => import("@/views/User/Setting/Profile.vue"),
          },
          {
            path: "account",
            name: "account",
            component: () => import("@/views/User/Setting/Account/Account.vue"),
          },
        ],
      },
    ],
  },
  {
    path: "/square/:_id",
    name: "square",
    component: () => import("@/views/Square/Square.vue"),
    meta: {
      title: "交流圈",
      isShowHeader: true,
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.name === "publish" || to.matched[0]?.path === "/user") {
    const token = Utils.LocalCache().getCache("token");
    const userInfo = Utils.LocalCache().getCache("userInfo");
    if (token && userInfo) {
      next();
    } else {
      next("/login");
    }
  } else {
    next();
  }
});

export default router;
