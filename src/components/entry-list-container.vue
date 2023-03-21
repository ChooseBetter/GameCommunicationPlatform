<template>
  <div class="entry-list-container" :style="{width: `${width}px`}">
    <slot name="entrylistcontainer">
      <ul class="tabs" :style="tabStyle" v-if="hasTab">
        <template v-for="(item, index) in props.tabs" :key="item.value">
          <li
            :class="{'is-active': item.value === queryInfo.sort}"
            @click="handleSort(item.value)"
          >
            {{ item.title }}
          </li>
          <span v-if="index < props.tabs.length - 1"> | </span>
        </template>
      </ul>
      <ul class="entry-list-content" :style="contentStyle">
        <el-skeleton
          v-if="listData.length === 0 && loading"
          :rows="5"
          animated
          style="
            padding: 18px 24px;
            box-sizing: border-box;
            background-color: #fff;
          "
        />
        <template v-else>
          <slot name="item" :listData="listData">
            <li
              class="item"
              v-for="item in listData"
              :key="item._id"
              @click="gotoArticle(item._id)"
            >
              <div class="content-wrapper">
                <div class="info-wrapper">
                  <div class="info-main">
                    <div class="header">
                      <span class="title">{{ item.title }}</span>
                      <el-tag class="" type="success">
                        {{ formatCategory(item.category) }}
                      </el-tag>
                    </div>
                    <div class="abstract">
                      {{ item.abstract }}
                    </div>
                    <div class="meta-list">
                      <img v-imageLazy="item.authorInfo?.avatar" alt="" />
                      <span>{{ item.authorInfo?.userName }}</span>
                      <span v-dateFormat="'MM-DD'">{{ item.createTime }}</span>
                      <el-button class="viewBtn" link>
                        <i class="iconfont icon-chakan"></i>
                        &nbsp;{{ item.view || "查看" }}
                      </el-button>
                      <el-button
                        class="active"
                        link
                        @click.stop="handleLike(item)"
                      >
                        <i class="iconfont icon-dianzan"></i>
                        &nbsp;{{ item.likeCount || "点赞" }}
                      </el-button>
                      <el-button link>
                        <i class="iconfont icon-pinglun"></i>
                        &nbsp;{{ item.commentCount || "评论" }}
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="cover-wrapper">
                <img v-imageLazy="item.cover" alt="" />
              </div>
            </li>
          </slot>
        </template>
      </ul>
    </slot>
    <InfiniteLoading
      :style="LoadingStyle"
      :loading="loading"
      @infinite="getData"
    />
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, onBeforeMount, watch} from "vue";
import {useRouter} from "vue-router";
import {storeToRefs} from "pinia";
import {commonStore} from "@/store/common";
import {userStore} from "@/store/user";
import {articleOrThemeStore} from "@/store/articleOrTheme";
import {navListType} from "@/store/type";
import Utils from "@/utils";

interface Props {
  width?: number;
  tabs?: tabsType[];
  reqUrl?: string;
  liClickCancel?: boolean;
  hasTab?: boolean;
  curNav?: navListType;
  extraData?: any;
  tabStyle?: any;
  contentStyle?: any;
  LoadingStyle?: any;
}
interface tabsType {
  title: string;
  value: number;
}
const props = withDefaults(defineProps<Props>(), {
  width: 700,
  // tab
  tabs: () => [
    {title: "推荐", value: 1},
    {title: "最新", value: 2},
    {title: "热榜", value: 3},
  ],
  hasTab: true,
  reqUrl: "/articles/lists",
  liClickCancel: false,
  extraData: {},
  tabStyle: {"background-color": "#fff"},
  contentStyle: {"background-color": "#fff"},
  LoadingStyle: {"background-color": "#fff"},
});
const emits = defineEmits(["handleSort"]);

const store = commonStore();
const router = useRouter();
// 获取文章列表
const {entryList, content} = storeToRefs(store);
const {userInfo} = storeToRefs(userStore());
const {saveLike, cancelLike} = articleOrThemeStore();

// 当前是否在加载
const loading = ref(true);
// 展示的列表数据
const listData = ref<any[]>([]);
// 查询参数
const queryInfo = reactive({
  offset: 0,
  size: 5,
  sort: 1,
});

onBeforeMount(() => {
  store.updateStateData("entryList", []);
  getData();
});

// 获取数据
const getData = async () => {
  loading.value = true;
  let reqData = {
    ...props.curNav,
    content: content.value,
    ...props.extraData,
  };
  let reqUrl = props.reqUrl + Utils.handlQueryeUrl(queryInfo);
  const {data} = await store.getEntryListAction(reqUrl, reqData);
  if (data && data.list.length !== 0) {
    queryInfo.offset += 5;
    listData.value = entryList.value;
  }
  loading.value = false;
};

// 点击li跳转到指定文章
const gotoArticle = (_id: string) => {
  if (props.liClickCancel) return;
  router.push({path: `/article/${_id}`});
};

// 对分类标签进行处理
const formatCategory = (category: string) => {
  for (let item of store.categoryList) {
    if (item.value === category) {
      return item.label;
    }
  }
};

// 列表排序改变操作
const handleSort = (value: number) => {
  emits("handleSort");
  queryInfo.sort = value;
  resetQueryInfo();
};

// 点赞
const handleLike = async (item: any) => {
  if (userInfo.value._id === "") {
    router.push("/login");
    return;
  }
  const hasValue = item.like.indexOf(userInfo.value._id);
  const url = props.reqUrl.split("/")[1];
  let res: any = {};
  if (hasValue !== -1) {
    res = await cancelLike(url, item._id, userInfo.value._id);
  } else {
    res = await saveLike(url, item._id, userInfo.value._id);
  }
  if (!res?.data) return;
  store.updateEntryListAction(res.data);
};

// 重置queryInfo等操作
const resetQueryInfo = () => {
  listData.value = new Array();
  store.updateStateData("entryList", []);
  queryInfo.offset = 0;
  queryInfo.size = 5;
  getData();
};

//监视curNav
watch([() => props.curNav, content], () => {
  resetQueryInfo();
});

defineExpose({
  resetQueryInfo,
});
</script>

<style scoped lang="less">
.entry-list-container {
  margin-bottom: 20px;
  font-size: 16px;
  border-radius: 5px;
  .tabs {
    padding: 1rem 0.75rem;
    height: 1.25rem;
    display: flex;
    flex-direction: row;
    justify-content: left;
    border-bottom: 0.0625rem solid @borderColor;
    li {
      width: 3.125rem;
      text-align: center;
      color: @fontColor;
    }
    .is-active {
      color: #409eff;
    }
    span {
      color: @borderColor;
    }
  }
  .entry-list-content {
    &::-webkit-scrollbar {
      width: 0 !important;
    }
    .item {
      width: 43.75rem;
      margin: 0 auto;
      padding-top: 1.125rem;
      display: flex;
      justify-content: space-between;
      box-sizing: border-box;
      border-bottom: 1px solid @borderColor;
      background-color: #fff;
      &:hover {
        background-color: #f4f4f5;
      }
      .content-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .info-wrapper {
          width: 30rem;
          height: 6rem;
          padding-bottom: 0.75rem;
          box-sizing: border-box;
          .info-main {
            margin-left: 30px;
            .header {
              display: flex;
              align-items: center;
              margin-bottom: 0.5rem;
              .title {
                font-size: 1rem;
                font-weight: bolder;
                line-height: 1.5rem;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
              }
            }
            .abstract {
              margin-bottom: 0.625rem;
              width: 100%;
              height: 1.375rem;
              line-height: 1.375rem;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              font-size: 0.75rem;
              color: @fontColor;
            }
            .meta-list {
              display: flex;
              align-items: center;
              color: @fontColor;
              > * {
                margin-right: 0.625rem;
              }
              img {
                width: 1.5rem;
                height: 1.5rem;
                border-radius: 50%;
              }
              button {
                color: @fontColor;
                &:hover {
                  color: #409eff;
                }
                i {
                  font-size: 16px;
                }
              }
              .active {
                i {
                  font-size: 14px;
                }
                color: red;
                &:hover {
                  color: red;
                }
              }
            }
          }
        }
      }
      .cover-wrapper {
        margin-right: 30px;
        img {
          width: 9.375rem;
          height: 5.3125rem;
          background-size: cover;
          background-repeat: no-repeat center;
        }
      }
    }
  }
}
</style>
