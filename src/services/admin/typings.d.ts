export interface IAdminInfos {
  avatar: string;
  enabled: boolean;
  loginId: string;
  loginPwd: string;
  nickname: string;
  permission: number;
  _id: string;
}

export interface IAdminLoginInfos {
  _id?: string;
  loginId: string;
  loginPwd: string;
  captcha: string;
}
