import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';

@Component({
  selector: 'card-container',
  imports: [UiFlexBlockComponent],
  templateUrl: './card-container.component.html',
  styleUrl: './card-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.box-shadow]': 'boxShadow()',
  },
})
export class CardContainerComponent {
  public readonly hideHeading = input<boolean>(false);
  public readonly boxShadow = input<string>('var(--mat-sys-level1)');
}
