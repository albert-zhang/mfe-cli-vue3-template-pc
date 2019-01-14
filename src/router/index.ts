import Vue from 'vue';
import VueRouter, { Route, RouteConfig } from 'vue-router';
import store from '../store';
import { constantRoutes } from './routes';
import { PermissionUtil } from '../util';

Vue.use(VueRouter);

constantRoutes.forEach((r: RouteConfig) => {
  if (r.path === '/app') {
    if (r.children && r.children.length > 0) {
      r.children.forEach((child: RouteConfig) => {
        store.dispatch('apps/registerRoutes', child);
      });
    }
  }
});

const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes: constantRoutes,
});

router.beforeEach(async (to: Route, from: Route, next: any) => {
  if (to.matched.length === 0) {
    next();
    return;
  }

  if (isPathAnAppRoot(to)) {
    // 是子系统顶层
    const appName = to.matched[1].path;
    await store.dispatch('apps/generateMenus', { appName });
    const menusOfThisApp: SideMenuItem[] = (store.state as any).apps.menus[appName];
    const r = findFirstHasPermissionMenuItem(menusOfThisApp);
    if (r) {
      next(r.path);
    } else {
      next({ name: 'error' });
    }
    return;
  }

  const isPermissionOK = await PermissionUtil.isRouteAuthorized(to);
  if (isPermissionOK) {
    next();
  } else {
    next({ name: 'error' });
  }
});

router.afterEach(async (to: Route, from: Route) => {
  if (to.fullPath === from.fullPath) {
    return;
  }

  const lastAppName = getAppNameFromPath(from.path);
  const currentAppName = getAppNameFromPath(to.path);

  if (from.name && currentAppName === lastAppName) {
    // at the 1st time, from.name is null, but we still need to create the menu, so don't return.
    // afterwards the from.name will always be non-null.
    // 每个子系统的菜单只更新一次，后续同样子系统的菜单变化不再更新:
    return;
  }

  store.dispatch('apps/switchApp', { appName: currentAppName });
});


function getAppNameFromPath(path: string) {
  const cmps = path.split('/');
  if (cmps.length < 3) {
    return null;
  }
  return cmps[2];
}

/**
 * 深度优先搜索第一个菜单
 */
function findFirstHasPermissionMenuItem(menus: SideMenuItem[]): SideMenuItem | null {
  if (!menus) {
    return null;
  }
  for (const menu of menus) {
    if (menu.children && menu.children!.length > 0) {
      return findFirstHasPermissionMenuItem(menu.children);
    } else {
      return menu;
    }
  }
  return null;
}

/**
 * 此路径是否是一个app的根路径
 */
function isPathAnAppRoot(r: Route) {
  return r.matched.length === 2 && r.fullPath.indexOf('/app/') === 0;
}


export default router;
