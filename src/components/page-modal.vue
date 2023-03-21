<template>
  <div id="page-modal">
    <el-dialog
      destroy-on-close
      v-model="dialogVisible"
      :width="modalConfig.modalWidth"
      :title="modalConfig.modalTitle"
      :before-close="handleClose"
    >
      <slot>
        <base-form
          ref="BaseFormRef"
          :modalConfig="modalConfig"
          :formItems="modalConfig.formItems"
          :formData="formData"
          :rules="modalConfig.rules"
        >
          <template #code="{item}">
            <el-input
              type="text"
              v-model="formData[item.field]"
              :style="`width:${item.width}`"
            >
              <template #append>
                <el-button :disabled="hasClick" @click="handleCode">
                  <span v-show="!showCount">获取验证码</span>
                  <span v-show="showCount">{{ count }}</span>
                </el-button>
              </template>
            </el-input>
          </template>
        </base-form>
      </slot>

      <template v-if="modalConfig.footer" #footer>
        <slot name="footer">
          <div class="dialog-footer">
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="handleSubmit">确定</el-button>
          </div>
        </slot>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {ref, watch, nextTick} from "vue";
import {useCode} from "@/hooks/use-code";

const props = defineProps({
  modalConfig: {
    type: Object,
    required: true,
  },
  defaultInfo: {
    type: Object,
    default: () => ({}),
  },
  otherInfo: {
    type: Object,
    default: () => ({}),
  },
});

const emits = defineEmits(["handleSubmit", "handleCancel"]);

const BaseFormRef = ref();
const dialogVisible = ref(false);
const formData: any = ref({});

// 验证码相关逻辑
const [timer, count, showCount, hasClick, handleCode, handleClear] = useCode(
  BaseFormRef,
  formData.value
);

// 监视defaultInfo，设置formData的值
watch(
  () => props.defaultInfo,
  (newValue) => {
    for (const item of props.modalConfig.formItems) {
      // 判断item的类型是否为radio，且没有值时，设置默认值
      if (
        item.type === "radio" &&
        typeof newValue[`${item.field}`] === "undefined"
      ) {
        formData.value[`${item.field}`] = item.default;
      } else {
        formData.value[`${item.field}`] = newValue[`${item.field}`];
      }
    }
    nextTick(() => {
      if (newValue.avatar && BaseFormRef.value) {
        BaseFormRef.value.imageUrl = newValue.avatar;
      }
    });
  },
  {deep: true}
);

// 关闭操作
const handleClose = () => {
  dialogVisible.value = false;
  if (!BaseFormRef.value) return;
  BaseFormRef.value.ruleFormRef.resetFields();
  handleClear(timer);
};

// 提交操作
const handleSubmit = () => {
  emits("handleSubmit");
  dialogVisible.value = false;
};
// 取消操作
const handleCancel = () => {
  emits("handleCancel");
  dialogVisible.value = false;
};

defineExpose({
  BaseFormRef,
  dialogVisible,
  formData,
  handleClose,
});
</script>

<style scoped>
:deep(.el-dialog__body) {
  padding: 0 20px 20px 20px;
}
</style>
