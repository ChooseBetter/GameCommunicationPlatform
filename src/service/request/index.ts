import axios from "axios";
import type {AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";
import type {RequestConfig, RequestInterceptors, otherReqConfig} from "./type";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import {ElMessage} from "element-plus";
import router from "@/router";

const DEFAULT_LOADING = true;
const TOKEN_INVALID = "Token认证失败，请重新登录";
const NETWORK_EROR = "网络请求异常，请稍后重试";

class Request {
  // axios实例
  instance: AxiosInstance;
  // 拦截器对象
  interceptors?: RequestInterceptors;
  showLoading: boolean;

  constructor(config: RequestConfig) {
    this.instance = axios.create(config);
    this.interceptors = config.interceptors;
    this.showLoading = config.showLoading ?? DEFAULT_LOADING;

    // 全局响应拦截器
    this.instance.interceptors.request.use(
      (res: AxiosRequestConfig) => {
        NProgress.start();
        return res;
      },
      (err: any) => err
    );

    // 使用实例拦截器
    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptor,
      this.interceptors?.requestInterceptorCatch
    );
    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.responseInterceptorCatch
    );

    this.instance.interceptors.response.use(
      (res: any) => {
        NProgress.done();
        if (res.data) {
          const {code, msg} = res.data;
          if (code === 200) {
            return res.data;
          } else {
            ElMessage.error(msg || NETWORK_EROR);
            return Promise.reject(msg || NETWORK_EROR);
          }
        } else if (res?.response.data.code === 50001) {
          ElMessage.error(TOKEN_INVALID);
          setTimeout(() => {
            router.push({
              path: "/login",
              query: {redirect: router.currentRoute.value.path},
            });
          }, 1500);
          return Promise.reject(TOKEN_INVALID);
        } else {
          return;
        }
      },
      (err: any) => {
        if (err.response.status === 404) {
          return Promise.reject("404");
        }
        return err;
      }
    );
  }

  request<T>(config: RequestConfig<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      // 单个请求对请求config的处理
      if (config.interceptors?.requestInterceptor) {
        config = config.interceptors.requestInterceptor(config);
      }

      // 判断是否需要显示loading
      if (config.showLoading === false) {
        this.showLoading = config.showLoading;
      }

      this.instance
        .request<any, T>(config)
        .then((res) => {
          // 1.单个请求对数据的处理
          if (config.interceptors?.responseInterceptor) {
            res = config.interceptors.responseInterceptor(res);
          }
          // 2.将showLoading设置为true，否则会影响下一个请求
          this.showLoading = DEFAULT_LOADING;

          // 3.将结果resolve返回出去
          resolve(res);
        })
        .catch((err: any) => {
          this.showLoading = DEFAULT_LOADING;
          reject(err);
        });
    });
  }

  get<T>(url: string, params?: any, config?: otherReqConfig): Promise<T> {
    return this.request<T>({url, params, ...config, method: "GET"});
  }
  post<T = any>(url: string, data: any, config?: otherReqConfig): Promise<T> {
    return this.request<T>({url, data, ...config, method: "POST"});
  }
  delete<T = any>(url: string, data: any, config?: otherReqConfig): Promise<T> {
    return this.request<T>({url, data, ...config, method: "DELETE"});
  }
  patch<T = any>(url: string, data: any, config?: otherReqConfig): Promise<T> {
    return this.request<T>({url, data, ...config, method: "PATCH"});
  }
}

export default Request;
