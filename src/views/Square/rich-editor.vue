<template>
  <div id="editor-container">
    <Editor
      style="min-height: 100px; max-height: 500px"
      v-model="valueHtml"
      mode="default"
      :defaultConfig="editorConfig"
      @onCreated="handleCreated"
      @onChange="handleChange"
    />
    <div class="editor-toolbar" v-if="isEdit">
      <Toolbar
        mode="default"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
      />
      <el-button
        type="primary"
        :disabled="valueText == ''"
        @click="handlePublish"
      >
        发布
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, shallowRef, onBeforeUnmount} from "vue";
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";
import "@wangeditor/editor/dist/css/style.css";
import {Editor, Toolbar} from "@wangeditor/editor-for-vue";
import {IToolbarConfig, IEditorConfig, IDomEditor} from "@wangeditor/editor";
import {userStore} from "@/store/user";
import {articleOrThemeStore} from "@/store/articleOrTheme";

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: true,
  },
  themeHTML: {
    type: String,
    default: "",
  },
});

/* 富文本配置 */
// 工具栏配置
const toolbarConfig: Partial<IToolbarConfig> = {
  excludeKeys: [
    "headerSelect",
    "blockquote",
    "|",
    "bold",
    "underline",
    "italic",
    "color",
    "bgColor",
    "|",
    "fontSize",
    "fontFamily",
    "lineHeight",
    "|",
    "bulletedList",
    "numberedList",
    "todo",
    "|",
    "insertTable",
    "codeBlock",
    "divider",
    "|",
    "undo",
    "redo",
    "|",
    "fullScreen",
    "group-more-style",
    "group-justify",
    "group-indent",
    "group-video",
    "insertImage",
  ],
};

// 编辑器配置,初始化 MENU_CONF 属性
let editorConfig: Partial<IEditorConfig> = {
  placeholder: "请输入内容...",
  autoFocus: true,
  scroll: true,
  maxLength: props.isEdit ? 100 : 0,
  readOnly: !props.isEdit,
  MENU_CONF: {},
};

// 上传成功的图片列表
const uploadedImgList = ref([] as string[]);
// 上传图片
editorConfig.MENU_CONF!["uploadImage"] = {
  server: "/api/files/upload-image",
  fieldName: "image",
  // 单个文件上传成功之后,将返回的url存到上传成功的列表
  onSuccess(file: File, res: any) {
    const {url} = res.data;
    uploadedImgList.value.push(url);
  },
  // 单个文件上传失败
  onFailed(file: File, res: any) {
    ElMessage({message: `${file.name}上传失败`, type: "error"});
  },
  // 上传错误，或者触发 timeout 超时
  onError(file: File, err: any, res: any) {
    ElMessage({message: `${file.name}上传出错`, type: "error"});
  },
};
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();
// 编辑器显示的HTML内容
const valueHtml = ref("");
const valueText = ref("");

const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
  // 当isEdit为false和articleHTML不为空字符串时，则是展示
  editorConfig.maxLength = 100;
  if (!props.isEdit && props.themeHTML !== "") {
    editor.setHtml(props.themeHTML);
  }
};
const handleChange = (editor: IDomEditor) => {
  valueText.value = editor.getText();
};

// 自定义操作
const router = useRouter();
const emits = defineEmits(["handleClose"]);
const {userInfo} = userStore();
const {publishAction} = articleOrThemeStore();
// 处理发布
const handlePublish = () => {
  // 请求服务器删除已删除的图片
  const entireImgList = editorRef.value
    .getElemsByType("image")
    .map((item: any) => {
      return item.src;
    });
  // 已删除的图片列表
  let needtodel = uploadedImgList.value.filter((item: string) => {
    return !entireImgList.includes(item);
  });
  // 上传数据
  publishAction("themes", {
    squareId: router.currentRoute.value.params._id as string,
    content: valueHtml.value,
    list: needtodel,
    authorId: userInfo._id,
  });
  emits("handleClose");
};

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});
</script>

<style scoped lang="less">
.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
