<template>
  <div class="TopMenu">
    <div class="TopMenuLog">
      <i class="mxj-icon mxj-icon-logo_full"></i>
      <i class="mxj-icon mxj-icon-logo"></i>
    </div>
    <div class="TopMenuOpenAsideButtonContainer">
      <button class="TopMenuOpenAsideButton" @click="onOpenAside()">
        <i class="mxj-icon mxj-icon-menu_right"></i>
      </button>
    </div>
    <div class="TopMenuTabs">
      <el-tabs v-model="activeName" @tab-click="onTabSelected">
        <el-tab-pane v-for="item in menuItems" :key="item" :label="item" :name="item">{{item}}</el-tab-pane>
      </el-tabs>
    </div>
    <div class="TopMenuDropdown">
      <el-dropdown ref="topMenuDropdown" trigger="click"
        @command="onDropdownSelect" @visible-change="onTopMenuDropdownVisibleChange">
        <span class="el-dropdown-link TopMenuDropdownLink">
          工作中心<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in menuItems" :key="item" :command="item">{{item}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div style="flex: 1;">&nbsp;</div>
    <slot name="right">
    </slot>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Tabs, TabPane, Dropdown, DropdownMenu, DropdownItem } from 'element-ui';
import { ElementUIUtil } from '@/util';

@Component({
  components: {
    [Tabs.name]: Tabs,
    [TabPane.name]: TabPane,
    [Dropdown.name]: Dropdown,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
  },

})
export default class TopMenu extends Vue {
  private menuItems: string[] = [
    '工作中心',
    '场地管理',
    '商品管理',
    '订单管理',
    '财务管理',
    '用户管理',
    '数据报表',
    '系统设置',
  ];

  private activeName: string = this.menuItems[0];

  private onTabSelected(tab: any, event: any) {
    this.handleChange(tab.name);
  }

  private onDropdownSelect(str: string) {
    this.handleChange(str);
  }

  private handleChange(menu: string) {
    // TODO: here
  }

  private onOpenAside() {
    this.$emit('open-aside');
  }

  private onTopMenuDropdownVisibleChange(b: boolean) {
    if (!b) {
      return;
    }
    this.$nextTick(() => {
      const el = ElementUIUtil.findDropdownPopover(this.$refs.topMenuDropdown as Vue);
      if (el) {
        el!.classList.add('BlackDropdownPopover');
      }
    });
  }
}
</script>

<style lang="scss">
@import "@/assets/vars.scss";

.TopMenu {
  height: 60px;
  position: relative;

  > * {
    flex-shrink: 0;
  }
}

.TopMenuLog {
  display: flex;
  align-items: center;
  justify-content: center;
}

.TopMenuLog > i {
  color: #fff;
  font-size: 30px;
}
.TopMenuLog > .mxj-icon-logo {
  display: block;
}
.TopMenuLog > .mxj-icon-logo_full {
  display: none;
}
@include media-breakpoint-up {
  .TopMenuLog > .mxj-icon-logo {
    display: none;
  }
  .TopMenuLog > .mxj-icon-logo_full {
    display: block;
  }
}

.TopMenuOpenAsideButtonContainer {

}
.TopMenuOpenAsideButton {
  border: none;
  padding: 0;
  background: transparent;
  width: 40px;
  height: 40px;
  display: block;
  color: #fff;
}
.TopMenuOpenAsideButton > i {
  font-size: 16px;
}
@include media-breakpoint-up {
  .TopMenuOpenAsideButtonContainer {
    display: none;
  }
}

.TopMenuTabs {
  display: none;
  line-height: 60px;
  > .el-tabs {
    height: 60px;
  }
}

.TopMenuDropdown {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  position: absolute;
  height: 60px;
  left: calc(50% + 5px);
  top: 0;
  transform: translateX(-50%);
  z-index: 1;
}
@include media-breakpoint-up {
  .TopMenuTabs {
    display: block;
    margin: 0 20px;
  }
  .TopMenuDropdown {
    display: none;
  }
}

.TopMenuDropdownLink {
  color: #fff !important;
  font-size: 1.3em !important;
}

.TopMenu {
  display: flex;
  flex-flow: row;
  align-items: center;

  .el-tabs__active-bar {
    height: 6px !important;
  }

  .el-tabs__content {
    display: none;
  }
  .el-tabs__header {
    margin-bottom: 0;
  }

  .el-tabs__nav {
    background-color: #000 !important;
    .el-tabs__active-bar {
      background-color: #fff !important;
    }
    .el-tabs__item {
      color: #bbb;
    }
    .el-tabs__item.is-active {
      color: #fff;
    }
    .el-tabs__item:hover {
      color: #bbb;
    }
  }
}
</style>
