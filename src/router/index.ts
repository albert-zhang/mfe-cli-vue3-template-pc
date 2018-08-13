import Vue from 'vue';
import VueRouter, {RouteConfig} from 'vue-router';
import {constantRoutes} from './routes';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes: constantRoutes,
});

function addRoutes(routes: RouteConfig[]) {
  router.addRoutes(routes);
}

export default router;
