export interface IUserParams {
  currentPage: number;
  eachPage: number;
  loginId: string;
  nickname: string;
}

export interface IUserInfos {
  _id: string; // mongodb 自动生成的 id
  loginId: string; // 账号
  loginPwd: string; // 密码
  avatar: string; // 头像
  nickname: string; // 昵称
  mail: string; // 邮箱
  qq: string; // QQ
  wechat: string; // 微信号
  github: string; // github
  intro: string; // 个人介绍
  registerDate: string; // 注册时间
  lastLoginDate: string; // 上次登录事件
  points: number; // 积分
  enabled: boolean; // 是否可用
}

export interface IResUserInfos {
  count: number;
  currentPage: number;
  data: IUserInfos[];
  eachPage: number;
  totalPage: number;
}
