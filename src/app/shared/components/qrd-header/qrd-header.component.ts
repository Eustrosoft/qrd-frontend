import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatAnchor, MatIconButton } from '@angular/material/button';
import { UiSidenavService } from '@ui/ui-sidenav/ui-sidenav.service';
import { SharedLocalization } from '@shared/shared.constants';
import { PaletteAnimationDirective } from '@shared/directives/palette-animation.directive';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HeaderNavbarLink } from '@shared/components/qrd-header/qrd-header.models';
import { CdkConnectedOverlay, CdkOverlayOrigin, ConnectedPosition, Overlay } from '@angular/cdk/overlay';
import { ThemePickerOverlayComponent } from '@shared/components/theme-picker-overlay/theme-picker-overlay.component';
import { overlayAnimation } from '@shared/shared.animations';
import { HeaderLocalization } from '@shared/components/qrd-header/qrd-header.constants';
import { QrdLogoComponent } from '@shared/components/qrd-logo/qrd-logo.component';
import { MatListItem, MatNavList } from '@angular/material/list';
import { BottomNavbarComponent } from '@shared/components/bottom-navbar/bottom-navbar.component';
import { createSelectMap, select } from '@ngxs/store';
import { DictionaryRegistryState } from '@shared/state/dictionary-registry.state';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { AuthState } from '@modules/auth/state/auth.state';
import { IS_SMALL_SCREEN } from '@cdk/tokens/breakpoint.tokens';
import { MiniProfileInfoComponent } from '@modules/auth/components/mini-profile-info/mini-profile-info.component';
import { CreateMenuOverlayComponent } from '@shared/components/create-menu-overlay/create-menu-overlay.component';
import { MatIcon } from '@angular/material/icon';

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
    BottomNavbarComponent,
    UiFlexBlockComponent,
    MiniProfileInfoComponent,
    CreateMenuOverlayComponent,
    MatIcon,
  ],
  animations: [overlayAnimation],
  templateUrl: './qrd-header.component.html',
  styleUrl: './qrd-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrdHeaderComponent {
  private readonly overlay = inject(Overlay);
  private readonly uiSidenavService = inject(UiSidenavService);
  protected readonly isSmallScreen = inject(IS_SMALL_SCREEN);
  protected readonly selectors = createSelectMap({
    isAuthenticated: select(AuthState.isAuthenticated$),
    navbarLinks: select(DictionaryRegistryState.getDictionary$<HeaderNavbarLink>('headerNavbarLinks')),
  });

  protected readonly HeaderLocalization = HeaderLocalization;
  protected readonly SharedLocalization = SharedLocalization;

  protected readonly actionsFlexGapSize = computed<string>(() => {
    if (this.isSmallScreen()) {
      return '8';
    }
    return '16';
  });

  protected readonly isThemeOverlayOpen = signal<boolean>(false);
  protected readonly themeOverlayScrollStrategy = this.overlay.scrollStrategies.close();
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
  protected readonly createOverlayScrollStrategy = this.overlay.scrollStrategies.close();

  protected openThemeOverlay(): void {
    this.isThemeOverlayOpen.set(true);
  }

  protected closeThemeOverlay(): void {
    this.isThemeOverlayOpen.set(false);
  }

  protected openCreateOverlay(): void {
    this.isCreateOverlayOpen.set(true);
  }

  protected closeCreateOverlay(): void {
    this.isCreateOverlayOpen.set(false);
  }

  protected openSidenavMenu(): void {
    this.uiSidenavService.open(CreateMenuOverlayComponent);
  }
}
