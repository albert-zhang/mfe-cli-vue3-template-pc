import {
  MxjResponse,
  MxjResponseError,
} from '@mydreamplus/aglarond/lib/http';

import { BaseClient } from './baseClient';

class ExampleClient extends BaseClient {
  constructor() {
    super({
      baseURL: '//' + (window as any).configs['service_prefix.XXXXXXXXXXX'],
    });
  }
}

const exampleClient = new ExampleClient();

export default exampleClient;

// 添加你需要的接口：

// example:
// export const getOrder = (id: string) => apiClient.get('/order/:id', {id});
