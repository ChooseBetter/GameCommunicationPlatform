<template>
  <div id="account">
    <div class="container">
      <div class="container-header">个人资料</div>
      <div class="container-content">
        <div class="form">
          <base-form
            label-position="left"
            :isInline="false"
            :formItems="formItems"
            :formData="formData"
          >
            <template #cellphone="{item}">
              <el-input
                :type="item.type"
                :style="`width:${item.width}`"
                :disabled="true"
                v-model="formData[item.field]"
              />
              <span @click="handleClick(item, '换绑')">换绑</span>
            </template>
            <template #email="{item}">
              <el-input
                :type="item.type"
                :style="`width:${item.width}`"
                :disabled="true"
                v-model="formData[item.field]"
              >
                <template #append>
                  {{ item.append }}
                </template>
              </el-input>
              <span @click="handleClick(item, '换绑')">换绑</span>
            </template>
            <template #password="{item}">
              <el-input
                :type="item.type"
                :style="`width:${item.width}`"
                :disabled="true"
                v-model="formData[item.field]"
              />
              <span @click="handleClick(item, '重置')">重置</span>
            </template>
          </base-form>
        </div>
      </div>
    </div>
    <page-modal ref="pageModalRef" :modalConfig="modalConfig">
      <template #footer style="margin: 0 auto">
        <div class="btn-box">
          <el-button type="primary" @click="handleFooterBtn">
            {{ footerBtn }}
          </el-button>
        </div>
      </template>
    </page-modal>
  </div>
</template>

<script setup lang="ts">
import {ref, watch, nextTick} from "vue";
import {modalConfigCellphone} from "./modalConfigCellphone";
import {modalConfigEmail} from "./modalConfigEmail";
import {modalConfigPassword} from "./modalConfigPassword";
import {reqResetUserInfo} from "@/service/find";
import {ElNotification} from "element-plus";
import {Md5} from "ts-md5";
import Utils from "@/utils";

const props = defineProps({
  userEntireInfo: {
    type: Object,
    requierd: true,
  },
});

const emits = defineEmits(["reacquireUserEntireInfo"]);

const modalConfig = ref<any>({});
const formData = ref<any>({});
const formItems = [
  {
    field: "cellphone",
    label: "手机号码",
    type: "input",
    labelWidth: 100,
    width: "400px",
    placeholder: "请填写手机号码",
  },
  {
    field: "email",
    label: "邮箱",
    type: "input",
    labelWidth: 100,
    width: "400px",
    placeholder: "请填写邮箱",
    append: ".com",
  },
  {
    field: "password",
    label: "密码",
    type: "password",
    labelWidth: 100,
    width: "400px",
    placeholder: "请填写密码",
  },
];

const BaseFormRef = ref();
const pageModalRef = ref();
const footerBtn = ref("");
const reqUrl = ref("");

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
      if (newValue?.avatar && BaseFormRef.value) {
        BaseFormRef.value.imageUrl = newValue.avatar;
      }
    });
  }
);

// 点击换绑重置展示pageModal
const handleClick = (item: any, value: string) => {
  pageModalRef.value.dialogVisible = true;
  footerBtn.value = value;
  if (item.field === "cellphone") {
    modalConfig.value = modalConfigCellphone;
    reqUrl.value = "/emails/reset/cellphone";
  } else if (item.field === "email") {
    modalConfig.value = modalConfigEmail;
    reqUrl.value = "/emails/reset/email";
  } else {
    modalConfig.value = modalConfigPassword;
    reqUrl.value = "/emails/reset/password";
  }
};

// 点击pageModal底部按钮
const handleFooterBtn = async () => {
  const ruleFormRef = pageModalRef.value.BaseFormRef.ruleFormRef;
  await ruleFormRef.validate(async (valid: any) => {
    if (valid) {
      let data = Object.assign({}, pageModalRef.value.formData);
      // 如果是修改密码
      if (data.password) {
        const md5 = new Md5();
        const password = Utils.encryptAction(
          md5,
          pageModalRef.value.formData.password
        );
        data.password = password;
      }
      const res = await reqResetUserInfo(reqUrl.value, {
        _id: props.userEntireInfo!._id,
        ...data,
      });
      if (res.code === 200) {
        ElNotification({
          title: "成功",
          message: res.msg,
          type: "success",
        });
        emits("reacquireUserEntireInfo");
      } else {
        ElNotification({
          title: "失败",
          type: "warning",
        });
      }
      pageModalRef.value.dialogVisible = false;
      pageModalRef.value.handleClose();
    }
  });
};
</script>

<style scoped lang="less">
#account {
  background-color: #fff;
  .container {
    padding: 30px;
    width: 700px;
    .container-header {
      font-size: 22px;
      font-weight: bolder;
    }
    .container-content {
      .form {
        margin: 10px 0;
        padding-top: 20px;
        border-top: 1px solid #e5e5e5;
        border-bottom: 1px solid #e5e5e5;
      }
    }
  }
}
:deep(.el-form-item__content) {
  display: flex;
  justify-content: space-between;
  span {
    cursor: pointer;
    color: #007fff;
  }
}
:deep(.el-dialog__body) {
  padding: 10px 20px;
}
.btn-box {
  text-align: center;
  button {
    width: 100%;
    height: 40px;
    font-size: 20px;
    font-weight: bolder;
  }
}
</style>
