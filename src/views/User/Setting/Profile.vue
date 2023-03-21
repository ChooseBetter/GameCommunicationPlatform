<template>
  <div id="profile">
    <div class="container">
      <div class="container-header">个人资料</div>
      <div class="container-content">
        <div class="content-left">
          <div class="form">
            <base-form
              ref="BaseFormRef"
              label-position="left"
              :isInline="false"
              :formItems="formItems"
              :formData="formData"
            ></base-form>
          </div>
          <el-button type="primary" @click="handleSave">保存修改</el-button>
        </div>
        <div class="content-right">
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
            <template #tip>
              <span class="tip">支持jpg、png、jpeg格式大小 5M以内的图片</span>
            </template>
          </el-upload>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, nextTick, watch} from "vue";
import type {UploadProps} from "element-plus";
import {userStore} from "@/store/user";
import {ElNotification} from "element-plus";

const props = defineProps({
  userEntireInfo: {
    type: Object,
    requierd: true,
  },
});
const {userInfo, UpdateUserInfoAction} = userStore();

const formData = ref<any>({});
const formItems = [
  {
    field: "userName",
    label: "用户名",
    type: "input",
    labelWidth: 100,
    width: "400px",
    placeholder: "请填写用户名",
  },
  {
    field: "sex",
    label: "性别",
    type: "radio",
    labelWidth: 100,
    width: "200px",
    placeholder: "请选择性别",
    options: [
      {label: "男", value: 1},
      {label: "女", value: 2},
      {label: "未知", value: 3},
    ],
  },
  {
    field: "signature",
    label: "个性签名",
    type: "textarea",
    labelWidth: 100,
    width: "400px",
    placeholder: "请填写个性签名",
    maxlength: 100,
    showWordLimit: true,
  },
];

// 图片
const imageUrl = ref("");
const handleChangeImage: UploadProps["onChange"] = (
  uploadFile,
  uploadFiles
) => {
  var file: any = uploadFile.raw;
  var reader = new FileReader();
  // 转base64
  reader.onload = (event: any) => {
    imageUrl.value = event.target.result;
  };
  reader.readAsDataURL(file);
  formData.value.avatar = file;
};

watch(
  () => props.userEntireInfo,
  (newValue) => {
    for (let item of formItems) {
      if (item.field === "email") {
        formData.value[item.field] = props.userEntireInfo![
          item.field
        ].substring(-1, 13);
      } else {
        formData.value[item.field] = props.userEntireInfo![item.field];
      }
    }
    nextTick(() => {
      if (newValue?.avatar) {
        imageUrl.value = newValue.avatar;
      }
    });
  }
);

const handleSave = async () => {
  const res = await UpdateUserInfoAction(userInfo._id, formData.value);
  if (res.code === 200) {
    ElNotification({
      title: "成功",
      message: res.msg,
      type: "success",
    });
  }
};
</script>

<style scoped lang="less">
#profile {
  background-color: #fff;
  .container {
    padding: 30px;
    width: 700px;
    .container-header {
      font-size: 22px;
      font-weight: bolder;
    }
    .container-content {
      display: flex;
      .content-left {
        .form {
          margin: 10px 0;
          padding-top: 20px;
          border-top: 1px solid #e5e5e5;
          border-bottom: 1px solid #e5e5e5;
        }
      }
      .content-right {
        margin-left: 50px;
        img {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          border: 1px solid #e5e5e5;
        }
      }
    }
  }
}
.avatar-uploader {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 1px dashed #8c939d;
  box-sizing: content-box;
  :deep(.el-upload--text) {
    width: 90px;
    height: 90px;
  }
  .tip {
    margin-top: 10px;
    font-size: 14px;
    color: #8c939d;
  }
}
.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 90px;
  height: 90px;
  text-align: center;
}
</style>
