import httpRequest from "@/service";
import {IDataType} from "../type";

export function reqCategoryList(url: string) {
  return httpRequest.get<IDataType>(url);
}
export function reqTagList(url: string) {
  return httpRequest.get<IDataType>(url);
}
export function reqSquareList(url: string) {
  return httpRequest.get<IDataType>(url);
}
export function reqArticleList(url: string, data: any) {
  return httpRequest.post<IDataType>(url, data);
}
