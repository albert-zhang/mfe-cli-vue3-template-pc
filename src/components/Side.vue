<template>
<div class="Side" @click="onSideClick($event)" :style="sideStyle">
  <div class="SideWorkArea" :style="siteWorkAreaStyle">
    <div class="SideLogoContainer">
      <i class="mxj-icon mxj-icon-logo_full"></i>
    </div>
    <el-menu ref="menu"
      class="SideMenu"
      @open="handleMenuOpen"
      @close="handleMenuClose"
      @select="handleMenuSelect"
      :router="true"
      :default-active="defaultRouter"
      :collapse="collapsed"
      background-color="#F1F1F1"
      text-color="#999999"
      active-text-color="#1D2024"
    >
      <template v-for="item in menus">
        <!-- 菜单 hidden 属性不为 true 才显示 -->
        <template v-if="!item.hidden">
          <!-- 一级导航 -->
          <el-menu-item
            :key="item.path"
            :index="item.path"
            :route="{path: item.path}"
            v-if="isRootRoute(item)"
          >
            <i class="mxj-icon" :class="item.icon"></i>
            <span>{{ item.name }}</span>
          </el-menu-item>

          <!-- 多级导航 -->
          <el-submenu
            :index="item.path"
            :key="item.path"
            v-else
            :name="item.name"
          >
            <!-- 第一级 title -->
            <template slot="title">
              <i class="mxj-icon" :class="item.icon"></i>
              <span>{{ item.name }}</span>
            </template>

            <!-- 第二级菜单 -->
            <el-menu-item-group
              :key="sub.path"
              v-for="sub in item.children"
            >
              <el-menu-item
                :index="`${item.path}/${sub.path}`"
                :route="{path: `${item.path}/${sub.path}`}"
                v-if="!sub.hidden"
              >
                {{ sub.name }}
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </template>
      </template>
    </el-menu>
  </div>
  <div class="SideCollapseButtonContainer" v-show="isLargeScreen"
    :class="{'SideCollapseButtonContainer-expanded': !collapsed, 'SideCollapseButtonContainer-collapsed': collapsed}">
    <button class="SideCollapseButton" @click.prevent="toggleCollapsed()">
      <img v-if="collapsed" src="~@/assets/svg/black_bg_arrow_right.svg"/>
      <img v-if="!collapsed" src="~@/assets/svg/black_bg_arrow_left.svg"/>>
    </button>
  </div>
</div>
</template>

<script lang="ts">

interface SideMenu {
  path: string;
  icon: string;
  name: string;
  text: string;
  hidden: boolean;
  children?: SideMenu[];
}

import { Getter, State, namespace } from 'vuex-class';
import { Vue, Component, Watch, Prop, Provide } from 'vue-property-decorator';
import { Menu, Submenu, MenuItem, MenuItemGroup } from 'element-ui';
import { Route, RouteConfig } from 'vue-router';
import {ResponsiveUtil, GlobalEvents} from '@/util';
import {eventBusOn} from '@mydreamplus/aglarond/lib/basic';

const authModule = namespace('auth');

@Component({
  components: {
    [Menu.name]: Menu,
    [Submenu.name]: Submenu,
    [MenuItem.name]: MenuItem,
    [MenuItemGroup.name]: MenuItemGroup,
  },
})
export default class Side extends Vue {
  @Prop({default: false}) private visible!: boolean;

  @State('route') private route!: any;
  @authModule.State('routes') private routes!: RouteConfig[];

  private collapsed = false;
  private isLargeScreen: boolean = ResponsiveUtil.isLargeScreen;

  @Watch('collapsed')
  private onCollapsedChanged(newVal: boolean, oldVal: boolean) {
    if (newVal) {
      this.$emit('collapse');
    } else {
      this.$emit('expand');
    }
  }

  private get sideStyle() {
    const toReturn: any = {};
    toReturn.backgroundColor = this.visible ? 'rgba(0, 0, 0, 0.6)' : 'transparent';
    return toReturn;
  }

  private get siteWorkAreaStyle() {
    const toReturn: any = {};
    toReturn.transform = this.visible ? 'translateX(0)' : 'translateX(-100%)';
    return toReturn;
  }

  private created() {
    eventBusOn(GlobalEvents.RESPONSIVE_MIN_WIDTH_CHANGED_EVENT, this.updateForScreenWith);
  }

  private get defaultRouter() {
    return this.route.path;
  }

  private get menus() {
    return this.generateMenusFromRoutes(this.routes);
  }

  private generateMenusFromRoutes(routes: RouteConfig[]) {
    const menus: SideMenu[] = [];
    routes.forEach((route) => {
      const menu: any = {
        path: route.path,
        icon: route.icon,
        ...(route.name && { name: route.name }),
        ...(route.meta && { text: route.meta.text }),
        ...(route.hidden && { hidden: route.hidden }),
      };
      if (route.children) {
        menu.children = this.generateMenusFromRoutes(route.children);
      }
      menus.push(menu);
    });
    return menus;
  }

  /**
   * 判断路由是否是 root 节点
   * @param item 路由项
   */
  private isRootRoute(item: any): boolean {
    const { children } = item;

    // 1. 没有子菜单
    if (!children) {
      return true;
    }

    // 2. 子菜单数量为 1 && path === ''
    if (children && children.length === 1 && children[0].path === '') {
      return true;
    }

    return false;
  }

  private updateForScreenWith(isLargeScreen: boolean) {
    this.isLargeScreen = isLargeScreen;
    if (isLargeScreen) {
      this.collapsed = false;
    } else {
      this.collapsed = isLargeScreen;
    }
  }

  private onSideClick(evt: Event) {
    if (evt.currentTarget === evt.target) {
      this.$emit('close');
    }
  }

  private toggleCollapsed() {
    this.collapsed = !this.collapsed;
  }

  private handleMenuOpen() {
  }

  private handleMenuClose() {
  }

  private handleMenuSelect() {
    this.$emit('close');
  }

}
</script>

<style lang="scss">
@import "@/assets/vars.scss";

.Side {
  position: relative;
  width: 100%;
  height: 100%;
  transition: background-color 0.3s;
}

.SideWorkArea {
  position: relative;
  width: 62%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  background-color: #F1F1F1;
  transition: transform 0.3s;
}
@include media-breakpoint-up {
  .SideWorkArea {
    width: 100%;
  }
}

.SideMenu {
  flex: 1;
}

.SideLogoContainer {
  padding: 0 20px;
  height: 60px;
  background-color: #000;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
}
@include media-breakpoint-up {
  .SideLogoContainer {
    display: none;
  }
}

.SideLogoContainer > .mxj-icon-logo_full {
  color: #fff !important;
  font-size: 30px !important;
}

.SideCollapseButtonContainer {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 40px;
  overflow: hidden;
}

.SideCollapseButtonContainer-expanded {
  right: 0;
}
.SideCollapseButtonContainer-collapsed {
  transition: right 0.3s;
  right: 100%;
  transform: translateX(100%) translateY(-50%);
}

.SideCollapseButton {
  border: none;
  display: block;
  background: transparent;
  outline: none;
  padding: 0;
  margin: 0;
  &:active {
    opacity: 0.5;
  }
  > img {
    width: 100%;
    height: 100%;
  }
}

.SideWorkArea {
  .el-menu {
    border-right: none !important;
  }

 .el-menu-item.is-active {
    background-color: #fff !important;
  }

  .el-submenu.is-active {
    .el-submenu__title {
      background-color: #fff !important;
    }
  }

  .el-submenu {
    overflow: hidden;
  }

  .el-menu-item-group__title {
    display: none;
  }
}

</style>

