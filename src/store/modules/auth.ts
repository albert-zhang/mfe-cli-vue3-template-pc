import { constantRoutes, asyncRoutes } from '../../router/routes';
import { RouteConfig } from 'vue-router';
import StoreDecorator, {
  Action,
  Mutation,
  Getter,
} from '@mydreamplus/aglarond/lib/store-decorator';
import { ActionContext } from 'vuex';

// import {
//   getStaffInfo,
// } from '../../api/userClient';

function getStaffInfo() {
  // TODO: 获取用户的API
  return Promise.resolve({ result: { info: {}, perms: [] } });
}

const STAFF_INFO_EXPIRE_DURATION = 600000; // unit: ms

let gettingStaffInfoPromise: Promise<any> | null = null;
let _gettingStaffInfoPromiseResolve: any = null;
let _gettingStaffInfoPromiseReject: any = null;

function makePendingGettingStaffInfoPromise() {
  gettingStaffInfoPromise = new Promise((resolve: any, reject: any) => {
    _gettingStaffInfoPromiseResolve = resolve;
    _gettingStaffInfoPromiseReject = reject;
  });
}
function clearPendingGettingStaffInfoPromise() {
  gettingStaffInfoPromise = null;
}
function resolveGettingStaffInfoPromise() {
  if (_gettingStaffInfoPromiseResolve) {
    _gettingStaffInfoPromiseResolve();
  }
}
function rejectGettingStaffInfoPromise() {
  if (_gettingStaffInfoPromiseResolve) {
    _gettingStaffInfoPromiseReject();
  }
}

interface StateType {
  info: object | null;
  permissions: PermissionKey[];
  lastGetStaffInfoTime: number;
}

@StoreDecorator
class StoreModule {
  public state(): StateType {
    return {
      info: null,
      permissions: [],
      lastGetStaffInfoTime: 0,
    };
  }

  @Getter
  public permissions(state: StateType) {
    return state.permissions;
  }

  @Mutation()
  public setInfoAndPermissions(state: StateType, {info, permissions}: any) {
    state.info = info;
    state.permissions = permissions;
  }

  @Mutation()
  public setLastGetStaffInfoTime(state: StateType, { value }: any) {
    state.lastGetStaffInfoTime = value;
  }

  @Action()
  public async getCurrentStaffInfo(context: ActionContext<StateType, any>) {
    if (context.state.permissions) {
      const isValid = new Date().getTime() - context.state.lastGetStaffInfoTime < STAFF_INFO_EXPIRE_DURATION;
      if (isValid) {
        return;
      }
    }
    if (gettingStaffInfoPromise) {
      await gettingStaffInfoPromise;
      return;
    }
    makePendingGettingStaffInfoPromise();
    let getStaffInfoResult: any = null;
    try {
      getStaffInfoResult = await getStaffInfo();
    } catch (ex) {
      rejectGettingStaffInfoPromise();
      clearPendingGettingStaffInfoPromise();
    }
    if (getStaffInfoResult) {
      context.commit('setInfoAndPermissions', {
        info: getStaffInfoResult.result.info,
        permissions: getStaffInfoResult.result.perms,
      });
      context.commit('setLastGetStaffInfoTime', {
        value: new Date().getTime(),
      });
      resolveGettingStaffInfoPromise();
      clearPendingGettingStaffInfoPromise();
    }
  }
}

export default new StoreModule();
