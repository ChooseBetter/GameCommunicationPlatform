<template>
  <div id="email-code">
    <div class="title">找回密码</div>
    <el-form
      class="content-inner"
      ref="elFormRef"
      :model="formData"
      :rules="rules"
    >
      <el-form-item prop="email">
        <el-input type="email" placeholder="邮箱" v-model="formData.email">
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input type="text" placeholder="验证码" v-model="formData.code">
          <template #append>
            <el-button class="codebtn" @click="handleCode" :disabled="hasClick">
              <span v-show="!showCount">获取验证码</span>
              <span v-show="showCount">{{ count }}</span>
            </el-button>
          </template>
        </el-input>
      </el-form-item>

      <el-button
        class="nextbtn"
        type="primary"
        :disabled="hasNext"
        @click="handleNext"
      >
        下一步
      </el-button>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive} from "vue";
import {useRouter} from "vue-router";
import {reqCode, reqEmailAndCode} from "@/service/find";
import {ElMessage} from "element-plus";
import type {FormInstance, FormRules} from "element-plus";

const router = useRouter();
const emits = defineEmits(["changeStep"]);
// 邮箱/验证码
const formData = reactive({
  email: "",
  code: "",
});
// 下一步按钮不可用
const hasNext = ref(true);
// 获取验证码按钮不可用
const hasClick = ref(false);
// 倒计时时间
const count = ref(60);
// 开启倒计时
const showCount = ref(false);
const elFormRef = ref<FormInstance>();

const rules = reactive<FormRules>({
  email: [
    {required: true, message: "邮箱不能为空", trigger: "blur"},
    {
      message: "邮箱格式不正确",
      trigger: "blur",
      pattern: /^[1-9][0-9]{4,}@qq.com$/,
    },
  ],
});

// 获取验证码操作
const handleCode = async () => {
  if (showCount.value) return;
  await elFormRef.value?.validate(async (valid, fields) => {
    if (valid) {
      const res = await reqCode("/emails/code", {email: formData.email});
      if (res.code === 200) {
        ElMessage({
          message: res.msg,
          type: "success",
        });
        countdown();
        // 下一步按钮设置为可用
        hasNext.value = false;
      } else {
        ElMessage({
          message: res.msg,
          type: "warning",
        });
      }
    }
  });
};

// 下一步操作
const handleNext = async () => {
  const res = await reqEmailAndCode("/emails/verify", formData);
  if (res.code === 200) {
    router.push({path: "/find/reset", query: {email: res.data.email}});
    emits("changeStep", 1);
  } else {
    ElMessage({
      message: res.msg,
      type: "warning",
    });
    formData.code = "";
  }
};

// 倒计时
const countdown = () => {
  hasClick.value = true;
  showCount.value = true;
  let setTimer = setInterval(() => {
    if (count.value > 0) {
      count.value--;
    } else {
      showCount.value = false;
      hasClick.value = false;
      count.value = 60;
      clearInterval(setTimer);
    }
  }, 1000);
};
</script>

<style scoped lang="less">
#email-code {
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
  .codebtn {
    width: 100px;
    height: 100%;
    border: 1px solid @borderColor;
    border-left: none;
    background-color: #fff;
  }
  .nextbtn {
    width: 100%;
  }
}
</style>
