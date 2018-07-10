import 'scrollingelement';
import { KeyboardEvent } from 'react';

const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);


export interface IOptions {
  watchWheel?: boolean,
  watchScroll?: boolean,
  watchKeys?: boolean,
  disableWheel?: boolean,
  disableScroll?: boolean,
  disableKeys?: boolean
}

export class ScrollWatcher {

  static get Key() {
    return {
      Left: 37,
      Up: 38,
      Right: 39,
      Down: 40,
      Space: 32,
      PageUp: 33,
      PageDown: 34,
      End: 35,
      Home: 36,
    };
  }

  static get EventType() {
    return {
      wheel: 'wheel',
      touchmove: 'touchmove',
      scroll: 'scroll',
      keydown: 'keydown',
    };
  }
  callback : ((e : Event, type : string, direction: {down : boolean, right : boolean}, key?: number) => boolean)|undefined
  element : Element|null = null

  options = {
    watchWheel: true,
    watchScroll: true,
    watchKeys: true,
    disableWheel: true,
    disableScroll: true,
    disableKeys: true,
    keyboardKeys: [32, 33, 34, 35, 36, 37, 38, 39, 40],
    authorizedInInputs: [32, 37, 38, 39, 40]
    // space: 32, page up: 33, page down: 34, end: 35, home: 36
    // left: 37, up: 38, right: 39, down: 40
  }

  private _lockToScrollPos : [ number, number ]
  private _lastScroll : [ number, number ]

  constructor(element : Element|null = null, options : IOptions = {}) {
    this.element = element || document.scrollingElement;
    this.options = Object.assign(this.options, options);

    if (this.element) {
      this._lockToScrollPos = [
        this.element.scrollLeft,
        this.element.scrollTop
      ];
    } else {
      this._lockToScrollPos = [
        window.scrollX,
        window.scrollY
      ];
    }

    this._lastScroll = this._lockToScrollPos;

    this.handleScroll = this.handleScroll.bind(this);
    this.handleWheel = this.handleWheel.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
  }

  watch(callback : ((e : Event, type : string, direction: {down : boolean, right : boolean}, key?: number) => boolean)) {
    if (!canUseDOM) return;

    this.callback = callback;

    const { watchKeys, watchScroll, watchWheel, disableScroll } = this.options;

    this.callback = callback;

    if (watchWheel) {
      document.addEventListener('wheel', this.handleWheel);
      document.addEventListener('touchmove', this.handleWheel);
      document.addEventListener('touchstart', this.handleTouchstart);
    }

    if (watchScroll || disableScroll) {
      document.addEventListener('scroll', this.handleScroll);
    }

    if (watchKeys) {
      document.addEventListener('keydown', this.handleKeydown);
    }
  }

  /**
   * Re-enable page scrolls
   */
  destroy() {
    if (!canUseDOM) return;


    document.removeEventListener('touchmove', this.handleWheel);
    document.removeEventListener('touchstart', this.handleTouchstart);

    document.removeEventListener('wheel', this.handleWheel);
    document.removeEventListener('scroll', this.handleScroll);
    document.removeEventListener('keydown', this.handleKeydown);
  }
  
  handleTouchstart(e : TouchEventInit) {
    if (!e.touches || e.touches.length <= 0) {
      return;
    }

    this._lastScroll = [
      e.touches[0].pageX,
      e.touches[0].pageY
    ];
  }

  handleWheel(e : any) {
    let preventDefault = this.options.disableWheel;
    if (this.callback) {
      let direction = this._getScrollDirection(e, e.type, e.keyCode);
      preventDefault = !this.callback(e, e.type, direction);
    }

    if (preventDefault && this.options.disableWheel) {
      return false;
    }

    return true;
  }

  handleScroll(e : any) {
    let preventDefault = this.options.disableScroll;
    if (this.options.watchScroll && this.callback) {
      let direction = this._getScrollDirection(e, e.type, e.keyCode);
      preventDefault = !this.callback(e, e.type, direction);
    }

    if (preventDefault && this.options.disableScroll) {
      window.scrollTo(...this._lockToScrollPos);
      return false;
    }

    return true;
  }

  handleKeydown(e : any) {
    let keys : any = this.options.keyboardKeys;
    let eventTarget = e.target.tagName;

    if (!eventTarget) {
      eventTarget = '';
    }

    if (['INPUT', 'TEXTAREA'].includes(eventTarget.toUpperCase())) {
      keys = this.options.authorizedInInputs;
    }

    if (!keys.includes(e.keyCode)) {
      return false;
    }


    let preventDefault = this.options.disableKeys;
    if (typeof this.callback !== 'undefined') {
      let direction = this._getScrollDirection(e, e.type, e.keyCode);
      preventDefault = !this.callback(e, e.type, direction, e.keyCode);
    }

    if (preventDefault && this.options.disableKeys) {
      e.preventDefault();
      return false;
    }

    return true;
  }

  private _getScrollDirection(e : Event, type : string, key? : number) : {down : boolean, right : boolean} {
    switch (type) {

      case ScrollWatcher.EventType.wheel:
        return this._getScrollDirectionByWheel(e as WheelEvent);

      case ScrollWatcher.EventType.touchmove:
        return this._getScrollDirectionByTouchmove(e as TouchEvent);
        
      case ScrollWatcher.EventType.keydown:
        return this._getScrollDirectionByKeyPress(key as number);
      
      default:
        return this._getScrollDirectionByScroll(e as WheelEvent);

    }
  }
  
  private _getScrollDirectionByScroll(event : Event) {
    let currentScroll : [number, number] = [window.scrollX, window.scrollY];
    if (this.element) {
      currentScroll = [this.element.scrollLeft, this.element.scrollTop];
    }

    let isScrollingRight = currentScroll[0] > this._lastScroll[0];
    let isScrollingDown = currentScroll[1] > this._lastScroll[1];
    
    this._lastScroll = currentScroll;

    return {
      down: isScrollingDown,
      right: isScrollingRight 
    }
  }
  
  private _getScrollDirectionByWheel(event : WheelEvent) {
    return {
      down: event.deltaY > 0,
      right: event.deltaX > 0
    }
  }
  
  private _getScrollDirectionByTouchmove(event : TouchEvent) {
    return {
      down: scrollY < this._lastScroll[1],
      right: scrollX < this._lastScroll[0]
    }
  }
  
  private _getScrollDirectionByKeyPress(key : number) {
    let isScrollingDown = (
      ScrollWatcher.Key.Down === key ||
      ScrollWatcher.Key.End === key ||
      ScrollWatcher.Key.PageDown === key ||
      ScrollWatcher.Key.Space === key
    );
    let isScrollingRight = (
      ScrollWatcher.Key.Right === key ||
      ScrollWatcher.Key.End === key
    );

    return {
      down: isScrollingDown,
      right: isScrollingRight
    }
  }
}