import { constantRoutes, asyncRoutes } from '@/router/routes';
import { RouteConfig } from 'vue-router';
import StoreDecorator, {
  Action,
  Mutation,
  Getter,
} from '@mydreamplus/aglarond/lib/store-decorator';
import router from '@/router';

interface StateType {
  routes: RouteConfig[];
}

@StoreDecorator
class StoreModule {
  public state() {
    return {
      routes: [],
    };
  }

  @Mutation('anyStateKey')
  public init(state: StateType) {
    router.addRoutes(asyncRoutes);
    state.routes = constantRoutes.concat(asyncRoutes);
  }
}

export default new StoreModule();
