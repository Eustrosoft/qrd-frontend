import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatActionList, MatListItem, MatListItemIcon } from '@angular/material/list';
import { CreateMenuOverlayLocalization } from '@shared/components/create-menu-overlay/create-menu-overlay.constants';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'create-menu-overlay',
  imports: [MatActionList, MatListItem, MatListItemIcon, MatIcon, RouterLink],
  templateUrl: './create-menu-overlay.component.html',
  styleUrl: './create-menu-overlay.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateMenuOverlayComponent {
  protected readonly CreateMenuOverlayLocalization = CreateMenuOverlayLocalization;
}
