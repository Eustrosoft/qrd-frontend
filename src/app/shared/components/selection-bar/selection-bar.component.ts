import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { SharedLocalization } from '@shared/shared.constants';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'selection-bar',
  imports: [UiFlexBlockComponent, MatButton, MatIcon, MatIconButton],
  templateUrl: './selection-bar.component.html',
  styleUrl: './selection-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectionBarComponent {
  protected readonly SharedLocalization = SharedLocalization;

  public readonly count = input<number>(0);
  public readonly onSelectAll = output<void>();
  public readonly onClose = output<void>();
}
