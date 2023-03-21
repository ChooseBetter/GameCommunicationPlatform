import httpRequest from "@/service";
import {IDataType} from "../type";
import {publishFormType} from "@/store/type";

export function reqUserEntireInfo(url: string) {
  return httpRequest.get<IDataType>(url);
}

export function reqIncreaseExperience(
  url: string,
  data: {_id: string; expNumber: number}
) {
  return httpRequest.post<IDataType>(url, data);
}
export function reqUpdateUserInfo(url: string, data: any, config?: any) {
  return httpRequest.post<IDataType>(url, data, config);
}

export const PublishRequest = (
  url: string,
  publishForm: publishFormType,
  config: any
) => {
  return httpRequest.post<IDataType>(url, publishForm, config);
};
