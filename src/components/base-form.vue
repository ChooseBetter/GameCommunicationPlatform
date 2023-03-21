<template>
  <div class="base-form">
    <div class="header">
      <slot name="header"></slot>
    </div>
    <el-form
      ref="ruleFormRef"
      :model="formData"
      :inline="isInline"
      :rules="rules"
      :label-position="labelPosition"
    >
      <template v-for="item in formItems" :key="item.field">
        <el-form-item
          :label="item.label"
          :label-width="`${item.labelWidth}px`"
          v-show="
            formData[`${item.hidden?.hiddenKey}`] === item.hidden?.hiddenValue
          "
          :prop="item.field"
        >
          <slot :name="item.field" :item="item">
            <template
              v-if="
                item.type === 'input' ||
                item.type === 'password' ||
                item.type === 'textarea'
              "
            >
              <el-input
                :type="item.type"
                :rows="item.rows"
                :style="`width:${item.width}`"
                :placeholder="item.placeholder"
                :show-password="item.type === 'password'"
                :maxlength="item.maxlength"
                :show-word-limit="item.showWordLimit"
                v-model="formData[`${item.field}`]"
              >
                <template v-if="item.append" #append>
                  {{ item.append }}
                </template>
              </el-input>
            </template>
            <template v-else-if="item.type === 'select'">
              <el-select
                :style="`width:${item.width}`"
                :value="item.default"
                :placeholder="item.placeholder"
                v-model="formData[`${item.field}`]"
              >
                <el-option
                  v-for="option in item.options"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </template>
            <template v-else-if="item.type === 'datepicker'">
              <el-date-picker
                :style="`width:${item.width}`"
                v-bind="item.otherOptions"
                v-model="formData[`${item.field}`]"
              >
              </el-date-picker>
            </template>
            <template v-else-if="item.type === 'radio'">
              <el-radio-group
                :style="`width:${item.width}`"
                v-model="formData[`${item.field}`]"
              >
                <el-radio
                  v-for="option in item.options"
                  :key="option.value"
                  :label="option.value"
                >
                  {{ option.label }}
                </el-radio>
              </el-radio-group>
            </template>
            <template v-else-if="item.type === 'cascader'">
              <el-cascader
                :style="`width:${item.width}`"
                :placeholder="item.placeholder"
                :options="item.options"
                :props="item.props"
                v-model="formData[`${item.field}`]"
                clearable
                filterable
              />
            </template>
            <template v-else-if="item.type === 'checkbox'">
              <el-checkbox-group
                :style="`width:${item.width}`"
                v-model="formData[`${item.field}`]"
              >
                <template v-if="item.extraType === 'button'">
                  <el-checkbox-button
                    v-for="option in item.options"
                    :key="option"
                    :label="option.label"
                  />
                </template>
                <template v-else>
                  <el-checkbox
                    v-for="option in item.options"
                    :key="option"
                    :label="option.label"
                  />
                </template>
              </el-checkbox-group>
            </template>
            <template v-else-if="item.type === 'upload'">
              <template v-if="item.extraType === 'image'">
                <el-upload
                  class="avatar-uploader"
                  :auto-upload="false"
                  :show-file-list="false"
                  :on-change="handleChangeImage"
                >
                  <img v-if="imageUrl" :src="imageUrl" class="image" />
                  <el-icon v-else class="avatar-uploader-icon">
                    <Plus />
                  </el-icon>
                </el-upload>
              </template>
              <template v-else>
                <el-upload
                  :style="`width:${item.width}`"
                  class="upload-demo"
                  :auto-upload="false"
                  :show-file-list="false"
                >
                  <el-button type="primary">点击上传</el-button>
                  <template #tip v-if="item.placeholder">
                    <div class="el-upload__tip">
                      {{ item.placeholder }}
                    </div>
                  </template>
                </el-upload>
              </template>
            </template>
          </slot>
        </el-form-item>
      </template>
    </el-form>
    <div class="footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, PropType} from "vue";
import type {
  UploadProps,
  UploadFile,
  FormInstance,
  FormRules,
} from "element-plus";
import {formItemType} from "@/components/types";
const props = defineProps({
  isInline: {
    type: Boolean,
    default: true,
  },
  formItems: {
    type: Array as PropType<formItemType[]>,
    default: () => [],
  },
  formData: {
    type: Object,
    required: true,
  },
  rules: {
    type: Object,
    default: () => {},
  },
  labelPosition: {
    type: String,
    default: "left",
  },
});
const emits = defineEmits(["update:formData"]);

const ruleFormRef = ref<FormInstance>();
const imageUrl = ref("");
const prepareFile = ref<UploadFile>();

const handleChangeImage: UploadProps["onChange"] = (
  uploadFile,
  uploadFiles
) => {
  prepareFile.value = uploadFile;
  var file: any = uploadFile.raw;
  var reader = new FileReader();
  // 转base64
  reader.onload = (event: any) => {
    imageUrl.value = event.target.result;
  };
  reader.readAsDataURL(file);
  emits("update:formData", {...props.formData, ["avatar"]: file});
};

// 表单校验规则
const rules = reactive<FormRules>(props.rules ? props.rules : {});

defineExpose({
  imageUrl,
  ruleFormRef,
});
</script>

<style scoped lang="less">
.avatar-uploader {
  border: 1px solid #eee;
  width: 100px;
  height: 100px;
}
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
}
.image {
  width: 100px;
  height: 100px;
}
</style>
