export interface StillHereInitOptions {
  active?: boolean;
  idleEvents?: IdleEvent[];
  activityEvents?: string[];
  idleTimeoutMS?: number;
  ignoredIdleActivityEvents?: string[]; // don't trigger active status if one of these fires when the app is idle
}

export interface IdleEvent {
  durationOffsetMS: number;
  key: string;
}

export interface ActiveStatus {
  active: boolean;
  duration: number;
}
