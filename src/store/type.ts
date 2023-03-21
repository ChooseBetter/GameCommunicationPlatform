export interface LoginDataType {
  userName: string;
  userPwd: string;
  email?: string;
}
export interface userInfoType {
  _id: string;
  userName: string;
  experience: number;
  avatar: string;
  email: string;
  fansCount: string[];
  attentionsList: string[];
  favoritesCount: string[];
  articlesCount: string[];
}
export interface userStateType {
  token: string;
  userInfo: userInfoType;
}
export interface queryInfoType {
  offset: number;
  size: number;
  sort: number;
}
export interface commonListType {
  label: string;
  value: string;
}
export interface navListType extends commonListType {
  type: string;
  icon?: string;
}
export interface commonStateType {
  categoryList: commonListType[];
  tagList: commonListType[];
  entryList: any[];
  squareList: any[];
  content: string;
}

export interface configDataType {
  cover?: string;
  abstract?: string;
  category?: commonListType[];
  tags?: commonListType[];
}
export interface publishFormType extends configDataType {
  title?: string;
  content: string;
  authorId: string;
  list?: string[];
  squareId?: string;
}
export interface publishStateType {
  publishForm: publishFormType;
}

export interface postCommentType {
  articleOrThemeId: string;
  parentId?: string;
  beRepliedId?: string;
  userId: string;
  content: string;
}
export interface articleOrThemeStateType {
  articleInfo: any;
  squareInfo: any;
  commentList: any[];
  commentTotal: number;
  currentLike: string[];
  isFocus: boolean;
  currentComment: string;
  isFocusId: string;
  textarea: string;
}
