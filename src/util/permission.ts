import { RouteConfig, Route, RouteRecord } from 'vue-router';
import store from '../store';

function isRouteHasPermissionConfig(route: RouteObjectWithMeta) {
  if (!route.meta || !route.meta.role) {
    return false;
  }
  if (!Array.isArray(route.meta.role)) {
    console.error('role is not an Array');
    return false;
  }
  return true;
}

async function isPermissionsAuthorized(permissionArray: PermissionKey[]) {
  const userPermissions = await getUserPermissions();
  return isPermissionsAuthorizedSync(permissionArray, userPermissions);
}

function isPermissionsAuthorizedSync(permissionArray: PermissionKey[], userPermissions: PermissionKey[]) {
  const thereIsUnauthorizedPermission = permissionArray.some((rp: PermissionKey) => {
    if (!rp) {
      return false;
    }
    return userPermissions.indexOf(rp) === -1;
  });
  return !thereIsUnauthorizedPermission;
}

function isRouteAuthorizedSync(route: RouteObjectWithMeta, userPermissions: PermissionKey[]) {
  if (!isRouteHasPermissionConfig(route)) {
    // route上没有权限配置，认为始终有授权
    return true;
  }
  const routePermissionArray = route.meta.role as PermissionKey[];
  return isPermissionsAuthorizedSync(routePermissionArray, userPermissions);
}

async function isRouteAuthorized(route: RouteObjectWithMeta) {
  if (!isRouteHasPermissionConfig(route)) {
    // route上没有权限配置，认为始终有授权
    return true;
  }
  const userPermissions = await getUserPermissions();
  return isRouteAuthorizedSync(route, userPermissions);
}

async function getUserPermissions() {
  await store.dispatch('auth/getCurrentStaffInfo');
  const userPermissions = store.getters['auth/permissions'] as PermissionKey[];
  return userPermissions;
}

export {
  isPermissionsAuthorizedSync,
  isPermissionsAuthorized,
  isRouteAuthorizedSync,
  isRouteAuthorized,
  getUserPermissions,
};
