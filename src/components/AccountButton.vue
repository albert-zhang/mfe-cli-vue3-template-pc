<template>
  <el-dropdown ref="theDropdown" class="AccountButton" trigger="click"
    @command="onMenuSelect($event)" @visible-change="onVisibleChange">
    <span class="el-dropdown-link">
      <!-- <img src="@/assets/logo.png" style="width: 30px; height: 30px;"/> -->
      <i class="mxj-icon mxj-icon-UserPicture AccountButtonAvatar"></i>
      &nbsp;&nbsp;
      <span class="AccountButtonText">森海赛尔</span>
      <i class="el-icon-arrow-down el-icon--right AccountButtonDropdownArrow"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="item in menuItems" :key="item.key" :command="item.key">{{item.label}}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Dropdown, DropdownMenu, DropdownItem } from 'element-ui';
import { ElementUIUtil } from '@/util';

@Component({
  components: {
    [Dropdown.name]: Dropdown,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
  },
})
export default class AccountButton extends Vue {
  private menuItems: any[] = [
    {label: '退出登录', key: 'logout'},
  ];

  private onMenuSelect(str: string) {
    if (str === 'logout') {
      // TODO: logout
    }
  }

  private onVisibleChange(b: boolean) {
    if (!b) {
      return;
    }
    this.$nextTick(() => {
      const el = ElementUIUtil.findDropdownPopover(this.$refs.theDropdown as Vue);
      if (el) {
        el!.classList.add('BlackDropdownPopover');
      }
    });
  }
}
</script>

<style lang="scss">
@import "@/assets/vars.scss";

.AccountButton {
}

.AccountButtonAvatar {
  color: #fff;
  font-size: 25px !important;
}

.AccountButtonText {
  display: none;
}
.AccountButtonDropdownArrow {
  display: none !important;
}

@include media-breakpoint-up {
  .AccountButtonText {
    display: inline;
    color: #fff !important;
  }
  .AccountButtonDropdownArrow {
    display: block;
  }
}

.AccountButton {
  > .el-dropdown-link {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
  }
}
</style>
