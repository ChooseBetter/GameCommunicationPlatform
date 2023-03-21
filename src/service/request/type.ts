import {AxiosRequestConfig, AxiosResponse} from "axios";
// 基础拦截
export interface RequestInterceptors<T = AxiosResponse> {
  // 请求拦截
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig;
  requestInterceptorCatch?: (error: any) => any;
  // 响应拦截
  responseInterceptor?: (res: T) => T;
  responseInterceptorCatch?: (error: any) => any;
}

// 自定义请求配置
export interface RequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  interceptors?: RequestInterceptors<T>;
  showLoading?: boolean;
}

export interface otherReqConfig {
  withCredentials?: boolean;
  headers: {
    "Content-Type": string;
  };
}
