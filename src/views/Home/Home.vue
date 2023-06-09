<template>
  <div id="home">
    <div class="content">
      <div class="side-navigator">
        <navigation
          :ul-style="{'max-height': '400px'}"
          :nav-list="navList"
          side
          @handleItemClick="handleItemClick"
        >
          <template #default="{item}">
            <img v-if="item.image" :src="item.image" alt="" />
            <el-icon v-else><Connection /></el-icon>
            <div>{{ item.label }}</div>
          </template>
        </navigation>
      </div>
      <div class="center">
        <swiper-slide :swiperList="swiperList" style="margin-bottom: 20px">
        </swiper-slide>
        <entry-list-container :curNav="curNav" @handleSort="handleSort">
        </entry-list-container>
      </div>
      <aside-sidebar
        :sidebarConfig="sidebarConfig"
        :listData="listData"
        @handleSidebarItemClick="handleSidebarItemClick"
      >
        <template #advertisement="{blockData}">
          <img :src="blockData" alt="" />
        </template>
        <template #link="{blockData}">
          <div class="link-countainer">
            <a v-for="item in blockData" :key="item" :href="item.url">
              {{ item.label }}
            </a>
          </div>
        </template>
      </aside-sidebar>
    </div>
    <el-backtop :visibility-height="100" :bottom="50" />
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, onBeforeMount, watch} from "vue";
import {commonStore} from "@/store/common";
import {storeToRefs} from "pinia";
import {navListType} from "@/store/type";
import {sidebarConfig} from "./sidebarConfig";
import router from "@/router";

const emits = defineEmits(["getSearchContent"]);
const store = commonStore();
const {formatList, updateStateData} = store;
const {categoryList, squareList} = storeToRefs(store);

// 导航栏数据
const navList = ref([{label: "综合", value: "0", type: "0"}]);
// 默认导航选中
const curNav = ref({label: "综合", value: "0", type: "0"});
// 侧边栏展示的数据
const listData = ref<any>([]);
const linkList = [
  {label: "英雄联盟", url: "https://lol.qq.com/main.shtml"},
  {label: "王者荣耀", url: "https://pvp.qq.com/"},
  {label: "原神", url: "https://ys.mihoyo.com/"},
  {label: "绝地求生", url: "https://pubg.qq.com/"},
  {label: "崩坏三", url: "https://www.bh3.com/"},
  {label: "我的世界", url: "https://mc.163.com/index.html"},
];

onBeforeMount(() => {
  updateStateData("entryList", []);
  store.getCategoryListAction();
  store.getTagListAction();
  store.getSquareListAction();
});

watch(categoryList, (newVlue: any) => {
  navList.value.push(...formatList(newVlue, "category"));
});
watch(squareList, (newVlue: any) => {
  listData.value.push(newVlue);
  listData.value.push("/src/assets/images/pubg.png");
  listData.value.push("/src/assets/images/minecraft.png");
  listData.value.push(linkList);
});
// 轮播图数据
const swiperList = reactive([
  {
    label: "原神",
    info: "3.4正式开启",
    imgUrl: "/src/assets/images/yuanshen.png",
  },
  {
    label: "崩坏三",
    info: "3.4正式开启",
    imgUrl: "/src/assets/images/benghuaisan.png",
  },
  {
    label: "英雄联盟",
    info: "3.4正式开启",
    imgUrl: "/src/assets/images/yingxionglianmeng.png",
  },
  {
    label: "王者荣耀",
    info: "3.4正式开启",
    imgUrl: "/src/assets/images/wangzherongyao.png",
  },
]);

// 处理导航点击
const handleItemClick = (curNavObj: navListType) => {
  curNav.value = curNavObj;
  emits("getSearchContent");
};

// 处理排序改动
const handleSort = () => {
  emits("getSearchContent");
};

const handleSidebarItemClick = (item: any) => {
  router.push(`/square/${item.value}`);
};
</script>
<style scoped lang="less">
#home {
  .content {
    margin: 1.25rem auto;
    width: 70rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .side-navigator {
      padding: 5px;
      height: 100%;
      background-color: #fff;
      img {
        margin-right: 0.625rem;
        width: 1.875rem;
        height: 1.875rem;
        border-radius: 5px;
      }
      i {
        margin-right: 0.625rem;
        font-size: 1.875rem;
      }
      div {
        width: 100%;
      }
    }
    .aside-sidebar {
      img {
        width: 100%;
        opacity: 0.7;
      }
      .link-countainer {
        height: 180px;
        a {
          display: inline-block;
          margin: 5px 5px 5px 15px;
          padding: 10px;
          color: #858585;
          text-decoration: none;
          text-align: center;
          border-radius: 5px;
          border: 1px solid @borderColor;
          &:hover {
            background-color: #ecf5ff;
          }
        }
      }
    }
  }
}
</style>
