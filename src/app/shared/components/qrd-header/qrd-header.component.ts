import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatAnchor, MatIconButton } from '@angular/material/button';
import { UiIconComponent } from '@ui/ui-icon/ui-icon.component';
import { UiSidenavService } from '@ui/ui-sidenav/ui-sidenav.service';
import { FlexBlockComponent } from '@shared/components/flex-block/flex-block.component';
import { IS_SMALL, IS_XSMALL } from '@cdk/tokens/breakpoint.tokens';
import { SharedLocalization } from '@shared/shared.constants';
import { PaletteAnimationDirective } from '@cdk/directives/palette-animation.directive';
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

@Component({
  selector: 'qrd-header',
  imports: [
    MatIconButton,
    UiIconComponent,
    FlexBlockComponent,
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
  ],
  animations: [overlayAnimation],
  templateUrl: './qrd-header.component.html',
  styleUrl: './qrd-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrdHeaderComponent {
  private readonly overlay = inject(Overlay);
  private readonly uiSidenavService = inject(UiSidenavService);
  private readonly isXSmall = inject(IS_XSMALL);
  private readonly isSmall = inject(IS_SMALL);
  protected readonly isSmallScreen = computed<boolean>(() => this.isXSmall() || this.isSmall());
  protected readonly selectors = createSelectMap({
    navbarLinks: select(DictionaryRegistryState.getDictionary$<HeaderNavbarLink>('headerNavbarLinks')),
  });

  protected readonly HeaderLocalization = HeaderLocalization;
  protected readonly SharedLocalization = SharedLocalization;

  protected readonly isOverlayOpen = signal<boolean>(false);
  protected readonly cdkConnectedOverlayScrollStrategy = this.overlay.scrollStrategies.close();

  protected readonly OVERLAY_POSITIONS: ConnectedPosition[] = [
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
      offsetY: 24,
      offsetX: 16,
    },
  ];

  protected openOverlay(): void {
    this.isOverlayOpen.set(true);
  }

  protected closeOverlay(): void {
    this.isOverlayOpen.set(false);
  }

  protected openSidenavMenu(): void {
    this.uiSidenavService.open(UiIconComponent, { inputs: { icon: 'cringe', width: '300', height: '300' }, width: 'full' });
  }
}
