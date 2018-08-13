/**
 * 扩展 vue-router
 */
import VueRouter from 'vue-router';

declare module 'vue-router/types/router' {
  interface RouteConfig {
    icon?: string;
    hidden?: boolean;
  }
}
