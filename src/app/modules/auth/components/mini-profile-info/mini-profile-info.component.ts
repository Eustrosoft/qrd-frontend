import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TextAvatarComponent } from '@shared/components/text-avatar/text-avatar.component';
import { createSelectMap, select } from '@ngxs/store';
import { AuthState } from '@modules/auth/state/auth.state';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { MatIconButton } from '@angular/material/button';
import { EllipsisDirective } from '@shared/directives/ellipsis.directive';
import { IS_XSMALL } from '@cdk/tokens/breakpoint.tokens';
import { CdkConnectedOverlay, CdkOverlayOrigin, ConnectedPosition, Overlay } from '@angular/cdk/overlay';
import { overlayAnimation } from '@shared/shared.animations';
import { ProfileInfoOverlayComponent } from '@modules/auth/components/profile-info-overlay/profile-info-overlay.component';
import { MatIcon } from '@angular/material/icon';
import { UiSkeletonComponent } from '@ui/ui-skeleton/ui-skeleton.component';

@Component({
  selector: 'mini-profile-info',
  imports: [
    TextAvatarComponent,
    UiFlexBlockComponent,
    MatIconButton,
    EllipsisDirective,
    CdkConnectedOverlay,
    CdkOverlayOrigin,
    ProfileInfoOverlayComponent,
    MatIcon,
    UiSkeletonComponent,
  ],
  animations: [overlayAnimation],
  templateUrl: './mini-profile-info.component.html',
  styleUrl: './mini-profile-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniProfileInfoComponent {
  protected readonly overlay = inject(Overlay);
  protected readonly isXSmall = inject(IS_XSMALL);
  protected readonly selectors = createSelectMap({
    isAuthInfoLoading: select(AuthState.isAuthInfoLoading$),
    authInfo: select(AuthState.getAuthInfo$),
  });

  protected readonly isOverlayOpen = signal<boolean>(false);
  protected readonly cdkConnectedOverlayScrollStrategy = this.overlay.scrollStrategies.close();

  protected readonly OVERLAY_POSITIONS = computed<ConnectedPosition[]>(() => [
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
      offsetY: 24,
      offsetX: 16,
    },
  ]);

  protected openOverlay(): void {
    this.isOverlayOpen.set(true);
  }

  protected closeOverlay(): void {
    this.isOverlayOpen.set(false);
  }
}
