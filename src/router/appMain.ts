import { FullChildContainer } from '../components';
import Home from '../views/Home.vue';

export default {
  path: 'main',
  name: 'main',
  icon: 'mxj-icon-home',
  meta: {
    text: 'Main',
    sort: 0,
  },
  component: FullChildContainer,
  children: [
    {
      path: '',
      name: 'home',
      icon: 'mxj-icon-home',
      meta: {
        text: 'Home',
      },
      component: Home,
    },
  ],
};
