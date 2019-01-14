<template>
  <div class="top-menu">
    <div class="top-menu__logo">
      <i class="mxj-icon mxj-icon-logo_full"></i>
      <i class="mxj-icon mxj-icon-logo"></i>
    </div>
    <div class="top-menu__open-aside-container">
      <button class="top-menu__open-aside-container__btn" @click="onOpenAside()">
        <i class="mxj-icon mxj-icon-menu_right"></i>
      </button>
    </div>
    <div class="top-menu__tabs-container">
      <el-tabs v-model="tabActiveName" @tab-click="onTabSelected">
        <el-tab-pane v-for="item in menuItems" :key="item.name"
          :label="item.text" :name="item.name">{{item.text}}</el-tab-pane>
      </el-tabs>
    </div>
    <div class="top-menu__dropdown-container">
      <el-dropdown ref="topMenuDropdown" trigger="click"
        @command="onDropdownSelect" @visible-change="onTopMenuDropdownVisibleChange">
        <span class="el-dropdown-link top-menu__dropdown-container__link">
          {{currentAppText}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in menuItems" :key="item.name"
            :command="item.name">{{item.text}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div style="flex: 1;">&nbsp;</div>
    <slot name="right">
    </slot>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Tabs, TabPane, Dropdown, DropdownMenu, DropdownItem } from 'element-ui';
import { Getter, namespace } from 'vuex-class';
import { ElementUIUtil } from '../../util';

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
  @Getter('apps/topMenus') private menuItems: AppInfo[];
  @Getter('apps/currentAppName') private currentAppName: string;

  private tabActiveName: string = '';

  private currentAppText: string = '';

  @Watch('menuItems')
  private watchMenuItems() {
    this.updateTabSelection();
  }

  @Watch('currentAppName')
  private watchRoute() {
    this.updateTabSelection();
  }

  private created() {
    this.updateTabSelection();
  }

  private updateTabSelection() {
    const foundApp = this.menuItems.find((app: any) => {
      return app.name === this.currentAppName;
    });
    if (foundApp) {
      this.tabActiveName = foundApp!.name;
      this.currentAppText = foundApp!.text;
    }
  }

  private switchApp(appName: string) {
    const foundApp = this.menuItems.find((app: any) => {
      return app.name === appName;
    });
    if (foundApp) {
      this.currentAppText = foundApp.text;
      this.$router.replace({ path: foundApp.path });
    }
  }

  private onTabSelected(tab: any, event: any) {
    this.switchApp(tab.name);
  }

  private onDropdownSelect(str: string) {
    this.switchApp(str);
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
        el!.classList.add('mxj-el-dropdown-popover-black');
      }
    });
  }
}
</script>

<style lang="scss">
@import "../../assets/css/response/mixin";

.top-menu {
  height: 60px;
  position: relative;

  > * {
    flex-shrink: 0;
  }
}

.top-menu__logo {
  display: flex;
  align-items: center;
  justify-content: center;
}

.top-menu__logo > i {
  color: #fff;
  font-size: 30px;
}
.top-menu__logo > .mxj-icon-logo {
  display: block;
}
.top-menu__logo > .mxj-icon-logo_full {
  display: none;
}
@include media-width-pc {
  .top-menu__logo > .mxj-icon-logo {
    display: none;
  }
  .top-menu__logo > .mxj-icon-logo_full {
    display: block;
  }
}

.top-menu__open-aside-container {
  margin-left: 10px;
}
.top-menu__open-aside-container__btn {
  border: none;
  padding: 0;
  background: transparent;
  width: 40px;
  height: 40px;
  display: block;
  color: #fff;
}
.top-menu__open-aside-container__btn > i {
  font-size: 16px;
}
@include media-width-pc {
  .top-menu__open-aside-container {
    display: none;
  }
}

.top-menu__tabs-container {
  display: none;
  line-height: 60px;
  > .el-tabs {
    height: 60px;
  }
}

.top-menu__dropdown-container {
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
@include media-width-pc {
  .top-menu__tabs-container {
    display: block;
    margin: 0 60px;
  }
  .top-menu__dropdown-container {
    display: none;
  }
}

.top-menu__dropdown-container__link {
  color: #fff !important;
  font-size: 1.3em !important;
}

.top-menu {
  display: flex;
  flex-flow: row;
  align-items: center;

  .el-tabs__active-bar {
    height: 4px !important;
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
