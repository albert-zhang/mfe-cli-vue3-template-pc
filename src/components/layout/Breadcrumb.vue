<template>
  <el-breadcrumb class="mxj-breadcrumb" separator="/">
    <template v-for="(item) in level">
      <el-breadcrumb-item
        :key="item.path"
        :to="item.pageRoot || item.pageLast ? '' : item.path"
        :class="item.pageRoot ? 'mxj-breadcrumb-page-root' : ''"
      >
        {{ item.name }}
      </el-breadcrumb-item>
    </template>
  </el-breadcrumb>
</template>

<script lang="ts">
import { Getter, State, namespace } from 'vuex-class';
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Breadcrumb, BreadcrumbItem } from 'element-ui';
import {RouteRecord} from 'vue-router';

interface RouteRecord2 {
  name: string | undefined;
  path: string;
  pageRoot: boolean;
  pageLast: boolean;
}

@Component({
  components: {
    [Breadcrumb.name]: Breadcrumb,
    [BreadcrumbItem.name]: BreadcrumbItem,
  },
})
export default class MxjBreadcrumb extends Vue {
  @State('route') private route!: any;

  private level: RouteRecord2[] = [];

  @Watch('route')
  private watchRoute() {
    this.getBreadcrumb();
  }

  private created() {
    this.getBreadcrumb();
  }

  private getBreadcrumb(): void {
    const routes: RouteRecord2[] = this.$route.matched.map((item: RouteRecord) => ({
      name: item.name,
      path: item.path,
      pageRoot: false,
      pageLast: false,
    }));

    const matched = routes.filter((item: RouteRecord2, index: number) => {
      if (index === 0) {
        item.pageRoot = true;
      }
      if (index === routes.length - 1) {
        item.pageLast = true;
      }
      return !!item.name;
    });

    const f = matched[0];

    if (f && f.path !== '') {
      const abstractRoot: RouteRecord2 = {
        path: '/',
        name: '首页',
        pageRoot: false,
        pageLast: false,
      };
      this.level = [abstractRoot].concat(matched);
    } else {
      this.level = matched;
    }
  }
}
</script>

<style lang="scss" scoped>
.mxj-breadcrumb {
  &-page-root /deep/ {
    .el-breadcrumb__inner, .el-breadcrumb__inner a {
      color: #606266;
      font-weight: normal;
      cursor: text;
    }
  }
}
</style>

