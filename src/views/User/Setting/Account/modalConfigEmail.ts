import {modalConfigType} from "@/components/types";
export const modalConfigEmail: modalConfigType = {
  modalTitle: "邮箱换绑",
  modalWidth: "30%",
  labelPosition: "left",
  modalFooter: false,
  formItems: [
    {
      field: "email",
      label: "邮箱",
      type: "input",
      labelWidth: 80,
      width: "300px",
      placeholder: "请填写邮箱",
    },
    {
      field: "code",
      label: "验证码",
      type: "input",
      labelWidth: 80,
      width: "300px",
      placeholder: "请输入验证码",
    },
    {
      field: "newEmail",
      label: "邮箱",
      type: "input",
      labelWidth: 80,
      width: "300px",
      placeholder: "请填写邮箱",
    },
  ],
  rules: {
    email: [
      {required: true, message: "邮箱不能为空", trigger: "blur"},
      {
        message: "邮箱格式不正确",
        trigger: "blur",
        pattern: /^[1-9][0-9]{4,}@qq.com$/,
      },
    ],
    code: [{required: true, message: "验证码不能为空", trigger: "blur"}],
    newEmail: [
      {required: true, message: "邮箱不能为空", trigger: "blur"},
      {
        message: "邮箱格式不正确",
        trigger: "blur",
        pattern: /^[1-9][0-9]{4,}@qq.com$/,
      },
    ],
  },
};
