import {modalConfigType} from "@/components/types";
export const modalConfigCellphone: modalConfigType = {
  modalTitle: "手机号换绑",
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
      field: "cellphone",
      label: "手机号码",
      type: "input",
      labelWidth: 80,
      width: "300px",
      placeholder: "请输入手机号码",
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
    cellphone: [
      {required: true, message: "手机号码不能为空", trigger: "blur"},
      {
        message: "手机号码格式不正确",
        trigger: "blur",
        pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
      },
    ],
  },
};
