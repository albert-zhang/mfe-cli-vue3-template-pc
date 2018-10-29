<template>
<div class="mxj-side" @click="onSideClick($event)" :style="sideStyle"
  :class="{'mxj-side--expanded': !collapsed}">
  <div class="mxj-side__work-area" :style="siteWorkAreaStyle">
    <div class="mxj-side__logo-container">
      <i class="mxj-icon mxj-icon-logo_full"></i>
    </div>
    <el-menu ref="menu"
      class="mxj-side__menu"
      @open="handleMenuOpen"
      @close="handleMenuClose"
      @select="handleMenuSelect"
      :router="true"
      :default-active="activeRouter"
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
            <i class="mxj-icon mxj-side__menu-icon" :class="item.icon"></i>
            <span slot="title" class="mxj-side__menu-title">{{ item.text || item.name }}</span>
          </el-menu-item>

          <!-- 多级导航 -->
          <el-submenu
            :index="item.path"
            :key="item.path"
            v-else
          >
            <!-- 第一级 title -->
            <template slot="title">
              <i class="mxj-icon mxj-side__menu-icon" :class="item.icon"></i>
              <span>{{ item.text || item.name }}</span>
            </template>

            <!-- 第二级菜单 -->
            <el-menu-item-group
              :key="sub.path"
              v-for="sub in item.children"
            >
              <el-menu-item
                :index="`${sub.path}`"
                :route="{path: `${sub.path}`}"
                v-if="!sub.hidden"
              >
                {{ sub.text || sub.name }}
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </template>
      </template>
    </el-menu>
  </div>
  <div class="mxj-side__collapse-container" v-show="isLargeScreen"
    :class="{'mxj-side__collapse-container-expanded': !collapsed, 'mxj-side__collapse-container-collapsed': collapsed}">
    <button class="mxj-side__collapse-button" @click.prevent="toggleCollapsed()">
      <img v-if="collapsed" src="~../../assets/svg/black_bg_arrow_right.svg"/>
      <img v-if="!collapsed" src="~../../assets/svg/black_bg_arrow_left.svg"/>>
    </button>
  </div>
</div>
</template>

<script lang="ts">
import { Getter, State, namespace } from 'vuex-class';
import { Vue, Component, Watch, Prop, Provide } from 'vue-property-decorator';
import { Menu, Submenu, MenuItem, MenuItemGroup } from 'element-ui';
import { Route, RouteConfig } from 'vue-router';
import { ResponsiveUtil, GlobalEvents } from '../../util';
import { eventBusOn } from '@mydreamplus/aglarond/lib/basic';

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

  private get sideStyle() {
    const toReturn: any = {};
    toReturn.backgroundColor = this.visible
      ? 'rgba(0, 0, 0, 0.6)'
      : 'transparent';
    if (this.collapsed) {
      toReturn.overflowX = 'hidden';
    }
    return toReturn;
  }

  private get siteWorkAreaStyle() {
    const toReturn: any = {};
    toReturn.transform = this.visible ? 'translateX(0)' : 'translateX(-100%)';
    return toReturn;
  }

  private get activeRouter() {
    const mi = this.searchPathInMenus(this.route.path, this.menusLocal);
    if (mi) {
      return mi.path;
    } else {
      return null;
    }
  }
  @Prop({ default: false }) private visible!: boolean;
  @Prop({ default: false }) private collapsed!: boolean;

  @State('route') private route!: any;
  @Getter('apps/currentMenus') private menus!: SideMenuItem[];

  /**
   * 直接使用menus在异步路由的情况下不行，
   * 可能是因为activeRouter没有正常返回值，需要如下workaround:
   */
  private menusLocal: SideMenuItem[] = [];

  private isLargeScreen: boolean = ResponsiveUtil.isLargeScreen;

  @Watch('menus')
  private watchMenus(newVal: any) {
    setTimeout(() => {
      this.menusLocal = newVal;
    });
  }

  private created() {
    eventBusOn(
      GlobalEvents.RESPONSIVE_MIN_WIDTH_CHANGED_EVENT,
      this.updateForScreenWith
    );
    this.menusLocal = this.menus;
  }

  /**
   * 查找与路由最匹配的菜单。
   * 比如有这样两个菜单：A: /a/b、B: /a/b/c，路由是/a/b/c/d，那么应该找到B菜单。
   * 这样的目的是，因为有的路由没有菜单，但是还是要高亮选中左侧的菜单，那么就应该选中与当前路由最匹配的。
   */
  private searchPathInMenus(pth: string, menus2search: SideMenuItem[]): SideMenuItem | null {
    const sortedMenus = ((menus2search || []).concat([])).sort((m1, m2) => {
      return m2.path.length - m1.path.length;
    });
    for (const mi of sortedMenus) {
      if (mi.children) {
        const inSub = this.searchPathInMenus(pth, mi.children);
        if (inSub) {
          return inSub;
        }
      }
      if (pth.indexOf(mi.path) === 0) {
        return mi;
      }
    }
    return null;
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
  }

  private onSideClick(evt: Event) {
    if (evt.currentTarget === evt.target) {
      this.$emit('close');
    }
  }

  private toggleCollapsed() {
    if (this.collapsed) {
      this.$emit('expand');
    } else {
      this.$emit('collapse');
    }
  }

  private handleMenuOpen() {}

  private handleMenuClose() {}

  private handleMenuSelect() {
    this.$emit('close');
  }
}
</script>

<style lang="scss">
@import "../../assets/css/response/mixin";

.mxj-side {
  position: relative;
  width: 100%;
  height: 100%;
  transition: background-color 0.3s;
}

.mxj-side__work-area {
  position: relative;
  width: 62%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  background-color: #f1f1f1;
  transition: transform 0.3s;
}
@include media-width-pc {
  .mxj-side__work-area {
    width: 100%;
  }
}

.mxj-side__menu {
  flex: 1;
}

.mxj-side__logo-container {
  padding: 0 20px;
  height: 60px;
  background-color: #000;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
}
@include media-width-pc {
  .mxj-side__logo-container {
    display: none;
  }
}

.mxj-side__logo-container > .mxj-icon-logo_full {
  color: #fff !important;
  font-size: 30px !important;
}

.mxj-side__collapse-container {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 40px;
  overflow: hidden;
}

.mxj-side__collapse-container-expanded {
  right: 0;
}
.mxj-side__collapse-container-collapsed {
  transition: right 0.3s;
  right: 100%;
  transform: translateX(100%) translateY(-50%);
}

.mxj-side__collapse-button {
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

.mxj-side__work-area {

  .el-submenu {
    overflow: hidden;
  }

  .el-menu-item-group__title {
    display: none;
  }

  .el-menu {
    border-right: none !important;
    > .el-menu-item {
      &.is-active {
        background-color: #fff !important;
        color: #000 !important;
        font-weight: bold;
      }
    }
    > .el-submenu {
      > .el-menu {
        > .el-menu-item-group {
          > ul {
            > .el-menu-item {
              margin-left: 0.4em;
              height: 40px !important;
              line-height: 40px !important;
            }
          }
        }
      }
      &.is-active {
        background-color: #fff;
        > .el-submenu__title {
          color: #000 !important;
          background-color: #fff !important;
          font-weight: bold;
        }
        > .el-menu {
          background-color: #fff !important;
          > .el-menu-item-group {
            > ul {
              > .el-menu-item {
                background-color: #fff !important;
                &.is-active {
                  font-weight: bold;
                }
              }
            }
          }
        }
      }
    }
  }
}

.mxj-side__menu-icon {
  margin-right: 10px;
}

.mxj-side--expanded {
  .el-submenu__title, .el-menu-item {
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .el-submenu > .el-submenu__title {
    padding-right: 30px !important;
  }
}
</style>z
