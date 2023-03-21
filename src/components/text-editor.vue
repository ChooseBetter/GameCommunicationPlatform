<template>
  <div id="text-editor">
    <!-- 工具栏 -->
    <Toolbar
      v-if="isEdit"
      class="toolbar"
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      mode="default"
    />
    <div id="editor-container">
      <slot name="extra"></slot>
      <!-- 标题 -->
      <el-input
        v-if="isEdit"
        class="titleInputBox"
        v-model="title"
        size="large"
        maxlength="100"
        placeholder="请输入标题"
        show-word-limit
        type="text"
      />
      <!-- 富文本 -->
      <Editor
        style="min-height: 300px"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        mode="default"
        @onCreated="handleCreated"
        @onChange="handleChange"
      />
    </div>

    <!-- 文章配置 -->
    <div id="config_container" v-if="isEdit">
      <articleConfig ref="articleConfigRef" :valueText="valueText">
      </articleConfig>
    </div>
  </div>
</template>

<script setup lang="ts">
import "@wangeditor/editor/dist/css/style.css";
import {Editor, Toolbar} from "@wangeditor/editor-for-vue";
import {IEditorConfig, IToolbarConfig} from "@wangeditor/editor";
import {ref, shallowRef, onBeforeUnmount, watch} from "vue";
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";
import {userStore} from "@/store/user";
import {articleOrThemeStore} from "@/store/articleOrTheme";
import articleConfig from "./article-config.vue";

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: true,
  },
  articleHTML: {
    type: String,
    default: "",
  },
});

/* 相关配置 */
// 工具栏配置
const toolbarConfig: Partial<IToolbarConfig> = {
  // 插入
  // insertKeys: [],
  // 排除
  excludeKeys: ["fullScreen"],
};
// 编辑器配置,初始化 MENU_CONF 属性
const editorConfig: Partial<IEditorConfig> = {
  placeholder: "请输入内容...",
  autoFocus: true,
  scroll: true,
  readOnly: !props.isEdit,
  MENU_CONF: {},
};

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

// 编辑器显示的HTML内容
const valueHtml = ref("");
// 编辑器显示的纯文本内容
const valueText = ref("");

// 文章标题
const title = ref("");
// article-config组件实例
const articleConfigRef = ref();

// 获取作者信息
const store = userStore();
const {userInfo} = store;
const {publishAction} = articleOrThemeStore();

// 上传成功的图片列表
const uploadedImgList = ref([] as string[]);
// 发布文章

const router = useRouter();
const publishData = async () => {
  // 判断文章配置是否验证通过
  const valid = await articleConfigRef.value.formValidAction();
  if (!valid) return;
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
  let data = {...articleConfigRef.value.configData};
  // 上传数据
  publishAction("/articles", {
    title: title.value,
    content: valueHtml.value,
    ...data,
    list: needtodel,
    authorId: userInfo._id,
  });
  router.push("/");
};

// 菜单配置
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

// 编辑器创建完毕时的回调
const handleCreated = (editor: any) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
  // 当isEdit为false和articleHTML不为空字符串时，则是文章展示
  if (!props.isEdit && props.articleHTML !== "") {
    editor.setHtml(props.articleHTML);
  }
};

// 当富文本内容改变时
const handleChange = () => {
  // 获取当前纯文本内容
  valueText.value = editorRef.value.getText();
};

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  if (editorRef.value === null) return;
  editorRef.value.destroy();
  console.log(editorRef.value);
});

defineExpose({
  publishData,
});
</script>

<style scoped lang="less">
#text-editor {
  border-radius: @containerRadius;
  #editor-container {
    width: 800px;
    margin: 20px auto 20px auto;
    padding: 32px;
    background-color: #fff;
    border-radius: 20px;
  }
  #config_container {
    padding-bottom: 60px;
  }
}
.titleInputBox {
  :deep(.el-input__wrapper) {
    font-size: 20px;
    box-shadow: 0 0 0 0px;
    border-bottom: 1px solid @borderColor;
  }
  :deep(.el-input__inner) {
    font-weight: bolder;
  }
}
</style>
