import { InjectionToken, Signal } from '@angular/core';

import { toSignal } from '@angular/core/rxjs-interop';
import { matchMediaQueryFactory } from '@cdk/factories/match-media-query.factory';

export const PREFERS_DARK_TOKEN: InjectionToken<Signal<boolean>> = new InjectionToken('is user prefers dark scheme', {
  providedIn: 'root',
  factory: () => toSignal(matchMediaQueryFactory('(prefers-color-scheme: dark)'), { requireSync: true }),
});
