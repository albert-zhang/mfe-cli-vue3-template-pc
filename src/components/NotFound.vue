<template>
  <div>
    <el-alert
      title="此页面不存在，或者您无此页面的权限，请和管理员确认"
      type="warning"
      center
      show-icon>
    </el-alert>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Alert } from 'element-ui';

@Component({
  components: {
    [Alert.name]: Alert,
  },
})
export default class Layout extends Vue {}
</script>

<style lang="scss">
</style>
