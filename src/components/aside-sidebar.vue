<template>
  <div class="aside-sidebar" :style="{width: `${width}px`}">
    <slot name="aside">
      <template v-for="(block, index) in sidebarConfig" :key="index">
        <block
          v-if="listData"
          :blockData="listData[index]"
          :blockConfig="block"
          @handleItemClick="handleItemClick"
        >
          <template #[`${block.key}`]="{blockData}">
            <slot :name="block.key" :blockData="blockData"></slot>
          </template>
        </block>
      </template>
    </slot>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
interface Props {
  width?: number;
  sidebarConfig?: any;
  listData?: any[];
}
const props = withDefaults(defineProps<Props>(), {
  width: 240,
  sidebarConfig: {},
  listData: <any>[],
});

const emits = defineEmits(["handleSidebarItemClick"]);
const handleItemClick = (item: any) => {
  emits("handleSidebarItemClick", item);
};

const listData = ref<any>([]);
watch(props.listData, () => {
  console.log(props.listData);
  listData.value = props.listData;
});
</script>
<style scoped></style>
