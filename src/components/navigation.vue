<template>
  <div id="navigation" :style="props.navStyle">
    <div class="navigation-container" :style="props.containerStyle">
      <el-scrollbar>
        <el-menu
          text-color="#71777c"
          active-text-color="#007fff"
          :mode="mode"
          :default-active="curRoute?.name || navList[0].value"
          @select="handleSelect"
        >
          <template v-for="item in navList" :key="item.value">
            <el-menu-item :index="item.value" @click="handleItemClick(item)">
              <el-icon v-if="item.icon"><component :is="item.icon" /></el-icon>
              <span>{{ item.label }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import {navListType} from "@/store/type";

interface Props {
  navStyle?: any;
  containerStyle?: any;
  ulStyle?: any;
  navList: navListType[];
  side?: boolean;
  mode?: string;
  curRoute?: any;
}
const props = withDefaults(defineProps<Props>(), {
  containerStyle: {},
  navList: () => [],
  side: false,
  mode: "vertical",
  curRoute: () => {},
});

const emits = defineEmits(["handleSelect", "handleItemClick"]);

// 点击导航事件
const handleSelect = (key: string) => {
  emits("handleSelect", key);
};
const handleItemClick = (item: any) => {
  emits("handleItemClick", item);
};
</script>

<style scoped lang="less">
#navigation {
  width: 100%;
  background-color: #fff;
}
.el-menu {
  border: none;
  .el-menu-item {
    height: 40px;
    font-size: 18px;
    font-weight: bolder;
    line-height: 40px;
    i {
      font-size: 20px;
    }
    span {
      height: 40px;
    }
  }
}
.el-menu--vertical {
  max-height: 400px;
}
.el-menu--horizontal {
  max-height: 40px;
}
</style>
