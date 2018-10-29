import { BaseHTTPClient } from '@mydreamplus/aglarond/lib/http';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import 'url-search-params-polyfill';
import { MessageBox } from 'element-ui';
import debounce from 'lodash/debounce';


export interface LoginUtilConfig {
  appId?: string | number; // 用于 login 请求的appId
  loginUrl?: string; // page will redirect to this url when need login.
  logoutUrl?: string;
  authToken?: string | null; // authToken 优先级: 配置 > url获取 > localStorage
  refreshToken?: string | null; // refreshToken 优先级: 配置 > url获取 > localStorage
}

const LOGIN_UTIL_AUTHTOKEN = '__LOGIN__UTIL__AUTHTOKEN__';
const LOGIN_UTIL_REFRESHTOKEN = '__LOGIN__UTIL__REFRESHTOKEN__';
const LOGIN_UTIL_TRY_LOG = '__LOGIN_UTIL_TRY_LOG__';

/**
 * 尝试次数，超出最大次数后会进行弹窗提示
 * @param maxLength maximum length
 * @param callback
 */
const reTry = (maxLength: number = 5, next: () => void) => {
  const string = window.localStorage.getItem(LOGIN_UTIL_TRY_LOG) || '[]';
  const log: number[] = JSON.parse(string);
  let number: number = 0;
  let nextLog: number[] = [];
  const overMaximum = log.reverse().some((time) => {
    if (new Date(time).valueOf() + 30000 > Date.now()) {
      number += 1;
      nextLog.push(time);
    }
    if (number >= maxLength) {
      return true;
    }
    return false;
  });
  nextLog = nextLog.reverse();
  nextLog.push(Date.now());
  window.localStorage.setItem(LOGIN_UTIL_TRY_LOG, JSON.stringify(nextLog));
  if (overMaximum) {
    // 超出最大次数
    MessageBox.alert('登录可能遇到了某些问题', '提示', {
      confirmButtonText: '点击重试',
      callback: (action) => {
        next();
      },
    });
  } else {
    next();
  }
};

const __debounce: any = debounce((next) => next(), 300);

export default class LoginUtil {
  static get AUTH_TOKEN() {
    return this.__AUTH_TOKEN__;
  }
  static set AUTH_TOKEN(val: string | null) {
    window.localStorage.setItem(LOGIN_UTIL_AUTHTOKEN, val || '');
    this.__AUTH_TOKEN__ = val;
  }
  static get REFRESH_TOKEN() {
    return this.__REFRESH_TOKEN__;
  }
  static set REFRESH_TOKEN(val: string | null) {
    window.localStorage.setItem(LOGIN_UTIL_REFRESHTOKEN, val || '');
    this.__REFRESH_TOKEN__ = val;
  }
  static set loginUrl(val: string) {
    this.__loginUrl = val;
  }
  static get loginUrl() {
    const callback = encodeURIComponent(window.location.origin + '/');
    return this.__generateUrl({ baseUrl: this.__loginUrl, callback });
  }
  static set logoutUrl(val: string) {
    this.__logoutUrl = val;
  }
  static get logoutUrl() {
    const callback = encodeURIComponent(window.location.origin + '/');
    return this.__generateUrl({ baseUrl: this.__logoutUrl, callback });
  }
  // 用于刷新token时保持
  public static loginAjaxQueue: any;

  /**
   * static property
   */
  public static __AUTH_TOKEN__: string | null;

  public static __REFRESH_TOKEN__: string | null;

  public static appId: string | number = '';

  public static __loginUrl: string = '';

  public static __logoutUrl: string = '';

  public static __generateUrl(options: { baseUrl: string, callback: string }) {
    return options.baseUrl + `?appId=${LoginUtil.appId}&callback=${options.callback}`;
  }
  public static redirectToLogin(url: string) {
    __debounce(() => {
      reTry(5, () => {
        window.location.replace(url);
      });
    });
  }
  public static redirectToLogout(url: string) {
    window.location.replace(url);
  }

  public static setDefaultToken() {
    const query = new URLSearchParams(window.location.search);
    if (!LoginUtil.AUTH_TOKEN) {
      const authToken = query.get('token');
      LoginUtil.AUTH_TOKEN = authToken || window.localStorage.getItem(LOGIN_UTIL_AUTHTOKEN);
    }
    if (!LoginUtil.REFRESH_TOKEN) {
      const refreshToken = query.get('refresh_token');
      LoginUtil.REFRESH_TOKEN = refreshToken || window.localStorage.getItem(LOGIN_UTIL_REFRESHTOKEN);
    }

    // replace url
    query.delete('token');
    query.delete('refresh_token');
    const queryString = query.toString() ? `?${query.toString()}` : '';
    if (window.history.replaceState) {
      window.history.replaceState({
        [window.location.search]: queryString,
      }, document.title, window.location.pathname + queryString + window.location.hash);
    }

    // if no authToken, goto login.
    if (!LoginUtil.AUTH_TOKEN) {
      LoginUtil.redirectToLogin(LoginUtil.loginUrl);
    }
  }

  /**
   * 为httpClient添加login认证
   */
  public static fit(httpClient: BaseHTTPClient, {
    loginUrl = `//${(window as any).configs['service_prefix.business_user']}/login`,
    logoutUrl = `//${(window as any).configs['service_prefix.business_user']}/logout`,
    appId = (window as any).configs.user_appid,
    authToken,
    refreshToken,
  }: LoginUtilConfig) {
    const util = new LoginUtil();
    util.httpClient = httpClient;
    LoginUtil.loginUrl = loginUrl;
    LoginUtil.logoutUrl = logoutUrl;
    LoginUtil.appId = appId;
    LoginUtil.setDefaultToken();
    if (authToken) {
      LoginUtil.AUTH_TOKEN = authToken;
    }
    if (refreshToken) {
      LoginUtil.REFRESH_TOKEN = refreshToken;
    }
    util.injectLoginForHttpClient(util.httpClient);
    return util;
  }

  /**
   * login manual
   */
  public static login(options: { callback?: string } = {}) {
    const loginUrl = options.callback ? this.__generateUrl({
      baseUrl: this.__loginUrl,
      callback: options.callback,
    }) : this.loginUrl;
    LoginUtil.redirectToLogin(loginUrl);
  }

  /**
   * logout manual
   * Logout will redirect to login page, but the cookie will be removed on this moment.
   */
  public static logout(options: { callback?: string } = {}) {
    LoginUtil.AUTH_TOKEN = '';
    LoginUtil.REFRESH_TOKEN = '';
    const logoutUrl = options.callback ? this.__generateUrl({
      baseUrl: this.__logoutUrl,
      callback: options.callback,
    }) : this.logoutUrl;
    LoginUtil.redirectToLogout(logoutUrl);
  }

  /**
   * params
   */
  protected httpClient: BaseHTTPClient;

  /**
   * refresh token
   */
  protected refreshToken() {
    if (!LoginUtil.REFRESH_TOKEN) {
      LoginUtil.redirectToLogin(LoginUtil.loginUrl);
      return Promise.reject(new Error('Authentication No Refresh Token.'));
    }
    const url = `//${(window as any).configs['service_prefix.business_user']}/refresh/token?` +
      `refresh_token=${LoginUtil.REFRESH_TOKEN}`;
    return axios.get(url).then((res: AxiosResponse) => {
      if (res.data && res.data.code === 200 && res.data.data) {
        const data = res.data.data;
        LoginUtil.AUTH_TOKEN = data.token;
        LoginUtil.REFRESH_TOKEN = data.rToken;
        return Promise.resolve(res);
      } else {
        LoginUtil.redirectToLogin(LoginUtil.loginUrl);
        return Promise.reject(new Error('Authentication Refresh Token Failed.'));
      }
      return res;
    }).catch((err: Error) => {
      // 刷新toekn失败，跳转登录页面
      LoginUtil.redirectToLogin(LoginUtil.loginUrl);
      return Promise.reject(err);
    });
  }

  /**
   * asyncExec
   * @param config 请求的config
   * 用于刷新token后，异步执行当前正在处理的请求
   */
  protected async asyncExec(config: AxiosRequestConfig) {
    if (!LoginUtil.loginAjaxQueue) {
      LoginUtil.loginAjaxQueue = this.refreshToken();
    }
    return LoginUtil.loginAjaxQueue.then(() => {
      LoginUtil.loginAjaxQueue = null;
      return this.httpClient.request(config);
    });
  }

  protected injectLoginForHttpClient(httpClient: BaseHTTPClient) {
    // set auth-token headers
    httpClient.axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
      if (!LoginUtil.AUTH_TOKEN) {
        LoginUtil.redirectToLogin(LoginUtil.loginUrl);
      }
      config.headers.common['AUTH-PASSPORT-TOKEN'] = LoginUtil.AUTH_TOKEN;
      return config;
    });

    // process response when need refresh token or relogin
    httpClient.axiosInstance.interceptors.response.use((response: AxiosResponse) => {
      const data = response.data || {};
      if (data.code === 100402) {
        // refresh token
        return this.asyncExec(response.config);
      } else if (data.code === 100401) {
        // redirect to login
        LoginUtil.redirectToLogin(LoginUtil.loginUrl);
      }
      return response;
    }, (err: Error) => {
      return Promise.reject(err);
    });
  }
}

