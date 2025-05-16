import { inject, InjectionToken } from '@angular/core';
import { WINDOW } from '@cdk/tokens/window.token';

export const DOCUMENT_FONT_SIZE: InjectionToken<number> = new InjectionToken('font size of root element', {
  factory: (): number => {
    const window: Window = inject(WINDOW);
    return parseInt(window.getComputedStyle(window.document.documentElement).getPropertyValue('font-size'));
  },
});
