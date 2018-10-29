<template>
  <el-dropdown ref="theDropdown" class="account-button" trigger="click"
    @command="onMenuSelect($event)" @visible-change="onVisibleChange">
    <span class="el-dropdown-link">
      <!-- <img src="@/assets/logo.png" style="width: 30px; height: 30px;"/> -->
      <i class="mxj-icon mxj-icon-UserPicture account-button__avatar"></i>
      &nbsp;&nbsp;
      <span class="account-button__text">{{userInfo.name}}</span>
      <i class="el-icon-arrow-down el-icon--right account-button__dropdown-arrow"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="item in menuItems" :key="item.key" :command="item.key">{{item.label}}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script lang="ts">
import { State } from 'vuex-class';
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Dropdown, DropdownMenu, DropdownItem } from 'element-ui';
import { ElementUIUtil } from '../../util';
import LoginUtil from '../../util/login';

@Component({
  components: {
    [Dropdown.name]: Dropdown,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
  },
})
export default class AccountButton extends Vue {
  @State((state: any) => state.auth.info || {}) private userInfo: any;

  private menuItems: any[] = [
    {label: '退出登录', key: 'logout'},
  ];

  private onMenuSelect(str: string) {
    if (str === 'logout') {
      LoginUtil.logout();
    }
  }

  private onVisibleChange(b: boolean) {
    if (!b) {
      return;
    }
    this.$nextTick(() => {
      const el = ElementUIUtil.findDropdownPopover(this.$refs.theDropdown as Vue);
      if (el) {
        el!.classList.add('mxj-el-dropdown-popover-black');
      }
    });
  }
}
</script>

<style lang="scss">
@import "../../assets/css/response/mixin";

.account-button {
}

.account-button__avatar {
  color: #fff;
  font-size: 25px !important;
}

.account-button__text {
  display: none;
}
.account-button__dropdown-arrow {
  display: none !important;
  color: #fff !important;
}

@include media-width-pc {
  .account-button__text {
    display: inline;
    color: #fff !important;
  }
  .account-button__dropdown-arrow {
    display: inline-block !important;
  }
}

.account-button {
  > .el-dropdown-link {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
  }
}
</style>
