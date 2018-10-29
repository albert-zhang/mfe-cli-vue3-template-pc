// import { RouteConfig, Route, RouteRecord } from 'vue-router';

declare type PermissionKey = string;

// declare type RouteObjectWithMeta = RouteConfig | RouteRecord | Route;

declare interface RouteObjectWithMeta {
  meta?: any;
}

declare interface AppInfo {
  name: string;
  text: string;
  path: string;
  icon: string;
  sort: number;
}

declare interface SideMenuItem {
  path: string;
  icon: string;
  name: string;
  text: string;
  hidden: boolean;
  children?: SideMenuItem[];
}
