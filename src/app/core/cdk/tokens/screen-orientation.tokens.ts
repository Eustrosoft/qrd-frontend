import { computed, inject, InjectionToken, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs';

export const IS_PORTRAIT = new InjectionToken<Signal<boolean>>('Is Portrait Orientation', {
  providedIn: 'root',
  factory: (): Signal<boolean> => {
    const breakpointObserver = inject(BreakpointObserver);
    const portraitQuery = '(orientation: portrait)';

    return toSignal(breakpointObserver.observe(portraitQuery).pipe(map((result) => result.matches)), { requireSync: true });
  },
});

export const IS_LANDSCAPE = new InjectionToken<Signal<boolean>>('Is Landscape Orientation', {
  providedIn: 'root',
  factory: (): Signal<boolean> => {
    const isPortrait = inject(IS_PORTRAIT);
    return computed(() => !isPortrait());
  },
});
