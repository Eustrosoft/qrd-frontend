import { DOCUMENT, inject } from '@angular/core';

export function baseHrefFactory(): string {
  const doc = inject(DOCUMENT, { optional: true });

  if (doc?.querySelector) {
    const base = doc.querySelector<HTMLBaseElement>('base[href]');
    if (base) {
      return base?.getAttribute('href') ?? '/';
    }
  }

  return '/';
}
