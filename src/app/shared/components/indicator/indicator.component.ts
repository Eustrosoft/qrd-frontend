import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'indicator',
  imports: [],
  template: '●',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.color]': 'color()',
  },
})
export class IndicatorComponent {
  public readonly color = input<string>('var(--mat-sys-on-primary)');
}
