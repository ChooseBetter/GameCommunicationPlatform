import {ref} from "vue";
import {reqCode} from "@/service/find";
import {ElMessage} from "element-plus";

export function useCode(BaseFormRef: any, formData: any) {
  // 获取验证码按钮不可用
  const hasClick = ref(false);
  // 倒计时时间
  const count = ref(60);
  // 开启倒计时
  const showCount = ref(false);
  let timer: any = null;

  // 获取验证码操作
  const handleCode = async () => {
    if (showCount.value) return;
    await BaseFormRef.value.ruleFormRef.validateField(
      "email",
      async (valid: any) => {
        if (valid) {
          countdown();
          const res = await reqCode("/emails/code", {email: formData.email});
          if (res.code === 200) {
            ElMessage({
              message: res.msg,
              type: "success",
            });
            countdown();
          } else {
            ElMessage({
              message: res.msg,
              type: "warning",
            });
          }
        }
      }
    );
  };

  // 倒计时
  const countdown = () => {
    hasClick.value = true;
    showCount.value = true;
    // 定时器
    timer = window.setInterval(() => {
      if (count.value > 0) {
        count.value--;
      } else {
        showCount.value = false;
        hasClick.value = false;
        count.value = 60;
        clearInterval(timer);
      }
    }, 1000);
  };

  const handleClear = () => {
    clearInterval(timer);
    showCount.value = false;
    hasClick.value = false;
    count.value = 60;
  };

  return [timer, count, showCount, hasClick, handleCode, handleClear];
}
