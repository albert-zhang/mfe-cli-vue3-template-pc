<template>
  <el-container class="container-main">
    <el-aside width="200px">
      <mxj-side />
    </el-aside>
    <el-container class="el-container-min">
      <el-header>
        <el-row>
          <el-col :span="14">
            <mxj-breadcrumb />
          </el-col>
          <el-col :span="10" style="text-align: right">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                userName（roleName）<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
      </el-container>
  </el-container>
</template>

<script lang="ts">
import { Getter, Action, namespace } from 'vuex-class';
import { Vue, Component } from 'vue-property-decorator';
import { Dropdown, DropdownMenu, DropdownItem } from 'element-ui';

const action = namespace('auth', Action);
const getter = namespace('auth', Getter);

@Component({
  components: {
    [Dropdown.name]: Dropdown,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
    'mxj-side': () => import('./Side.vue'),
    'mxj-breadcrumb': () => import('./Breadcrumb.vue'),
  },
})
export default class Layout extends Vue {
  public created() {
    //
  }
}
</script>
<style lang="scss">
.el-header {
  background-color: #eee;
  color: #333;
  padding: 0 20px;
  line-height: 60px;

  /deep/ .mxj-breadcrumb {
    line-height: 60px;
  }
}
.el-aside {
  color: #333;
  // fix safair 上左边黑色部分未撑满高度
  height: 100%;

  .el-menu {
    height: 100%;
  }
}
.el-main {
  color: #333;
}
.container-main {
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
