import { Layout, Error, NotFound } from '../components';

import appMain from './appMain';

const constantRoutes = [
  {
    path: '',
    redirect: '/app/main',
  },
  {
    path: '/app', // 不能变，因为在index.ts中有使用
    component: Layout,
    children: [
      appMain,
      // TODO: 添加其它app
    ],
  },
  {
    path: '/error',
    hidden: true,
    name: 'error',
    component: Error,
  },
  {
    path: '/404',
    hidden: true,
    name: '404',
    component: NotFound,
  },
  {
    path: '*',
    hidden: true,
    redirect: '/404',
  },
];

export default constantRoutes;

const asyncRoutes: any = [];

export {
  asyncRoutes,
  constantRoutes,
};
