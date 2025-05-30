import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TextAvatarComponent } from '@shared/components/text-avatar/text-avatar.component';
import { createSelectMap, select } from '@ngxs/store';
import { AuthState } from '@modules/auth/state/auth.state';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { MatIconButton } from '@angular/material/button';
import { UiIconComponent } from '@ui/ui-icon/ui-icon.component';
import { EllipsisDirective } from '@shared/directives/ellipsis.directive';

@Component({
  selector: 'auth-info',
  imports: [TextAvatarComponent, UiFlexBlockComponent, MatIconButton, UiIconComponent, EllipsisDirective],
  templateUrl: './auth-info.component.html',
  styleUrl: './auth-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthInfoComponent {
  protected readonly selectors = createSelectMap({
    authInfo: select(AuthState.getAuthInfo$),
  });
}
