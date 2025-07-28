import { DOCUMENT, inject, InjectionToken } from '@angular/core';

export const VERSION: InjectionToken<string> = new InjectionToken('app version', {
  providedIn: 'root',
  factory: () => inject(DOCUMENT).querySelector('meta[name="version"]')?.getAttribute('content') ?? 'Unknown version',
});
