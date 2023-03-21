import httpRequest from "@/service";
import {IDataType} from "../type";

export const reqAttention = (url: string, data: any) => {
  return httpRequest.post<IDataType>(url, data);
};
