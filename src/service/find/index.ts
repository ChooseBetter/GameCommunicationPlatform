import httpRequest from "@/service";
import {IDataType} from "../type";

export function reqCode(url: string, data: {email: string}) {
  return httpRequest.post<IDataType>(url, data);
}
export function reqEmailAndCode(
  url: string,
  data: {email: string; code: string}
) {
  return httpRequest.post<IDataType>(url, data);
}

export function reqResetPwd(
  url: string,
  data: {email: string; password: string}
) {
  return httpRequest.post<IDataType>(url, data);
}

export function reqResetUserInfo(url: string, data: any) {
  return httpRequest.post<IDataType>(url, data);
}
