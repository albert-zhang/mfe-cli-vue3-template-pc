import {eventBusEmit} from '@mydreamplus/aglarond/lib/basic';
import GlobalEvents from './globalEvents';

/* WorkAround for https://github.com/Microsoft/TypeScript/issues/14703 */
interface WAMediaQueryList {
  matches: boolean;
  media: string;
}
interface WAMediaQueryListEvent {
  currentTarget: WAMediaQueryList;
}

const MEDIA_BREAKPOINT_PC = '768px'; // must match with the value in `vars.scss`

class ResponsiveUtilClass {
  private mql: MediaQueryList;
  private _isLargeScreen: boolean = false;

  constructor() {
    this.mql = window.matchMedia(`(min-width: ${MEDIA_BREAKPOINT_PC})`);
    this._isLargeScreen = this.mql.matches;
    this.mql.addListener((evt: any) => {
      this.updateForScreenWith((evt as WAMediaQueryListEvent).currentTarget.matches);
    });
  }

  public get isLargeScreen() {
    return this._isLargeScreen;
  }

  private updateForScreenWith(matches: boolean) {
    const isLageScreen = matches;
    this._isLargeScreen = isLageScreen;
    eventBusEmit(GlobalEvents.RESPONSIVE_MIN_WIDTH_CHANGED_EVENT, isLageScreen);
  }
}

export default new ResponsiveUtilClass();
