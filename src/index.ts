/*
 *
 * detect mouse key, scroll touch and focus events
 *
 * set timeout before firing trigger - default to 60seconds
 *
 * optionally monitor tabs using session storage
 *
 * Start and stop monitoring
 *
 * prevent same event status firing multiple times
 *
 * optional multi-stage idle e.g. 60 seconds then second event after 5 mins to disable screen
 *
 *
 * query status along with active duration and idle duration
 * */

import { ActiveStatus, IdleEvent, StillHereInitOptions } from './types';
import { JSEmitter } from 'jsemitter';
import { hookEvents, unHookEvents } from './helpers';

const DefaultEventList: string[] = [
  'touchmove',
  'focus',
  'click',
  'mousewheel', //wheel
  'mousedown',
  'mousemove',
  'keydown',
  'touchstart'
];

const DefaultTimeoutMS: number = 60000;

export class StillHere extends JSEmitter {
  private activeStatus: boolean;
  private statusChangedAt: Date;
  private timerHandle: any;
  private pageVisible: boolean;
  private readonly eventList: string[];
  private idleEvents: IdleEvent[];
  private ignoredIdleActivityEvents: Record<string, boolean>;
  private idleTimeoutMS: number;


  constructor(options: StillHereInitOptions) {
    super();
    // check if Document is valid before doing anything
    // set a status to indicate no Doc for ssr
    // listen for session storage changes

    this.eventList = options.activityEvents ?? DefaultEventList;

    for (const idleEvent of options.ignoredIdleActivityEvents ?? []) {
      this.ignoredIdleActivityEvents[idleEvent] = true;
    }

    this.idleTimeoutMS =
      options.idleTimeoutMS && options.idleTimeoutMS > 0
        ? options.idleTimeoutMS
        : DefaultTimeoutMS;

    this.idleEvents = options.idleEvents ?? [];

    this.updateState(options.active ?? false, true);
  }

  private onActivity(event: any) {
    if (event && event.type === 'visibilitychange') {
      let currentVisibility: boolean = document.visibilityState === 'visible';
      if (this.pageVisible !== currentVisibility) {
        this.pageVisible = currentVisibility;
        this.emit('page-visibility', currentVisibility);
      }
      return;
    }
    if (!this.activeStatus) {
      if (!event || !this.ignoredIdleActivityEvents[event.type])
        this.setActive();
    }
  }

  public get visible(): boolean {
    return this.pageVisible;
  }

  public start(initialActiveState: boolean = true) {
    this.stop();
    this.updateState(initialActiveState, true);
    hookEvents(document, this.eventList, this.onActivity.bind(this));
  }

  public stop() {
    unHookEvents(document, this.eventList, this.onActivity);

    if (this.timerHandle) {
      clearTimeout(this.timerHandle);
    }
  }

  public get statusUpdatedAt(): Date {
    return this.statusChangedAt;
  }

  public get active(): boolean {
    return this.activeStatus;
  }

  public get idleState(): string {
    if (this.activeStatus) {
      return 'active';
    }
    return 'idle';
  }

  public get stateDuration(): number {
    return Date.now() - this.statusChangedAt.getTime();
  }

  private updateState(active: boolean, forceUpdate: boolean = false): void {
    if (forceUpdate || this.activeStatus !== active) {
      this.activeStatus = active;
      this.statusChangedAt = new Date();
    }
  }

  // add event emitter

  private setActive(): void {
    // this.timerHandle = setTimeout();
  }

  private setIdle(): void {
    if (!this.idleEvents.length && this.timerHandle) {
      clearTimeout(this.timerHandle);
    } else {
      // set timeout to next Idle state
      // emit events to for each state
      // emit event stateChanged... {active:true,idleKey?:'deep-sleep}
      // emit event active, idleKey
      // emit event visibility
    }
  }

  private resetActivityTimeout() {
    // on each change event reset the timeout
    if (this.timerHandle) {
      clearTimeout(this.timerHandle);
    }
    this.timerHandle=setTimeout(this.setIdle,this.idleTimeoutMS)
  }
}
