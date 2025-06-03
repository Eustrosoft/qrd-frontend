import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { MatActionList, MatListItem, MatListItemIcon } from '@angular/material/list';
import { CreateMenuOverlayLocalization } from '@shared/components/create-menu-overlay/create-menu-overlay.constants';
import { UiIconComponent } from '@ui/ui-icon/ui-icon.component';

@Component({
  selector: 'create-menu-overlay',
  imports: [MatActionList, MatListItem, UiIconComponent, MatListItemIcon],
  templateUrl: './create-menu-overlay.component.html',
  styleUrl: './create-menu-overlay.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateMenuOverlayComponent {
  public readonly closeClick = output<void>();
  protected readonly CreateMenuOverlayLocalization = CreateMenuOverlayLocalization;
}
