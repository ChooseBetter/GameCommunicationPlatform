<template>
  <div class="block">
    <div class="component-header" v-if="blockConfig.header">
      <slot name="header">
        <div class="title" :style="blockConfig.titleStyle">
          {{ blockConfig.title }}
        </div>
        <div class="skip">
          {{ blockConfig.skip }}
          <el-icon v-if="blockConfig.hasHeaderArrow"><ArrowRight /> </el-icon>
        </div>
      </slot>
    </div>
    <slot :name="blockConfig.key" :blockData="blockData">
      <ul class="component-content">
        <li
          class="content-item"
          v-for="item in blockData"
          :key="item"
          @click="handleItemClick(item)"
        >
          <slot name="item" :item="item">
            <div class="item">
              <div class="content">
                <img v-if="item?.image" v-imageLazy="item?.image" alt="" />
                <span>
                  {{ item?.content ? item.content : item?.label }}
                </span>
              </div>
              <el-icon v-if="blockConfig.hasItemArrow"><ArrowRight /> </el-icon>
            </div>
          </slot>
        </li>
      </ul>
    </slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  titleStyle?: any;
  blockData?: any;
  blockConfig?: any;
}
const props = withDefaults(defineProps<Props>(), {
  titleStyle: {},
  blockConfig: {},
});

const emits = defineEmits(["handleItemClick"]);

// 处理item点击
const handleItemClick = (item: any) => {
  emits("handleItemClick", item);
};
</script>

<style scoped lang="less">
.block {
  margin-bottom: 10px;
  background-color: #fff;
  box-shadow: 0 0 5px 1px @borderColor;
  .component-header {
    padding: 0 8px 0 24px;
    box-sizing: border-box;
    height: 47px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid @borderColor;
    color: #71777c;
    .title {
      font-size: 18px;
      font-weight: bolder;
    }
    .skip {
      cursor: pointer;
      color: @fontColor;
    }
  }
  .component-content {
    padding: 10px 0;
    .content-item {
      &:hover {
        background-color: #f4f4f5;
      }
      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 24px;
        i {
          color: @fontColor;
        }
        .content {
          display: flex;
          justify-content: left;
          align-items: center;
          img {
            width: 30px;
            height: 30px;
            border-radius: 5px;
          }
          span {
            margin-left: 15px;
            font-size: 18px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
}
</style>
