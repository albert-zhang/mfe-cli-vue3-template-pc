import Vue from 'vue';

function findDropdownPopover(vm: Vue) {
  try {
    const ariaControls = vm.$el.children[0].getAttribute('aria-controls')!;
    if (!ariaControls) {
      throw new Error('ariaControls is empty');
    }
    const popoverEl = document.getElementById(ariaControls)!;
    if (!popoverEl) {
      throw new Error('popoverEl is empty');
    }
    return popoverEl;
  } catch (ex) {
    console.error('element-ui.ts/findPopover failed: ' + ex);
    return null;
  }
}

export default {
  findDropdownPopover,
};
