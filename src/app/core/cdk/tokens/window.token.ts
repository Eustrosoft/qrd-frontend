import { DOCUMENT, inject, InjectionToken } from '@angular/core';

export const WINDOW: InjectionToken<Window> = new InjectionToken('window', {
  factory: () => inject(DOCUMENT).defaultView,
});
