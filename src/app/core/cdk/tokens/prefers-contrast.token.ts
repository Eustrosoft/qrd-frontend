import { InjectionToken, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { matchMediaQueryFactory } from '@cdk/factories/match-media-query.factory';

export const PREFERS_CONTRAST_TOKEN: InjectionToken<Signal<boolean>> = new InjectionToken('is user prefers more contrast', {
  providedIn: 'root',
  factory: () => toSignal(matchMediaQueryFactory('(prefers-contrast: more)'), { requireSync: true }),
});
