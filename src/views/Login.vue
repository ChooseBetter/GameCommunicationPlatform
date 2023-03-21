<template>
  <div id="login">
    <div class="container">
      <!-- 注册表单 -->
      <div
        :class="[
          'container_form',
          'container_signup',
          !isActive ? 'container_signup_active' : '',
        ]"
      >
        <el-form
          class="form"
          ref="registerFormRef"
          :model="registerForm"
          :rules="rules"
        >
          <h2 class="title">注册账号</h2>
          <el-form-item prop="userName">
            <el-input
              type="text"
              placeholder="用户名"
              v-model.trim="registerForm.userName"
            />
          </el-form-item>
          <el-form-item prop="email">
            <el-input
              type="email"
              placeholder="邮箱"
              v-model.trim="registerForm.email"
            />
          </el-form-item>
          <el-form-item prop="userPwd">
            <el-input
              type="password"
              placeholder="密码"
              show-password
              v-model.trim="registerForm.userPwd"
              @keyup.enter.native="
                LoginAndRegisterAction(registerFormRef, registerForm)
              "
            />
          </el-form-item>
          <el-button
            class="btn"
            @click="LoginAndRegisterAction(registerFormRef, registerForm)"
          >
            点击注册
          </el-button>
        </el-form>
      </div>
      <!-- 登录表单 -->
      <div
        :class="[
          'container_form',
          'container_signin',
          isActive ? 'container_signin_active' : '',
        ]"
      >
        <el-form
          class="form"
          ref="loginFormRef"
          :model="loginForm"
          :rules="rules"
        >
          <h2 class="title">欢迎登陆</h2>
          <el-form-item prop="userName">
            <el-input
              type="text"
              placeholder="用户名"
              v-model.trim="loginForm.userName"
            />
          </el-form-item>
          <el-form-item prop="userPwd">
            <el-input
              type="password"
              placeholder="密码"
              show-password
              v-model.trim="loginForm.userPwd"
              @keyup.enter.native="
                LoginAndRegisterAction(loginFormRef, loginForm)
              "
            />
          </el-form-item>

          <router-link to="/find/code">忘记密码？</router-link>
          <el-button
            class="btn"
            @click="LoginAndRegisterAction(loginFormRef, loginForm)"
          >
            登陆
          </el-button>
        </el-form>
      </div>

      <!-- 遮盖 -->
      <div class="container_overlay">
        <div
          :class="[
            'overlay_panel',
            'overlay_left',
            isActive ? 'overlay_left_active' : '',
          ]"
        >
          <button class="btn" @click="switchActive(loginFormRef)">
            没有账号，点击注册
          </button>
        </div>

        <div
          :class="[
            'overlay_panel',
            'overlay_right',
            !isActive ? 'overlay_right_active' : '',
          ]"
        >
          <button class="btn" @click="switchActive(registerFormRef)">
            已有账号，直接登陆
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive} from "vue";
import {ElMessage, FormInstance, FormRules} from "element-plus";
import {userStore} from "@/store/user";
import {LoginDataType} from "@/store/type";
import {useRoute, useRouter} from "vue-router";
import {Md5} from "ts-md5";
import Utils from "@/utils";

const route = useRoute();
const router = useRouter();
// store
const store = userStore();
// 是否选中
const isActive = ref(true);
// 登录和注册的表单实例
const loginFormRef = ref<FormInstance>();
const registerFormRef = ref<FormInstance>();
// 注册表单的数据
const registerForm = reactive({
  userName: "",
  userPwd: "",
  email: "",
});
// 登录表单的数据
const loginForm = reactive({
  userName: "",
  userPwd: "",
});
// 表单规则
const rules = reactive<FormRules>({
  userName: [
    {required: true, message: "请输入用户名", trigger: "blur"},
    {min: 3, max: 5, message: "长度为3-5", trigger: "blur"},
  ],
  userPwd: [
    {required: true, message: "请输入密码", trigger: "blur"},
    {min: 6, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur"},
  ],
  email: [
    {required: true, message: "邮箱不能为空", trigger: "blur"},
    {
      message: "邮箱格式不正确",
      trigger: "blur",
      pattern: /^[1-9][0-9]{4,}@qq.com$/,
    },
  ],
});

// 切换表单
const switchActive = (formEl: FormInstance | undefined) => {
  isActive.value = !isActive.value;
  if (!formEl) return;
  setTimeout(() => {
    // 重置表单
    formEl.resetFields();
  }, 500);
};

// 登录/注册操作
const LoginAndRegisterAction = async (
  formEl: FormInstance | undefined,
  formData: LoginDataType
) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      // 对密码进行加密
      const md5 = new Md5();
      const res = await similarAction(md5, formData);
      if (res.data) {
        if (route.query.redirect) {
          router.push(route.query.redirect as string);
        } else {
          router.push("/");
        }
      } else {
        ElMessage({
          message: res.msg,
          type: "error",
        });
      }
    }
    formEl.resetFields();
  });
};

// 登录注册操作中的类似操作
const similarAction = async (md5: Md5, formData: LoginDataType) => {
  const password = Utils.encryptAction(md5, formData.userPwd);
  // 获取加密后的密码并赋值
  const reqFormData = {...formData, userPwd: password};
  let url = "/users/login";
  formData?.email ? (url = "/users/register") : url;
  const res = await store.LoginAndRegisterAction(url, reqFormData);
  return res;
};
</script>

<style scoped lang="less">
.el-form-item {
  width: 90%;
  margin: 0 auto 18px auto;
  :deep(.el-form-item__error) {
    margin-left: 15px;
    font-size: 16px;
  }
}
.el-input {
  :deep(.el-input__wrapper) {
    margin: 5px 0;
    padding: 10px 15px;
    border-radius: 10px;
    // 去除边框
    box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color))
      inset;
    .el-input__inner {
      font-size: 18px;
      font-weight: bolder;
      color: #00a1f8;
    }
    // 提示字体样式
    .el-input__inner::placeholder {
      font-size: 18px;
      font-weight: bolder;
      color: #b8e4fb;
    }
    .el-icon {
      font-size: 24px;
    }
  }
}

#login {
  background-image: linear-gradient(to left, #c0b2f7, #72c7f4);
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.container {
  background-color: #f4f4f5;
  border-radius: @button-radius;
  box-shadow: 0 0.9rem 1.7rem rgba(0, 0, 0, 0.25);
  max-width: @max-width;
  width: 100%;
  height: @max-height;
  overflow: hidden;
  position: relative;
  margin: auto;

  .container_form {
    position: absolute;
    width: 50%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
    transition: all 0.6s ease-in-out;
    .title {
      font-size: 30px;
      background-image: linear-gradient(to left, @purple, @lightblue);
      color: transparent;
      background-clip: text;
      -webkit-background-clip: text;
    }
    .form {
      padding-top: 30px;
      text-align: center;
      a {
        float: right;
        margin: 0px 15px 10px 0px;
        text-decoration: none;
        font-weight: bolder;
        color: #c0b2f7;
      }
      .btn {
        margin-top: 10px;
        width: 80%;
        height: 40px;
        font-size: 20px;
        font-weight: bolder;
        color: white;
        border: none;
        border-radius: 5px;
        background-image: linear-gradient(to left, @purple, @lightblue);
      }
    }
  }
  .container_signin {
    transform: translateX(0);
  }
  .container_signin_active {
    opacity: 1;
    z-index: 1;
    transform: translateX(100%);
  }
  .container_signup {
    transform: translateX(100%);
  }
  .container_signup_active {
    opacity: 1;
    z-index: 1;
    transform: translateX(0);
  }

  .container_overlay {
    position: relative;
    max-width: @max-width;
    width: 100%;
    height: @max-height;
    .overlay_panel {
      display: flex;
      justify-content: space-around;
      align-items: center;
      position: absolute;
      top: 0;
      left: 0;
      width: 50%;
      height: 100%;
      opacity: 1;
      z-index: 0;
      transition: all 0.6s ease-in-out;
      background-color: white;
      .btn {
        padding: 10px;
        border-radius: 15px;
        border: 1px solid @borderColor;
        font-size: 24px;
        color: white;
        background-image: linear-gradient(to left, #72c7f4, #c0b2f7);
      }
    }
    .overlay_left {
      transform: translateX(100%);
    }
    .overlay_left_active {
      z-index: 1;
      transform: translateX(0);
    }
    .overlay_right {
      transform: translateX(0);
    }
    .overlay_right_active {
      z-index: 1;
      transform: translateX(100%);
    }
  }
}
</style>
