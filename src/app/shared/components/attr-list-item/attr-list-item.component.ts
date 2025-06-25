import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { MatMiniFabButton } from '@angular/material/button';
import { SharedLocalization } from '@shared/shared.constants';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'attr-list-item',
  imports: [UiFlexBlockComponent, MatIcon, MatMiniFabButton, MatTooltip],
  templateUrl: './attr-list-item.component.html',
  styleUrl: './attr-list-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttrListItemComponent {
  public readonly caption = input<string>('');
  public readonly value = input<string>('');
  public readonly isPublic = input<boolean>(false);
  public readonly isStatic = input<boolean>(false);
  protected readonly SharedLocalization = SharedLocalization;
}
