import { DOCUMENT, inject, InjectionToken, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { fromEvent, map, merge, startWith } from 'rxjs';

export const IS_SHIFT_PRESSED: InjectionToken<Signal<boolean>> = new InjectionToken('is shift pressed', {
  factory: (): Signal<boolean> => {
    const doc = inject(DOCUMENT);
    return toSignal(
      merge(fromEvent<KeyboardEvent>(doc, 'keydown'), fromEvent<KeyboardEvent>(doc, 'keyup')).pipe(
        map((event) => event.shiftKey),
        startWith(false),
      ),
      { requireSync: true },
    );
  },
});
