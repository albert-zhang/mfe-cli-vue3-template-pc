<template>
  <el-menu
    class="mxj-side"
    @open="handleOpen"
    @close="handleClose"
    :router="true"
    :default-active="defaultRouter"
    background-color="#545c64"
    text-color="#fff"
    ref="menu"
    active-text-color="#ffd04b"
  >
    <img src="@/assets/logo.png" class="el-menu-logo"/>
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
          <i class="iconfont" :class="item.icon"></i>
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
            <i class="iconfont" :class="item.icon"></i>
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
</template>

<script lang="ts">
import { Getter, State, namespace } from 'vuex-class';
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Menu, Submenu, MenuItem, MenuItemGroup } from 'element-ui';
import { Route, RouteConfig } from 'vue-router';

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
  @State('route') private route!: any;
  @authModule.State('routes') private routes!: RouteConfig[];

  private created() {
    //
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

  private handleOpen() {
    //
  }

  private handleClose() {
    //
  }

}
</script>

<style lang="scss" scoped>
.mxj-side /deep/ {
  .el-submenu {
    overflow: hidden;
  }

  .el-menu-item-group__title {
    display: none;
  }

  .el-menu-logo {
    margin: 15px 0px 10px 12px;
  }
}
</style>

