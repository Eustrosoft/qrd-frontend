import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatAnchor, MatButton, MatIconButton } from '@angular/material/button';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { ProfileInfoOverlayLocalization } from '@modules/auth/components/profile-info-overlay/profile-info-overlay.constants';
import { SharedLocalization } from '@shared/shared.constants';
import { dispatch } from '@ngxs/store';
import { Logout } from '@modules/auth/state/auth.actions';
import { MatIcon } from '@angular/material/icon';
import { UiGridBlockComponent } from '@ui/ui-grid-block/ui-grid-block.component';

@Component({
  selector: 'profile-info-overlay',
  imports: [MatIconButton, UiFlexBlockComponent, MatAnchor, MatButton, MatIcon, UiGridBlockComponent],
  templateUrl: './profile-info-overlay.component.html',
  styleUrl: './profile-info-overlay.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileInfoOverlayComponent {
  protected readonly ProfileInfoOverlayLocalization = ProfileInfoOverlayLocalization;
  protected readonly SharedLocalization = SharedLocalization;

  protected readonly logout = dispatch(Logout);

  public readonly username = input<string>('');
  public readonly email = input<string>('');
  public readonly closeClick = output<void>();
}
