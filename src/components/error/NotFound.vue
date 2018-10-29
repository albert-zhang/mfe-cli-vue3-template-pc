<template>
  <div class="error-page">
    <el-alert
      title="此页面不存在，请和管理员确认"
      type="warning"
      center>
    </el-alert>
    <div style="margin: 40px; text-align: center;">
      <el-button @click="onGoHome" size="mini">回到首页</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Action, namespace } from 'vuex-class';
import { Vue, Component } from 'vue-property-decorator';
import { Alert } from 'element-ui';
import LoginUtil from '../../util/login';

@Component({
  components: {
    [Alert.name]: Alert,
  },
})
export default class NotFound extends Vue {
  private onGoHome() {
    this.$router.replace({ path: '/' });
  }
}
</script>

<style lang="scss">
.error-page {
  flex: 1;
}
</style>
