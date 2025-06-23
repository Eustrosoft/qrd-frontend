import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { PxToRemPipe } from '@shared/pipe/px-to-rem.pipe';
import { CursorType, Display } from '@shared/shared.models';

@Component({
  selector: 'ui-badge',
  imports: [],
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.display]': 'display()',
    '[style.background]': 'background()',
    '[style.color]': 'color()',
    '[style.padding]': 'padding()',
    '[style.border-radius]': 'borderRadius()',
    '[style.cursor]': 'cursor()',
  },
  hostDirectives: [
    {
      directive: MatTooltip,
      inputs: ['matTooltip: tooltipText', 'matTooltipPosition: tooltipPosition', 'matTooltipClass: tooltipClass'],
    },
  ],
})
export class UiBadgeComponent {
  private readonly pxToRemPipe: PxToRemPipe = inject(PxToRemPipe);

  public readonly display = input<Display>('flex');
  public readonly background = input<string>('var(--mat-sys-primary)');
  public readonly color = input<string>('var(--mat-sys-on-primary)');
  public readonly cursor = input<CursorType>('default');
  public readonly padding = input('4px 8px');
  public readonly borderRadius = input('1rem', { transform: (value: string) => this.pxToRemPipe.transform(value) });
}
