import { IdleEvent } from './types';

// export function sortIdleEvents(idleEvents: IdleEvent[]): IdleEvent[] {
//   const sortedEvents: IdleEvent[] = [...idleEvents];
//
//   sortedEvents.sort((a, b) => {
//     if (a.duration < b.duration) {
//       return -1;
//     }
//     if (a.duration > b.duration) {
//       return 1;
//     }
//     return 0;
//   });
//
//   return sortedEvents;
// }


// export function isGlobalWindowAvailable(): boolean {
//   return typeof window !== 'undefined';
// }

export function hookEvents(
  domDocument: any,
  eventList: string[],
  changeEvent: (event: any) => void
) {
  if (domDocument) {
    domDocument.addEventListener(
      'visibilitychange',
      this.visibilityChangeEvent
    );
    for (const event of eventList) {
      domDocument.addEventListener(event, changeEvent);
    }
  }
}

export function unHookEvents(
  domDocument: any,
  eventList: string[],
  changeEvent: (event: any) => void
) {
  if (domDocument) {
    domDocument.addEventListener(
      'visibilitychange',
      this.visibilityChangeEvent
    );
    for (const event of eventList) {
      domDocument.addEventListener(event, changeEvent);
    }
  }
}
