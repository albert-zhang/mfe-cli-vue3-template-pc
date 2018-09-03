import {BaseHTTPClient, XhrResultParserPresetType, XhrResponse, XhrError} from '@mydreamplus/aglarond/lib/http';

class ApiClient extends BaseHTTPClient {
  constructor() {
    super({
      // baseURL 根据你要调用的服务来设置，服务名与.env中配置的SERVICES_REQUIRED保持一致:
      baseURL: (window as any).servicePrefix.smartOffice,
      resultParserConfig: {
        presetType:XhrResultParserPresetType.ONLY_PHP, // 根据调用的服务情况调整
      },
    });
    // 根据需要设置相应的header，当然也可以在其它地方设置
    this.setHeaders({
      TOKEN: 'SOME-TOKEN',
    });
  }

  protected processResult(r: Promise<XhrResponse>) {
    return r;
    /* example:
     *return r.catch((err: XhrError) => {
     *  if (err.code === 100403) {
     *    const store: any = {};
     *    store.dispatch('goLogin');
     *  }
     *  return Promise.reject(err);
     *});
     */
  }

}

const apiClient = new ApiClient();

export default apiClient;


// 添加你需要的接口：

// example:
// export const getOrder = (id: string) => apiClient.get('/order/:id', {id});
