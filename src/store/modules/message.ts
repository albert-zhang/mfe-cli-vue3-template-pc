import StoreDecorator, {
  Action,
  Mutation,
  Getter,
} from '@mydreamplus/aglarond/lib/store-decorator';

interface StateType {
  messages: string[];
}

@StoreDecorator
class StoreModule {
  public state() {
    return {
    };
  }

  @Getter
  public unreadCount(state: StateType): number {
    return 1;
  }
}

export default new StoreModule();
