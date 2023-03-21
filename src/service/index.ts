// service 统一出口
import Request from "./request";
import {BASE_URL, TIME_OUT} from "./request/config";
import Utils from "@/utils";

const httpRequest = new Request({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  interceptors: {
    requestInterceptor: (config: any) => {
      // 携带token的拦截
      const token = Utils.LocalCache().getCache("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      config.headers!["Content-Type"] =
        config.headers!["Content-Type"] || "application/json;charset=UTF-8";
      config.headers!["Accept"] = "application/json;charset=UTF-8";
      return config;
    },
    requestInterceptorCatch(error) {
      return error;
    },
    responseInterceptor(res) {
      return res;
    },
    responseInterceptorCatch(error) {
      return error;
    },
  },
});

export default httpRequest;
