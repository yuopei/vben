/*
 * @Date: 2024-03-08 10:40:05
 * @LastEditTime: 2024-03-11 11:49:12
 * @FilePath: /vue-vben-admin/src/api/sys/user.ts
 * @Description: 用户相关接口
 */
import { defHttp } from '@/utils/http/axios';
import { LoginParams, LoginResultModel, GetPermCode, ResultUserInfoModel } from './model/userModel';
import { useGlobSetting } from '@/hooks/setting';
import { ErrorMessageMode } from '#/axios';

enum Api {
  getConfigApi = '/system/cloudServer',
  Login = '/user/login',
  Logout = '/user/logout',
  GetUserInfo = '/user/info',
  GetPermCode = '/user/captchaImage',
}
const { get_config_api = '' } = useGlobSetting();

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      apiUrl: (window as any).base_login_api,
      errorMessageMode: mode,
      withToken: false,
    },
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<ResultUserInfoModel>(
    { url: Api.GetUserInfo },
    { errorMessageMode: 'none', apiUrl: (window as any).base_login_api },
  );
}

export function getPermCode() {
  return defHttp.get<GetPermCode>(
    { url: Api.GetPermCode },
    { apiUrl: (window as any).base_login_api, withToken: false },
  );
}

export function doLogout() {
  return defHttp.post({ url: Api.Logout }, { apiUrl: (window as any).base_login_api });
}

export function getConfigApi() {
  return defHttp.get<string>(
    { url: Api.getConfigApi },
    { apiUrl: get_config_api, withToken: false },
  );
}
