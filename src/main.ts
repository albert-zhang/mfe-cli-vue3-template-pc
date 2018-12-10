import Vue from 'vue';
import App from './App.vue';
import router from '@/router';
import store from '@/store';
import { sync } from 'vuex-router-sync';
import './element-variables.scss';
import './assets/css/index.scss';

import './directive';
import './filter';
import './plugin';

import {
  Button,
  Container,
  Header,
  Aside,
  Main,
  Row,
  Col,
  Checkbox,
  RadioButton,
  RadioGroup,
  Radio,
  Table,
  TableColumn,
  Loading,
  Pagination,
  Form,
  FormItem,
  Input,
  Select,
  Option,
  OptionGroup,
  Message,
  MessageBox,
} from 'element-ui';

Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Button);
Vue.use(Row);
Vue.use(Col);
Vue.use(Checkbox);
Vue.use(RadioButton);
Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Loading);
Vue.use(Pagination);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(OptionGroup);

Vue.prototype.$message = Message;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;

Vue.config.productionTip = false;

sync(store, router);

const inst = new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
