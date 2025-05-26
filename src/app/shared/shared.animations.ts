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
