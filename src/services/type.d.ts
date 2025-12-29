declare namespace API {
  type Result<T> = {
    success: boolean;
    errorMessage: string;
    data: T;
    code: number;
    msg: string;
  };

  type UserInfo = {
    name: string;
    avatar: string;
    enabled: boolean;
    loginId: string;
    loginPwd: string;
    nickname: string;
    permission: number;
    _id: string;
  };
}
