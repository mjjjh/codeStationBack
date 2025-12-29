// 运行时配置
import { RequestConfig } from '@umijs/max';
import { message } from 'antd';
import { checkLoginApi, getAdminInfoApi } from './services/admin';

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<API.UserInfo> {
  const token = localStorage.getItem('adminToken');
  let res = null;
  if (token) {
    res = await checkLoginApi();
  }
  // 如果是登录页面 token有效
  if (location.pathname === '/login') {
    if (res?.data) {
      history.go(-1);
    }
  } else {
    if (!res?.data) {
      localStorage.removeItem('adminToken');
      message.error('请先登录').then(() => {
        location.href = '/login';
      });
    } else {
      const result = await getAdminInfoApi(res.data._id);
      return {
        name: result.data.nickname,
        ...result.data,
      };
    }
  }
  return {
    name: '',
    avatar: '',
    enabled: false,
    loginId: '',
    loginPwd: '',
    nickname: '',
    permission: 0,
    _id: '',
  };
}

export const layout = () => {
  return {
    logo: '/logo.png',
    menu: {
      locale: false,
    },
    logout: () => {
      localStorage.removeItem('adminToken');
      location.href = '/login';
    },
  };
};

// 请求配置，可以在这里做请求拦截等
export const request: RequestConfig = {
  requestInterceptors: [
    (url, options) => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        if (options.headers === undefined) {
          options.headers = {};
        }
        options.headers['Authorization'] = 'Bearer ' + token;
      }
      return {
        url,
        options,
      };
    },
  ],
  responseInterceptors: [
    (response) => {
      // 不再需要异步处理读取返回体内容，可直接在data中读出，部分字段可在 config 中找到
      // const { data = {} as any, config } = response;
      // do something
      return response;
    },
    // 一个二元组，第一个元素是 request 拦截器，第二个元素是错误处理
    [
      (response) => {
        return response;
      },
      (error) => {
        return Promise.reject(error);
      },
    ],
    // 数组，省略错误处理
    [
      (response) => {
        return response;
      },
    ],
  ],
};
