import type {UploadUserFile} from "element-plus";
export interface tabsType {
  title: string;
  value: any;
}
export interface formItemType {
  field: string;
  label: string;
  labelWidth?: string | number;
  width?: string | number;
  type: string;
  extraType?: string;
  placeholder?: string;
  props?: object;
  default?: any;
  options?: any;
  otherOptions?: any;
  fileList?: UploadUserFile;
  rows?: number;
  hidden?: {
    hiddenKey: string;
    hiddenValue: number;
  };
  append?: string;
  maxlength?: number;
  showWordLimit?: false;
}

export type formProps = {
  isInline?: boolean;
  labelPosition?: string;
  formItems: Array<formItemType>;
};
export interface modalConfigType extends formProps {
  modalTitle: string;
  modalWidth?: string | number;
  modalFooter: boolean;
  rules?: object;
}
export interface contentListType {
  _id: string;
  author: string;
  cover: string;
  articleType: string;
  title: string;
  abstract: string;
  actionList: {
    view: number;
    like: number;
    comment: number;
  };
}

export interface sidebarConfigType {
  header: boolean;
  titleStyle: any;
  hasHeaderArrow: boolean;
  hasItemArrow: boolean;
  title?: string;
  skip?: string;
  key: string;
}
