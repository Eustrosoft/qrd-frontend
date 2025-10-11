import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatAnchor, MatButton, MatIconButton } from '@angular/material/button';
import { UiSidenavService } from '@ui/ui-sidenav/ui-sidenav.service';
import { SharedLocalization } from '@shared/shared.constants';
import { PaletteAnimationDirective } from '@shared/directives/palette-animation.directive';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CdkConnectedOverlay, CdkOverlayOrigin, ConnectedPosition, Overlay } from '@angular/cdk/overlay';
import { ThemePickerOverlayComponent } from '@shared/components/theme-picker-overlay/theme-picker-overlay.component';
import { QrdLogoComponent } from '@shared/components/qrd-logo/qrd-logo.component';
import { MatListItem, MatNavList } from '@angular/material/list';
import { createSelectMap } from '@ngxs/store';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { IS_SMALL_SCREEN } from '@cdk/tokens/breakpoint.tokens';
import { MiniProfileInfoComponent } from '@modules/auth/components/mini-profile-info/mini-profile-info.component';
import { CreateMenuOverlayComponent } from '@shared/components/create-menu-overlay/create-menu-overlay.component';
import { MatIcon } from '@angular/material/icon';
import { OverlayAnimationDirective } from '@shared/directives/overlay-animation.directive';
import { LeftSidenavComponent } from '@shared/components/left-sidenav/left-sidenav.component';
import { HeaderLocalization } from '@shared/components/qrd-header/qrd-header.constants';
import { AppSelectors } from '@app/state/app.selectors';
import { AuthSelectors } from '@modules/auth/state/auth.selectors';

@Component({
  selector: 'qrd-header',
  imports: [
    MatIconButton,
    MatAnchor,
    PaletteAnimationDirective,
    RouterLink,
    RouterLinkActive,
    CdkOverlayOrigin,
    CdkConnectedOverlay,
    ThemePickerOverlayComponent,
    QrdLogoComponent,
    MatNavList,
    MatListItem,
    UiFlexBlockComponent,
    MiniProfileInfoComponent,
    CreateMenuOverlayComponent,
    MatIcon,
    OverlayAnimationDirective,
    MatButton,
  ],
  templateUrl: './qrd-header.component.html',
  styleUrl: './qrd-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.no-auth]': '!selectors.isAuthenticated()',
  },
})
export class QrdHeaderComponent {
  private readonly overlay = inject(Overlay);
  private readonly uiSidenavService = inject(UiSidenavService);
  protected readonly isSmallScreen = inject(IS_SMALL_SCREEN);
  protected readonly selectors = createSelectMap({
    isAuthenticated: AuthSelectors.getSlices.isAuthenticated,
    layoutConfigState: AppSelectors.getLayoutConfigState$,
  });

  protected readonly HeaderLocalization = HeaderLocalization;
  protected readonly SharedLocalization = SharedLocalization;

  protected readonly actionsFlexGapSize = computed<string>(() => {
    if (this.isSmallScreen()) {
      return '8';
    }
    return '16';
  });

  protected readonly overlayPositions = computed<ConnectedPosition[]>(() => [
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
      offsetY: 24,
      offsetX: this.isSmallScreen() ? 96 : 16,
    },
  ]);

  protected readonly isCreateOverlayOpen = signal<boolean>(false);
  protected readonly isCreateOverlayAttached = signal<boolean>(false);
  protected readonly createOverlayScrollStrategy = this.overlay.scrollStrategies.close();

  protected readonly isThemeOverlayOpen = signal<boolean>(false);
  protected readonly isThemeOverlayAttached = signal<boolean>(false);
  protected readonly themeOverlayScrollStrategy = this.overlay.scrollStrategies.close();

  protected openCreateOverlay(): void {
    this.isCreateOverlayAttached.set(true);
    this.isCreateOverlayOpen.set(true);
  }

  protected closeCreateOverlay(): void {
    this.isCreateOverlayOpen.set(false);
  }

  protected onCreateOverlayClosed(): void {
    if (!this.isCreateOverlayOpen()) {
      this.isCreateOverlayAttached.set(false);
    }
  }

  protected detachCreateOverlay(): void {
    this.isCreateOverlayAttached.set(false);
  }

  protected openThemeOverlay(): void {
    this.isThemeOverlayAttached.set(true);
    this.isThemeOverlayOpen.set(true);
  }

  protected closeThemeOverlay(): void {
    this.isThemeOverlayOpen.set(false);
  }

  protected onThemeOverlayClosed(): void {
    if (!this.isThemeOverlayOpen()) {
      this.isThemeOverlayAttached.set(false);
    }
  }

  protected detachThemeOverlay(): void {
    this.isThemeOverlayAttached.set(false);
  }

  protected openSidenavMenu(): void {
    this.uiSidenavService.open(LeftSidenavComponent, {
      position: 'start',
      width: 'full',
    });
  }
}
