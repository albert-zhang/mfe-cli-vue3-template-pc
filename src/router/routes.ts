import Layout from '@/components/layout/Layout.vue';
import Error from '@/components/layout/Error.vue';
import NotFound from '@/components/layout/NotFound.vue';

const constantRoutes = [
  {
    path: '/',
    name: '首页',
    component: Layout,
    icon: 'icon-home-fill',
    children: [{
      path: '',
      name: '',
      meta: { text: '首页' },
      component: () => import('@/views/Home.vue'),
    }],
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
    component: NotFound,
  },
  {
    path: '*',
    hidden: true,
    redirect: '/404',
  },
];

export default constantRoutes;

const asyncRoutes = [
  {
    path: '/example',
    name: '示例',
    icon: 'icon-hourglass-fill',
    component: Layout,
    children: [
      {
        path: 'example',
        name: '示例',
        meta: {
          text: '示例',
        },
        component: () => import('@/views/Example.vue'),
      },
    ],
  },
];

export {
  asyncRoutes,
  constantRoutes,
};
