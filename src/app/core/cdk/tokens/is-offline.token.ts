import { inject, InjectionToken, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { fromEvent, map, merge, startWith } from 'rxjs';
import { WINDOW } from '@cdk/tokens/window.token';

export const IS_OFFLINE: InjectionToken<Signal<boolean>> = new InjectionToken('is offline', {
  factory: (): Signal<boolean> => {
    const win = inject(WINDOW);
    return toSignal(
      merge(fromEvent(win, 'online'), fromEvent(win, 'offline')).pipe(
        map((event) => event.type === 'offline'),
        startWith(false),
      ),
      { requireSync: true },
    );
  },
});
