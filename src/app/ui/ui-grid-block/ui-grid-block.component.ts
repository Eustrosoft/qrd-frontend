import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { PxToRemPipe } from '@shared/pipe/px-to-rem.pipe';
import { GridAlignItems, GridAlignSelf, GridDisplay, GridJustifyItems } from '@shared/shared.models';

@Component({
  selector: 'ui-grid-block, *[ui-grid-block]',
  standalone: true,
  imports: [],
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.display]': 'gridDisplay()',
    '[style.gap]': 'rowGapSize() + " " + columnGapSize()',
    '[style.grid-template-columns]': 'gridTemplateColumns()',
    '[style.grid-template-rows]': 'gridTemplateRows()',
    '[style.justify-items]': 'gridJustifyItems()',
    '[style.align-items]': 'gridAlignItems()',
    '[style.align-self]': 'gridAlignSelf()',
  },
})
export class UiGridBlockComponent {
  private readonly pxToRemPipe: PxToRemPipe = inject(PxToRemPipe);

  public readonly gridDisplay = input<GridDisplay>('grid');
  public readonly rowGapSize = input('1rem', { transform: (value: string) => this.pxToRemPipe.transform(value) });
  public readonly columnGapSize = input('1rem', { transform: (value: string) => this.pxToRemPipe.transform(value) });
  public readonly gridTemplateColumns = input<string>('repeat(4, 1fr)');
  public readonly gridTemplateRows = input<string>('1fr');
  public readonly gridJustifyItems = input<GridJustifyItems>('initial');
  public readonly gridAlignItems = input<GridAlignItems>('initial');
  public readonly gridAlignSelf = input<GridAlignSelf>('initial');
}
