<template>
<div class="MessageCenterButton">
  <el-badge :value="unreadCount" class="item">
    <a href="#" class="MessageCenterButtonLink" @click.prevent="onGoMessageCenter()">
      <i class="el-icon-bell"></i>
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
.MessageCenterButtonLink {
  font-size: 24px;
  border: none;
  background: none;
  color: #fff;
  padding: 0;
  margin: 0;
}

.MessageCenterButton {
  .el-badge__content {
    border: none !important;
    background-color: #7AC231 !important;
    top: 3px !important;
  }
}
</style>
