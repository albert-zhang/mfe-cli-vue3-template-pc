import { constantRoutes, asyncRoutes } from '@/router/routes';
import { RouteConfig } from 'vue-router';
import router from '@/router';

interface StateType {
  routes: RouteConfig[];
}

const state: StateType = {
  routes: [],
};

const mutations = {
  init(st: StateType) {
    router.addRoutes(asyncRoutes);
    st.routes = constantRoutes.concat(asyncRoutes);
  },
};

const actions = {
  //
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
