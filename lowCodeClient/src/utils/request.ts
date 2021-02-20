import axios from 'axios';
import { message } from 'antd';

const isDev = process.env.NODE_ENV === 'development';

const instance = axios.create({
  // 服务器地址需要自己配置和开发
  baseURL: '//localhost:7001/api/v1',
  timeout: 10000,
  withCredentials: true,    //这个东西 开启一定要在后端开启允许 credentials: true, 
});

// 添加请求拦截器
instance.interceptors.request.use(
  function(config:any) {
    // 在发送请求之前做些什么
    config.headers = {
      'x-requested-with': '',
      authorization: '',
    };
    return config;
  },
  function(error:any) {
    // 对请求错误做些什么
    return Promise.reject(error);
  },
);

// 添加响应拦截器
instance.interceptors.response.use(
  function(response:any) {
    // 对响应数据做点什么
    // 你的业务数据
    return response.data;
  },
  function(error:any) {
    // 对响应错误做点什么
    const { response } = error;
    if (response) {
      if (response.status === 404) {
        message.error('请求资源未发现');
      } else if (response.status === 403) {
        message.error(response.data.msg, () => {
          window.location.href = '/admin/login';
        });
      } else {
        message.error(response.data.msg);
      }
    }
    return Promise.reject(error);
  },
);

export default instance;