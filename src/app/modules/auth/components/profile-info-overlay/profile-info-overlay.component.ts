import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatAnchor, MatButton, MatIconButton } from '@angular/material/button';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { UiIconComponent } from '@ui/ui-icon/ui-icon.component';
import { TextInteractionEffect } from '@shared/directives/text-interaction-effect.directive';
import { ProfileInfoOverlayLocalization } from '@modules/auth/components/profile-info-overlay/profile-info-overlay.constants';
import { SharedLocalization } from '@shared/shared.constants';
import { dispatch } from '@ngxs/store';
import { Logout } from '@modules/auth/state/auth.actions';

@Component({
  selector: 'profile-info-overlay',
  imports: [MatIconButton, UiFlexBlockComponent, UiIconComponent, MatAnchor, TextInteractionEffect, MatButton],
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
