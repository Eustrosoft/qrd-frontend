import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TextAvatarComponent } from '@shared/components/text-avatar/text-avatar.component';
import { createSelectMap } from '@ngxs/store';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { MatIconButton } from '@angular/material/button';
import { EllipsisDirective } from '@shared/directives/ellipsis.directive';
import { IS_XSMALL } from '@cdk/tokens/breakpoint.tokens';
import { CdkConnectedOverlay, CdkOverlayOrigin, ConnectedPosition, Overlay } from '@angular/cdk/overlay';
import { ProfileInfoOverlayComponent } from '@modules/auth/components/profile-info-overlay/profile-info-overlay.component';
import { MatIcon } from '@angular/material/icon';
import { UiSkeletonComponent } from '@ui/ui-skeleton/ui-skeleton.component';
import { OverlayAnimationDirective } from '@shared/directives/overlay-animation.directive';
import { HeaderLocalization } from '@shared/components/qrd-header/qrd-header.constants';
import { AuthSelectors } from '@modules/auth/state/auth.selectors';

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
    OverlayAnimationDirective,
  ],
  templateUrl: './mini-profile-info.component.html',
  styleUrl: './mini-profile-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniProfileInfoComponent {
  protected readonly overlay = inject(Overlay);
  protected readonly isXSmall = inject(IS_XSMALL);
  protected readonly selectors = createSelectMap({
    isAuthInfoLoading: AuthSelectors.getSlices.isAuthenticated,
    authInfo: AuthSelectors.getSlices.authInfo,
  });

  protected readonly HeaderLocalization = HeaderLocalization;

  protected readonly isOverlayOpen = signal<boolean>(false);
  protected readonly isOverlayAttached = signal<boolean>(false);
  protected readonly cdkConnectedOverlayScrollStrategy = this.overlay.scrollStrategies.close();

  protected readonly overlayPositions = computed<ConnectedPosition[]>(() => [
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
    this.isOverlayAttached.set(true);
    this.isOverlayOpen.set(true);
  }

  protected closeOverlay(): void {
    this.isOverlayOpen.set(false);
  }

  protected onOverlayClosed(): void {
    if (!this.isOverlayOpen()) {
      this.isOverlayAttached.set(false);
    }
  }

  protected detachOverlay(): void {
    this.isOverlayAttached.set(false);
  }
}
