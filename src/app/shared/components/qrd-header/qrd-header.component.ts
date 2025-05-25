import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatAnchor, MatIconButton } from '@angular/material/button';
import { UiIconComponent } from '@ui/ui-icon/ui-icon.component';
import { UiSidenavService } from '@ui/ui-sidenav/ui-sidenav.service';
import { NgOptimizedImage } from '@angular/common';
import { FlexBlockComponent } from '@shared/components/flex-block/flex-block.component';
import { IS_XSMALL } from '@cdk/tokens/breakpoint.tokens';
import { HeaderLocalization, SharedLocalization } from '@shared/shared.constants';
import { PaletteAnimationDirective } from '@cdk/directives/palette-animation.directive';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HeaderLink } from '@shared/components/qrd-header/qrd-header.models';

@Component({
  selector: 'qrd-header',
  imports: [MatIconButton, UiIconComponent, NgOptimizedImage, FlexBlockComponent, MatAnchor, PaletteAnimationDirective, RouterLink, RouterLinkActive],
  templateUrl: './qrd-header.component.html',
  styleUrl: './qrd-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrdHeaderComponent {
  private readonly uiSidenavService = inject(UiSidenavService);
  protected readonly isXSmall = inject(IS_XSMALL);

  protected readonly SharedLocalization = SharedLocalization;

  protected readonly linkList: HeaderLink[] = [
    {
      title: HeaderLocalization.CARDS,
      route: '/cards',
    },
    {
      title: HeaderLocalization.TEMPLATES,
      route: '/templates',
    },
    {
      title: HeaderLocalization.FILES,
      route: '/files',
    },
  ];

  protected openSidenavMenu(): void {
    this.uiSidenavService.open(UiIconComponent, { inputs: { icon: 'palette' }, width: 'full' });
  }
}
