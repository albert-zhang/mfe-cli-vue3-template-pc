import {eventBusEmit} from '@mydreamplus/aglarond/lib/basic';
import GlobalEvents from '@/util/global-events';

class ResponsiveUtilClass {
  private mql: MediaQueryList;
  private _isLargeScreen: boolean = false;

  constructor() {
    this.mql = window.matchMedia('(min-width: 576px)');
    this._isLargeScreen = this.mql.matches;
    this.mql.addListener((v) => {
      this.updateForScreenWith(v);
    });
  }

  public get isLargeScreen() {
    return this._isLargeScreen;
  }

  private updateForScreenWith(val: MediaQueryList) {
    const isLageScreen = val.matches;
    eventBusEmit(GlobalEvents.RESPONSIVE_MIN_WIDTH_CHANGED_EVENT, isLageScreen);
  }
}

export default new ResponsiveUtilClass();
