import {
  BaseHTTPClient,
  MxjResponse,
  MxjResponseError,
  HTTPClientConfig,
} from '@mydreamplus/aglarond/lib/http';
import { Message } from 'element-ui';
import LoginUtil, { LoginUtilConfig } from '../util/login';
import { ApiUtil } from '../util';

interface BaseClientConstructorOptions {
  useLogin: boolean;
  loginConfig: LoginUtilConfig;
}

window.addEventListener('unhandledrejection', (evt: PromiseRejectionEvent) => {
  evt.promise.catch((err: any) => {
    if (err instanceof MxjResponseError) {
      const mxjErr = err as MxjResponseError;
      if (ApiUtil.isErrorCodeNeedReportGlobally(mxjErr.code, true)) {
        Message.error(err.message);
      }
    }
  });
});

export class BaseClient extends BaseHTTPClient {
  constructor(cfg: HTTPClientConfig,
              options: BaseClientConstructorOptions = { useLogin: true, loginConfig: {}} ) {
    if (!cfg.resultParserConfig) {
      cfg.resultParserConfig = {};
    }
    cfg.resultParserConfig.useValidateErrorMessageOverwriteMessage = false;
    cfg.timeout = 10000;
    super(cfg);
    if (options.useLogin) {
      LoginUtil.fit(this, options.loginConfig);
    }
  }

  protected processResult(r: Promise<MxjResponse>) {
    return r.catch((err: MxjResponseError) => {
      if (err.message === 'Network Error') {
        err.message = '网络错误';
      } else if (String(err.message).indexOf('timeout of') >= 0 && String(err.message).indexOf('exceeded') >= 0) {
        err.message = '请求超时';
      }
      if (ApiUtil.isErrorCodeNeedReportGlobally(err.code)) {
        Message.error(err.message);
      }
      return Promise.reject(err);
    });
  }

}
