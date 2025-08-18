import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { MatActionList, MatListItem, MatListItemIcon } from '@angular/material/list';
import { CreateMenuOverlayLocalization } from '@shared/components/create-menu-overlay/create-menu-overlay.constants';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { dispatch } from '@ngxs/store';
import { CreateDefaultTemplate } from '@app/pages/templates/state/templates.actions';

@Component({
  selector: 'create-menu-overlay',
  imports: [MatActionList, MatListItem, MatListItemIcon, MatIcon, RouterLink],
  templateUrl: './create-menu-overlay.component.html',
  styleUrl: './create-menu-overlay.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateMenuOverlayComponent {
  public readonly closeOverlay = output<void>();

  protected readonly createDefaultTemplate = dispatch(CreateDefaultTemplate);

  protected readonly CreateMenuOverlayLocalization = CreateMenuOverlayLocalization;
}
