import httpRequest from "@/service";
import {IDataType} from "../type";
import {postCommentType, queryInfoType} from "@/store/type";

export function reqArticle(url: string) {
  return httpRequest.get<IDataType>(url);
}
export function reqSquare(url: string) {
  return httpRequest.get<IDataType>(url);
}

export function reqComment(url: string, queryInfo?: queryInfoType) {
  return httpRequest.get<IDataType>(url, queryInfo);
}

export function createComment(url: string, data: postCommentType) {
  return httpRequest.post<IDataType>(url, data);
}

export function saveLike(url: string, data: {userId: string}) {
  return httpRequest.post<IDataType>(url, data);
}
