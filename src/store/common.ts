import {defineStore} from "pinia";
import {commonStateType, commonListType} from "./type";
import {
  reqCategoryList,
  reqTagList,
  reqSquareList,
  reqArticleList,
} from "@/service/home";

export const commonStore = defineStore("common", {
  persist: {
    key: "common",
    storage: window.sessionStorage,
    paths: ["categoryList", "tagList", "squareList", "articleInfo"],
  },
  state: (): commonStateType => {
    return {
      categoryList: [],
      tagList: [],
      entryList: [],
      squareList: [],
      // 搜索框内容
      content: "",
    };
  },
  getters: {
    // 处理首页导航栏的列表
    formatList: () => {
      return (list: commonListType[], type: string) => {
        return list.map((item) => {
          return {...item, type: type};
        });
      };
    },
  },
  actions: {
    // 修改state中的数据
    updateStateData(key: string, value: any) {
      (this as any)[key] = value;
    },
    // 获取分类列表
    async getCategoryListAction() {
      const res = await reqCategoryList("/categorys/format");
      this.categoryList = res.data.list;
    },
    // 获取标签列表
    async getTagListAction() {
      const res = await reqTagList("/tags/format");
      this.tagList = res.data.list;
    },
    // 获取广场列表
    async getSquareListAction() {
      const res = await reqSquareList("/squares/format");
      this.squareList = res.data.list;
    },
    // 获取条目列表
    async getEntryListAction(reqUrl: string, data: any) {
      const res = await reqArticleList(reqUrl, data);
      if (res) {
        this.entryList.push(...res.data.list);
      }
      return res;
    },
    // 修改条目列表
    updateEntryListAction(data: any) {
      const {_id, ...params} = data;
      let keys = Object.keys(params);
      let values = Object.values(params);

      this.entryList.forEach((item) => {
        if (item._id === _id) {
          for (let i = 0; i < keys.length; i++) {
            item[keys[i]] = values[i];
          }
        }
      });
    },
  },
});
