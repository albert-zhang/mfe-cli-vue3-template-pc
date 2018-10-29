<template>
  <el-breadcrumb class="mxj-breadcrumb" separator-class="el-icon-arrow-right">
    <template v-for="(item) in level">
      <el-breadcrumb-item
        v-if="!item.breadcrumbHidden"
        :key="item.path"
        :to="item.pageLast || item.disableClick ? null : { path: item.path }"
        :class="item.pageRoot ? 'mxj-breadcrumb-page-root' : ''">
        {{ item.text || item.name }}
      </el-breadcrumb-item>
    </template>
  </el-breadcrumb>
</template>

<script lang="ts">
import { Getter, State, namespace } from 'vuex-class';
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Breadcrumb, BreadcrumbItem } from 'element-ui';
import { RouteRecord } from 'vue-router';

interface RouteRecord2 {
  name: string | undefined;
  text: string | undefined;
  breadcrumbHidden: boolean | undefined;
  path: string;
  pageRoot: boolean;
  pageLast: boolean;
  disableClick: boolean;
}

@Component({
  components: {
    [Breadcrumb.name]: Breadcrumb,
    [BreadcrumbItem.name]: BreadcrumbItem,
  },
})
export default class MxjBreadcrumb extends Vue {
  @Getter('apps/currentMenus') private menus!: SideMenuItem[];
  @State('route') private route!: any;

  private level: RouteRecord2[] = [];

  @Watch('route')
  private watchRoute() {
    this.getBreadcrumb();
  }

  @Watch('menus')
  private watchMenus() {
    this.getBreadcrumb();
  }

  private created() {
    this.getBreadcrumb();
  }

  private getBreadcrumb(): void {
    const routes: RouteRecord2[] = this.$route.matched.map((item: RouteRecord) => ({
      name: item.name,
      text: item.meta && ((item.meta.customText && item.meta.customText()) || item.meta.text),
      breadcrumbHidden: item.meta && item.meta.breadcrumbHidden,
      path: item.path,
      pageRoot: false,
      pageLast: false,
      disableClick: item.meta && item.meta.disableClick ? item.meta.disableClick : false,
    }));

    const matched = routes.filter((item: RouteRecord2, index: number) => {
      if (index === 0) {
        item.pageRoot = true;
      }
      if (index === routes.length - 1) {
        item.pageLast = true;
      }
      if (index < routes.length - 1) {
        const cp = routes[index].path;
        const np = routes[index + 1].path;
        if (np === cp || np === cp + '/') {
          // 子路由的path是一个空的
          item.disableClick = true;
        }
      }
      return !!item.name;
    });

    this.level = matched;
  }
}
</script>

<style lang="scss">
.mxj-breadcrumb {
  line-height: 50px !important;
  &-page-root {
    &:before {
      font-family: 'mxj-icon' !important;
      content: '\e619';
    }
  }
}
</style>

