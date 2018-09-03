<template>
  <el-container class="Layout">
    <el-header class="TopMenuHeader" style="background-color: #000;">
      <TopMenu @open-aside="onOpenAside()">
        <div slot="right" class="TopMenuRightArea">
          <MessageCenterButton></MessageCenterButton>
          <AccountButton style="margin-left: 30px;"></AccountButton>
        </div>
      </TopMenu>
    </el-header>
    <el-container>
      <el-aside class="SideMenuAside" :style="sideMenuAsideStyle">
        <mxj-side :visible="isSideVisible"
          @close="onCloseAside()"
          @collapse="isSideCollapsed = true"
          @expand="isSideCollapsed = false"/>
      </el-aside>
      <el-container>
        <el-header class="BreadcrumbHeader">
          <mxj-breadcrumb />
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { Getter, Action, namespace } from 'vuex-class';
import { Vue, Component } from 'vue-property-decorator';
import { Badge, Dropdown, DropdownMenu, DropdownItem } from 'element-ui';
import {ResponsiveUtil, GlobalEvents} from '@/util';
import {eventBusOn} from '@mydreamplus/aglarond/lib/basic';
import TopMenu from './TopMenu.vue';
import AccountButton from './AccountButton.vue';
import MessageCenterButton from './MessageCenterButton.vue';

const action = namespace('auth', Action);
const getter = namespace('auth', Getter);

@Component({
  components: {
    [Badge.name]: Badge,
    [Dropdown.name]: Dropdown,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
    'mxj-side': () => import('./Side.vue'),
    'mxj-breadcrumb': () => import('./Breadcrumb.vue'),
    TopMenu,
    AccountButton,
    MessageCenterButton,
  },
})
export default class Layout extends Vue {
  private isAsideVisible = ResponsiveUtil.isLargeScreen;
  private isSideVisible = this.isAsideVisible;
  private isSideCollapsed = false;
  private isLageScreen = ResponsiveUtil.isLargeScreen;

  private get sideMenuAsideStyle() {
    const toReturn: any = {};
    if (this.isLageScreen) {
      if (this.isSideCollapsed) {
        toReturn.width = '64px';
      } else {
        toReturn.width = '200px';
      }
    } else {
      toReturn.width = '100%';
    }
    if (this.isAsideVisible) {
      toReturn.display = 'block';
    } else {
      toReturn.display = 'none';
    }
    return toReturn;
  }

  private created() {
    eventBusOn(GlobalEvents.RESPONSIVE_MIN_WIDTH_CHANGED_EVENT, this.updateForScreenWith);
  }

  private updateForScreenWith(isLageScreen: boolean) {
    this.isLageScreen = isLageScreen;
    if (isLageScreen) {
      this.setAsideVisible(true, false);
    } else {
      this.setAsideVisible(false, false);
    }
  }

  private onOpenAside() {
    this.setAsideVisible(true);
  }

  private onCloseAside() {
    if (!ResponsiveUtil.isLargeScreen) {
      this.setAsideVisible(false);
    }
  }

  private setAsideVisible(b: boolean, animated = true) {
    if (b) {
      this.isAsideVisible = true;
      setTimeout(() => {
        this.isSideVisible = true;
      });
    } else {
      this.isSideVisible = false;
      setTimeout(() => {
        // wait for animation
        this.isAsideVisible = false;
      }, animated ? 300 : 0);
    }
  }
}
</script>
<style lang="scss">
@import "@/assets/vars.scss";

.Layout {
  .el-aside {
    color: #333;
  }
  .el-main {
    color: #333;
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
}

.SideMenuAside {
  position: absolute;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  background: transparent;
  transition: width 0.3s;
}
@include media-breakpoint-up {
  .SideMenuAside {
    position: relative;
  }
}

.TopMenuHeader {
  padding-left: 10px !important;
  padding-right: 10px !important;
}

@include media-breakpoint-up {
  .TopMenuHeader {
  }
}

.TopMenuRightArea {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
}

.BreadcrumbHeader {
  height: unset !important;
}
</style>
