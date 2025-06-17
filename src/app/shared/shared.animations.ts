import { animate, state, style, transition, trigger } from '@angular/animations';

export const overlayAnimation = trigger('transformPanel', [
  state(
    'void',
    style({
      opacity: 0,
      transform: 'scaleY(0.8)',
    }),
  ),
  state(
    'enter',
    style({
      opacity: 1,
      transform: 'scaleY(1)',
    }),
  ),
  transition('void => enter', animate('120ms cubic-bezier(0, 0, 0.2, 1)')),
  transition('enter => void', animate('100ms 25ms linear', style({ opacity: 0 }))),
]);

export const expandAnimation = trigger('expandFade', [
  transition(':enter', [
    style({ opacity: 0, height: '0', marginBottom: '0', padding: '0' }),
    animate('300ms ease-out', style({ opacity: 1, height: '*', marginBottom: '32px', padding: '12px 16px' })),
  ]),
  transition(':leave', [animate('300ms ease-in', style({ opacity: 0, height: '0', marginBottom: '0', padding: '0' }))]),
]);
