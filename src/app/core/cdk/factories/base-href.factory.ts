import { DOCUMENT, inject } from '@angular/core';

export function baseHrefFactory(): string {
  const doc = inject(DOCUMENT, { optional: true });

  if (doc?.head?.querySelector) {
    return doc.head.querySelector<HTMLBaseElement>('base')?.getAttribute('href') ?? '/';
  }

  return '/';
}
