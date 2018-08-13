<template>
  <div>
    <el-alert
      title="此页面不存在，或者您无此页面的权限，请和管理员确认"
      type="warning"
      center>
    </el-alert>
    <div class="text-right">
      <el-button @click="handleLogout" size="mini">退出登录</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Action, namespace } from 'vuex-class';
import { Vue, Component } from 'vue-property-decorator';
import { Alert } from 'element-ui';

@Component({
  components: {
    [Alert.name]: Alert,
  },
})
export default class Layout extends Vue {
  //
}
</script>

<style lang="scss">
.text-right{
  text-align: right;
  padding: 10px;
}
</style>
