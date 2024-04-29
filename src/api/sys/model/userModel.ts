export interface LoginParams {
  account: string;
  password: string;
  captchaCode: string;
  type: number;
  verifyUUID: string;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

export interface GetPermCode {
  img: string;
  uuid: string;
  expire: number;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  token: string;
  account: string;
  avatar: string;
  createTime: string;
  mail: string;
  nickName: string;
  phone: string;
  type: null | any;
  uid: string;
}

/**
 * @description: Login interface return value
 */
export interface ResultUserInfoModel {
  account: string;
  avatar: string;
  company: string;
  createTime: string;
  dept: string;
  mail: string;
  nickName: string;
  phone: string;
  position: string;
  uid?: string | number;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  // 用户id
  uid?: string | number;
  // 用户名
  account: string;
  // 真实名字
  nickName: string;
  // 头像
  avatar: string;
}
