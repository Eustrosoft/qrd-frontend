import { InjectionToken, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { matchMediaQueryFactory } from '@cdk/factories/match-media-query.factory';
import { Breakpoints } from '@angular/cdk/layout';

export const IS_XSMALL: InjectionToken<Signal<boolean>> = new InjectionToken('Is Screen Matches Media Query (max-width: 599.98px)', {
  providedIn: 'root',
  factory: () => toSignal(matchMediaQueryFactory(Breakpoints.XSmall), { requireSync: true }),
});

export const IS_SMALL: InjectionToken<Signal<boolean>> = new InjectionToken('Is Screen Matches Media Query (min-width: 600px) and (max-width: 959.98px)', {
  providedIn: 'root',
  factory: () => toSignal(matchMediaQueryFactory(Breakpoints.Small), { requireSync: true }),
});

export const IS_MEDIUM: InjectionToken<Signal<boolean>> = new InjectionToken('Is Screen Matches Media Query (min-width: 600px) and (max-width: 959.98px)', {
  providedIn: 'root',
  factory: () => toSignal(matchMediaQueryFactory(Breakpoints.Medium), { requireSync: true }),
});

export const IS_LARGE: InjectionToken<Signal<boolean>> = new InjectionToken('Is Screen Matches Media Query (min-width: 1280px) and (max-width: 1919.98px)', {
  providedIn: 'root',
  factory: () => toSignal(matchMediaQueryFactory(Breakpoints.Large), { requireSync: true }),
});

export const IS_XLARGE: InjectionToken<Signal<boolean>> = new InjectionToken('Is Screen Matches Media Query (min-width: 1920px)', {
  providedIn: 'root',
  factory: () => toSignal(matchMediaQueryFactory(Breakpoints.XLarge), { requireSync: true }),
});
