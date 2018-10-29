<template>
  <el-container class="mxj-layout">
    <el-header class="mxj-layout__header" style="background-color: #000;">
      <TopMenu @open-aside="onOpenAside()">
        <div slot="right" class="mxj-layout__header__top-menu__right-area">
          <MessageCenterButton v-if="false"></MessageCenterButton>
          <AccountButton style="margin-left: 30px;"></AccountButton>
        </div>
      </TopMenu>
    </el-header>
    <el-container>
      <el-aside class="mxj-layout__container__aside" :style="sideMenuAsideStyle">
        <mxj-side :visible="isSideVisible" :collapsed="isSideCollapsed"
          @close="onCloseAside()"
          @collapse="isSideCollapsed = true"
          @expand="isSideCollapsed = false"/>
      </el-aside>
      <el-container>
        <el-header class="mxj-layout__container__breadcrumb-header">
          <mxj-breadcrumb />
        </el-header>
        <el-main>
          <router-view class="mxj-layout__container__view" />
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { Getter, Action, namespace } from 'vuex-class';
import { Vue, Component } from 'vue-property-decorator';
import { Badge, Dropdown, DropdownMenu, DropdownItem } from 'element-ui';
import { ResponsiveUtil, GlobalEvents } from '../../util';
import { eventBusOn } from '@mydreamplus/aglarond/lib/basic';
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
    'mxj-breadcrumb': () => import('../breadcrumb/index.vue'),
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

  private mounted() { // 滚动时面包屑效果
    const el: any = this.$el.querySelector('.el-main');
    if (el) {
      el.addEventListener('scroll', () => {
        if (el.scrollTop > 0) {
          el.style['box-shadow'] = '0 2px 5px #888';
        } else {
          el.style['box-shadow'] = 'none';
        }
      });
    }
  }

  private updateForScreenWith(isLageScreen: boolean) {
    this.isLageScreen = isLageScreen;
    this.isSideCollapsed = false;
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
@import '../../assets/css/response/mixin';

.mxj-layout {
  .el-aside {
    color: #333;
  }
  .el-main {
    display: flex;
    flex-direction: column;
    overflow: auto;
    color: #333;
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #409eff;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
}

.mxj-layout__container__view {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-shrink: 0;
}

.mxj-layout__container__aside {
  position: absolute;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  background: transparent;
  transition: width 0.3s;
}
@include media-width-pc {
  .mxj-layout__container__aside {
    position: relative;
  }
}

.mxj-layout__header {
  padding-left: 15px !important;
  padding-right: 15px !important;
}

@include media-width-pc {
  .mxj-layout__header {
    padding-left: 25px !important;
    padding-right: 25px !important;
  }
}

.mxj-layout__header__top-menu__right-area {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
}

.mxj-layout__container__breadcrumb-header {
  height: unset !important;
}
</style>
