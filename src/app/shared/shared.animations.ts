import { animate, style, transition, trigger } from '@angular/animations';

export const expandAnimation = trigger('expandFade', [
  transition(':enter', [
    style({ opacity: 0, height: '0', padding: '0' }),
    animate(
      '300ms ease-out',
      style({
        opacity: 1,
        height: '*',
        padding: '12px 16px',
      }),
    ),
  ]),
  transition(':leave', [animate('300ms ease-in', style({ opacity: 0, height: '0', padding: '0' }))]),
]);
