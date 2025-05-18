import { inject, InjectionToken, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs';

export const CURRENT_BREAKPOINT: InjectionToken<Signal<keyof typeof Breakpoints>> = new InjectionToken('', {
  providedIn: 'root',
  factory: (): Signal<keyof typeof Breakpoints> => {
    const breakpointObserver: BreakpointObserver = inject(BreakpointObserver);
    return toSignal(
      breakpointObserver.observe(Array.from(Object.values(Breakpoints))).pipe(
        map((breakpointState) => {
          for (const [key, value] of Object.entries(Breakpoints)) {
            if (breakpointState.breakpoints[value]) {
              return <keyof typeof Breakpoints>key;
            }
          }
          return <keyof typeof Breakpoints>'Medium';
        }),
      ),
      { requireSync: true },
    );
  },
});
