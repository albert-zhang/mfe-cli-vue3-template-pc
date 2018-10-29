/*
* Simple plugin adding $permission method to Vue.
* example: v-permission="'RESERVATION_VIEW'"
*/
import { PermissionUtil } from '../util';
import { VNode, VNodeDirective } from 'vue';

export default {
  async bind(el: HTMLElement, binding: VNodeDirective, vnode: VNode) {
    let permissionArray: string[] = [];
    if ((typeof binding.value) === 'string') {
      permissionArray = (binding.value as string).split(/\s*,\s*/g);
    } else if (Array.isArray(binding.value)) {
      permissionArray = binding.value;
    }
    const r = await PermissionUtil.isPermissionsAuthorized(permissionArray);
    if (!r) {
      el.style.display = 'none';
    }
  },
};
