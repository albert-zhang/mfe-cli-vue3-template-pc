import { RouteConfig } from 'vue-router';
import StoreDecorator, {
  Action,
  Mutation,
  Getter,
} from '@mydreamplus/aglarond/lib/store-decorator';
import { ActionContext } from 'vuex';
import { PermissionUtil } from '../../util';

/*
约定：
- 所有顶部菜单对应的一个大的功能叫做一个“app”
- 所有app的父级路由都是“/app”
- 所有app的路由配置里面必须包括下面的信息：name、icon、meta.text、meta.sort
*/

interface StateType {
  // 所有被注册的子系统
  all: AppInfo[];
  // 当前子系统名
  currentAppName: string | null;
  // 所有被注册的子系统路由集合
  routes: { [prop: string]: RouteConfig[] };
  // 所有被注册的子系统的菜单集合
  menus: { [prop: string]: SideMenuItem[] };
  topMenus: AppInfo[];
}

@StoreDecorator
class StoreModule {
  public state(): StateType {
    return {
      all: [],
      currentAppName: null,
      routes: {},
      menus: {},
      topMenus: [],
    };
  }

  @Getter
  public all(state: StateType) {
    return state.all;
  }

  @Getter
  public currentAppName(state: StateType) {
    return state.currentAppName;
  }

  @Getter
  public currentApp(state: StateType) {
    return state.all.find((app: AppInfo) => {
      return app.name === (state.currentAppName as any);
    });
  }

  @Getter
  public currentMenus(state: StateType) {
    if (!state.currentAppName) {
      return [];
    }
    return state.menus[state.currentAppName!];
  }

  @Getter
  public currentRoutes(state: StateType) {
    return state.routes[state.currentAppName!];
  }

  @Getter
  public topMenus(state: StateType) {
    return state.topMenus;
  }

  @Mutation()
  public addApp(state: StateType, app: AppInfo) {
    let existedIndex = -1;
    state.all.some((item: AppInfo, idx: number) => {
      if (item.name === app.name) {
        existedIndex = idx;
        return true;
      }
      return false;
    });
    if (existedIndex >= 0) {
      state.all.splice(existedIndex, 1);
    }
    state.all.push(app);
  }

  @Mutation()
  public setCurrentAppName(state: StateType, { appName }: any) {
    state.currentAppName = appName;
  }

  @Mutation()
  public setMenus(state: StateType, { appName, menus }: any) {
    const cp = {...state.menus};
    cp[appName] = menus;
    state.menus = cp;
  }

  @Mutation()
  public addTopMenu(state: StateType, app: AppInfo) {
    let exitedIdx = -1;
    state.topMenus.some((item: AppInfo, idx: number) => {
      if (item.name === app.name) {
        exitedIdx = idx;
        return true;
      }
      return false;
    });
    if (exitedIdx >= 0) {
      state.topMenus.splice(exitedIdx, 1);
    }
    state.topMenus.push({
      ...app,
    });
    state.topMenus.sort((item1: AppInfo, item2: AppInfo) => {
      return item1.sort - item2.sort;
    });
  }

  @Mutation()
  public setRoutes(state: StateType, { appName, routes }: any) {
    state.routes[appName] = routes;
  }

  @Action()
  public async registerRoutes(context: ActionContext<StateType, any>, routes: RouteConfig) {
    context.commit('setRoutes', { appName: routes.name, routes: routes.children });
    const app: AppInfo = {
      name: routes.name!,
      path: `/app/${routes.path}`,
      icon: routes.icon!,
      text: routes.meta.text,
      sort: routes.meta.sort,
    };
    context.commit('addApp', app);
    context.dispatch('generateMenus', { appName: routes.name, forceRegenerate: true });
  }

  @Action()
  public async generateMenus(context: ActionContext<StateType, any>, { appName, forceRegenerate }: any) {
    if (!forceRegenerate && context.state.menus[appName]) {
      // already generated and not forcing, resolve immediately
      return;
    }
    const userPermissions = await PermissionUtil.getUserPermissions();
    const routes = context.state.routes[appName];
    const appInfo: AppInfo = context.state.all.find((e: AppInfo) => e.name === appName)!;
    if (!appInfo) {
      return;
    }
    const menus = createMenu(routes!, userPermissions, appInfo.path, 2);
    if (menus.length > 0) {
      context.commit('addTopMenu', appInfo);
    }
    context.commit('setMenus', { appName: appInfo.name, menus });
  }

  @Action()
  public async switchApp(context: ActionContext<StateType, any>, { appName }: any) {
    context.commit('setCurrentAppName', { appName });
  }

}


/**
 * 创建菜单
 * @param routes Routes
 * @param rootPath 附加 root path
 */
function createMenu(routes: RouteConfig[],
                    userPermissions: PermissionKey[],
                    parentPath: string = '',
                    maxLevel: number = 2,
                    level: number = 1): SideMenuItem[] {
  const menus: any[] = [];

  routes.forEach((route: RouteConfig) => {
    if (!PermissionUtil.isRouteAuthorizedSync(route, userPermissions)) {
      return;
    }

    if (!route.name) {
      return;
    }

    if (route.children) {
      // 如果发现子路由中path为空字符串的路由设置了权限，而且它的权限不被满足，那么此项菜单也不会创建
      const emptyPathChild = route.children.find((child: RouteConfig) => {
        return child.path === '';
      });
      if (emptyPathChild) {
        if (!PermissionUtil.isRouteAuthorizedSync(emptyPathChild, userPermissions)) {
          return;
        }
      }
    }

    let path: string = `${parentPath}/${route.path}`;
    path = path.replace(/\/$/, '');

    const menu: any = {
      path,
      icon: route.icon,
      ...(route.name && { name: route.name }),
      ...(route.meta && { text: route.meta.text }),
      ...(route.hidden && { hidden: route.hidden }),
    };

    if ((level < maxLevel) && route.children) {
      menu.children = createMenu(route.children, userPermissions, path, maxLevel, level + 1);
      if (menu.children.length > 0) {
        menus.push(menu);
      }
    } else {
      menus.push(menu);
    }
  });

  return menus;
}

export default new StoreModule();
