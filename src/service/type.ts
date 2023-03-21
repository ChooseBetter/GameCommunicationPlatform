export interface IDataType<T = any> {
  code: number;
  msg: string;
  responseTime: string;
  data?: T;
  params?: T;
}
