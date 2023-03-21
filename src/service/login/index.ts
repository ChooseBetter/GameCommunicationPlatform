import httpRequest from "@/service";
import {IDataType} from "../type";
import {LoginDataType} from "@/store/type";

export function LoginAndRegisterRequest(url: string, loginData: LoginDataType) {
  return httpRequest.post<IDataType>(url, loginData);
}
