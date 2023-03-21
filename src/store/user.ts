import {defineStore} from "pinia";
import {userStateType, LoginDataType} from "./type";
import {LoginAndRegisterRequest} from "@/service/login";
import {reqUserEntireInfo, reqUpdateUserInfo} from "@/service/user";
import Utils from "@/utils";

const config = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

export const userStore = defineStore("user", {
  persist: {
    key: "user",
    storage: window.sessionStorage,
    paths: ["token", "userInfo"],
  },
  state: (): userStateType => {
    return {
      token: "",
      userInfo: {
        _id: "",
        userName: "",
        experience: 0,
        avatar: "",
        email: "",
        attentionsList: [],
        fansCount: [],
        favoritesCount: [],
        articlesCount: [],
      },
    };
  },
  getters: {},
  actions: {
    // 登录操作
    async LoginAndRegisterAction(url: string, data: LoginDataType) {
      const res = await LoginAndRegisterRequest(url, data);
      if (res.data) {
        const {token, ...userInfo} = res.data;
        Utils.LocalCache().setCache("token", token);
        Utils.LocalCache().setCache("userInfo", userInfo);
        this.token = token;
        this.userInfo = userInfo;
        return res;
      } else {
        return res;
      }
    },
    // 获取用户信息操作
    async getUserEntireInfoAction(url: string) {
      return await reqUserEntireInfo(url);
    },
    // 修改userInfo参数
    updateUserInfo(data: any) {
      let obj = JSON.parse(JSON.stringify(this.userInfo));
      const {_id, ...params} = data;
      let keys = Object.keys(params);
      let values = Object.values(params);
      for (let i = 0; i < keys.length; i++) {
        obj[keys[i]] = values[i];
      }
      this.userInfo = obj;
    },
    // 退出
    Logout() {
      Utils.LocalCache().deleteCache("token");
      Utils.LocalCache().deleteCache("userInfo");
      this.token = "";
      this.userInfo = {
        _id: "",
        userName: "",
        avatar: "",
        experience: 0,
        email: "",
        attentionsList: [],
        fansCount: [],
        favoritesCount: [],
        articlesCount: [],
      };
    },
    // 修改用户信息
    async UpdateUserInfoAction(userId: string, data: any) {
      let url = `/users/edit/${userId}`;
      const res = await reqUpdateUserInfo(url, data, config);
      this.updateUserInfo(res.data);
      return res;
    },
  },
});
