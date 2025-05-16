import { fromEvent, map, Observable, startWith } from 'rxjs';
import { inject } from '@angular/core';
import { WINDOW } from '@cdk/tokens/window.token';

/**
 * Слушает изменения размеров экрана, с помощью `change` event из интерфейса MediaQueryList
 *
 * @param {string} query - media запрос, аналогичный @media в css, например `(width <= 799px)`
 * @returns {Observable<boolean>} Observable объект, который выдает:
 * `true` - если экран соответствует @media запросу,
 * `false` - если экран НЕ соответствует @media запросу
 */
export function matchMediaQueryFactory(query: string): Observable<boolean> {
  const window: Window = inject(WINDOW);
  const mediaQuery = window.matchMedia(query);
  return fromEvent<MediaQueryList>(mediaQuery, 'change').pipe(
    startWith(mediaQuery),
    map((list: MediaQueryList) => list.matches),
  );
}
