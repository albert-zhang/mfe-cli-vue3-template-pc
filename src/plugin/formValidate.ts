import Vue from 'vue';
import { MxjResponseError } from '@mydreamplus/aglarond/lib/http';
import { FormUtil } from '../util';

export default {
  install(vue: (typeof Vue), options: any) {
    vue.prototype.$displayFormValidationError = (error: MxjResponseError, ...forms: any[]) => {
      FormUtil.displayFormValidationError(error, ...forms);
    };
  },
};
