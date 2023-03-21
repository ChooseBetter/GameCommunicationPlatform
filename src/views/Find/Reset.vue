<template>
  <div id="reset">
    <div class="title">重置密码</div>
    <el-form
      class="content-inner"
      ref="elFormRef"
      :model="resetForm"
      :rules="rules"
    >
      <el-form-item prop="password">
        <el-input
          type="password"
          v-model="resetForm.password"
          placeholder="密码"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password2">
        <el-input
          type="password"
          v-model="resetForm.password2"
          placeholder="确认密码"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          class="resetbtn"
          type="primary"
          @click="handleReset(elFormRef)"
        >
          重置密码
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive} from "vue";
import {useRoute, useRouter} from "vue-router";
import {ElMessage, FormInstance, FormRules} from "element-plus";
import {Md5} from "ts-md5";
import Utils from "@/utils";
import {reqResetPwd} from "@/service/find";

const route = useRoute();
const router = useRouter();
const emits = defineEmits(["changeStep"]);
const elFormRef = ref<FormInstance>();
const resetForm = reactive({
  password: "",
  password2: "",
});
// 自定义校验
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value !== resetForm.password) {
    callback("两次密码不一致");
  } else {
    callback();
  }
};

const rules = reactive<FormRules>({
  password: [
    {required: true, message: "请输入密码", trigger: "blur"},
    {min: 6, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur"},
  ],
  password2: [
    {required: true, message: "请输入密码", trigger: "blur"},
    {min: 6, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur"},
    {validator: validatePass2, trigger: "blur", required: true},
  ],
});

const handleReset = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid: boolean, fields: any) => {
    if (valid) {
      const md5 = new Md5();
      const password = Utils.encryptAction(md5, resetForm.password);
      // 获取加密后的密码并赋值
      const res = await reqResetPwd("/emails/reset", {
        email: route.query.email as string,
        password,
      });
      if (res.code === 200) {
        router.push({path: "/find/success"});
        emits("changeStep", 2);
      }
    } else {
      ElMessage({
        type: "warning",
        message: fields.password2[0].message,
      });
    }
    formEl.resetFields();
  });
};
</script>

<style scoped lang="less">
#reset {
  .title {
    margin-bottom: 1rem;
    padding-left: 0.3125rem;
    border-left: 0.3125rem solid rgb(58, 119, 253);
    font-weight: bolder;
  }
  :deep(.el-input__wrapper) {
    font-size: 1.25rem;
    padding: 0.3125rem 0;
    padding-left: 1.25rem;
    box-sizing: border-box;
    background-color: rgb(245, 246, 250);
    &:focus {
      outline: none;
    }
  }
  .resetbtn {
    width: 100%;
  }
}
</style>
