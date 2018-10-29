<template>
<div class="message-center-button">
  <el-badge :value="unreadCount" class="item" :hidden="unreadCount === 0">
    <a href="#" class="message-center-button__link" @click.prevent="onGoMessageCenter()">
      <i class="mxj-icon mxj-icon-bell"></i>
    </a>
  </el-badge>
</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Badge } from 'element-ui';
import { Getter, State, namespace } from 'vuex-class';

const messageModule = namespace('message');

@Component({
  components: {
    [Badge.name]: Badge,
  },
})
export default class MessageCenterButton extends Vue {
  @messageModule.Getter('unreadCount') private unreadCount!: number;

  private onGoMessageCenter() {
    // TODO: here
  }
}
</script>

<style lang="scss">
.message-center-button__link {
  border: none;
  background: none;
  color: #fff;
  padding: 0;
  margin: 0;
  text-decoration: none;
  > i {
    font-size: 20px !important;
  }
}

.message-center-button {
  .el-badge__content {
    border: none !important;
    background-color: #7AC231 !important;
    top: 3px !important;
  }
}
</style>
