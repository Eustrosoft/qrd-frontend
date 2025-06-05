import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { MatActionList, MatListItem, MatListItemIcon } from '@angular/material/list';
import { CreateMenuOverlayLocalization } from '@shared/components/create-menu-overlay/create-menu-overlay.constants';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'create-menu-overlay',
  imports: [MatActionList, MatListItem, MatListItemIcon, MatIcon],
  templateUrl: './create-menu-overlay.component.html',
  styleUrl: './create-menu-overlay.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateMenuOverlayComponent {
  public readonly closeClick = output<void>();
  protected readonly CreateMenuOverlayLocalization = CreateMenuOverlayLocalization;
}
