import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { PxToRemPipe } from '@app/shared/pipe/px-to-rem.pipe';
import { GridDisplay, GridJustifyItems } from '@shared/shared.models';

@Component({
  selector: 'grid-block, *[grid-block]',
  standalone: true,
  imports: [],
  templateUrl: './grid-block.component.html',
  styleUrl: './grid-block.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--grid-display]': 'gridDisplay()',
    '[style.--grid-row-gap-size]': 'rowGapSize()',
    '[style.--grid-column-gap-size]': 'columnGapSize()',
    '[style.--grid-template-columns]': 'gridTemplateColumns()',
    '[style.--grid-template-rows]': 'gridTemplateRows()',
    '[style.--grid-justify-items]': 'gridJustifyItems()',
  },
})
export class GridBlockComponent {
  private readonly pxToRemPipe: PxToRemPipe = inject(PxToRemPipe);

  public readonly gridDisplay = input<GridDisplay>('grid');
  public readonly rowGapSize = input('1rem', { transform: (value: string) => this.pxToRemPipe.transform(value) });
  public readonly columnGapSize = input('1rem', { transform: (value: string) => this.pxToRemPipe.transform(value) });
  public readonly gridTemplateColumns = input<string>('repeat(4, 1fr)');
  public readonly gridTemplateRows = input<string>('1fr');
  public readonly gridJustifyItems = input<GridJustifyItems>('initial');
}
