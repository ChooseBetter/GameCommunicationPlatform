<template>
  <div class="article-config">
    <!-- 文章配置 -->
    <el-form
      ref="configFormRef"
      :model="configData"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="封面&摘要" prop="cover">
        <div class="form-item">
          <el-upload
            class="cover-image"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleChangeImage"
          >
            <img class="show-image" v-if="imgUrl" :src="imgUrl" />
            <el-icon class="uploader-icon"><Plus /></el-icon>
          </el-upload>
          <el-input
            class="textarea"
            ref="textareaRef"
            type="textarea"
            v-model="configData.abstract"
            :rows="4"
            maxlength="256"
            show-word-limit
            resize="none"
            placeholder="摘要(必填)：会在推荐、列表等场景外露，帮助读者快速了解内容，支持默认将正文前256字符键入摘要文本框"
          />
          <el-button
            class="extract"
            size="small"
            v-show="configData.abstract?.length === 0"
            @click="extractAction"
          >
            一键提取
          </el-button>
        </div>
      </el-form-item>
      <el-form-item label="文章分类" prop="category">
        <el-select
          v-model="configData.category"
          class="m-2"
          placeholder="请选择分类"
          size="large"
        >
          <el-option
            v-for="item in categoryList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="文章标签" prop="tags">
        <el-tag
          v-for="(tag, index) in configData.tags"
          :key="index"
          class="mx-1"
          closable
          effect="dark"
          @close="handleClose(tag)"
        >
          {{ tag.label }}
        </el-tag>
        <el-button
          v-if="deletedTagList.length !== 0"
          class="button-new-tag ml-1"
          size="small"
          @click="handleAdd"
        >
          + New Tag
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, withDefaults} from "vue";
import type {UploadProps, UploadFile, FormRules} from "element-plus";
import {commonStore} from "@/store/common";
import {commonListType, configDataType} from "@/store/type";

// props数据
interface Props {
  valueText: string;
}
const props = withDefaults(defineProps<Props>(), {
  valueText: "",
});

// store
const {categoryList, tagList} = commonStore();

// 封面图片显示
const imgUrl = ref("");
// 文章配置的表单数据
const configData: configDataType = reactive({
  cover: "", // 封面
  abstract: "", // 摘要
  category: [], // 分类
  tags: [], // 标签
});

const configFormRef = ref();
const rules = reactive<FormRules>({
  cover: {required: true},
  category: {required: true, trigger: ["blur"]},
  tags: {required: true},
});

// 文章标签列表
configData.tags = [...tagList];
// 已删除标签列表
const deletedTagList = ref([] as commonListType[]);
// 标签删除事件
const handleClose = (tag: commonListType) => {
  configData.tags?.splice(configData.tags.indexOf(tag), 1);
  deletedTagList.value.push(tag);
};
// 标签添加事件
const handleAdd = () => {
  if (deletedTagList.value.length === 0) return;
  configData.tags?.push(deletedTagList.value[0]);
  deletedTagList.value.shift();
};

// 选择图片，转换为base64并展示
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
    // 页面显示的图片base64
    imgUrl.value = event.target.result;
  };
  reader.readAsDataURL(file);
  console.log(file);

  // 要传给后台的二进制文件
  configData.cover = file;
};

// 一键提取
const textareaRef = ref();
const extractAction = () => {
  if (props.valueText.length === 0) return;
  // 最多获得256个,并去除空格
  configData.abstract = props.valueText.slice(0, 256).replace(/\s*/g, "");
  textareaRef.value.focus();
};

// 判断表单验证是否通过
const formValidAction = async () => {
  if (!configFormRef.value) return;
  return await configFormRef.value.validate((valid: any, fields: any) => {
    if (valid) {
      return true;
    } else {
      return false;
    }
  });
};

// 向外暴露的属性/方法
defineExpose({
  configData,
  formValidAction,
});
</script>

<style scoped lang="less">
:deep(.el-textarea .el-input__count) {
  right: 30px;
  bottom: 8px;
  color: red;
  background: none;
}
.el-tag {
  margin-right: 10px;
}
.article-config {
  width: 800px;
  margin: 20px auto;
  padding: 32px;
  background-color: #fff;
  border-radius: 20px;
  .form-item {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    .cover-image {
      width: 150px;
      height: 90px;
      border: 1px dashed @borderColor;
      margin-right: 30px;
      .uploader-icon {
        font-size: 24px;
        width: 150px;
        height: 90px;
        text-align: center;
      }
      .show-image {
        width: 150px;
        height: 90px;
      }
    }
    .extract {
      position: absolute;
      right: 80px;
      bottom: 2px;
    }
  }
}
</style>
