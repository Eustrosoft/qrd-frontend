import { ChangeDetectionStrategy, Component, computed, inject, inputBinding } from '@angular/core';
import { CardContainerComponent } from '@shared/components/card-container/card-container.component';
import { createSelectMap } from '@ngxs/store';
import { QrCardsState } from '@app/pages/qr-cards/state/qr-cards.state';
import { CardFieldComponent } from '@shared/components/card-field/card-field.component';
import { RouteTitles, SharedLocalization } from '@shared/shared.constants';
import { UiGridBlockComponent } from '@ui/ui-grid-block/ui-grid-block.component';
import { IS_SMALL_SCREEN, IS_XSMALL } from '@cdk/tokens/breakpoint.tokens';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { InteractionEffect } from '@shared/directives/text-interaction-effect.directive';
import { FileListItemComponent } from '@shared/components/file-list-item/file-list-item.component';
import { DatePipe } from '@angular/common';
import { BytesToSizePipe } from '@shared/pipe/bytes-to-size.pipe';
import { UiSidenavService } from '@ui/ui-sidenav/ui-sidenav.service';
import { QrViewComponent } from '@app/pages/qr-view/qr-view.component';
import { ToHexPipe } from '@shared/pipe/to-hex.pipe';
import { FallbackPipe } from '@shared/pipe/fallback.pipe';
import { AppRoutes } from '@app/app.constants';
import { CollapsibleContainerComponent } from '@shared/components/collapsible-container/collapsible-container.component';
import { CollapsibleListItemDirective } from '@shared/directives/collapsible-list-item.directive';
import { CollapsibleListDirective } from '@shared/directives/collapsible-list.directive';

@Component({
  selector: 'qr-card-main',
  imports: [
    CardContainerComponent,
    CardFieldComponent,
    UiGridBlockComponent,
    MatButton,
    MatIcon,
    RouterLink,
    InteractionEffect,
    FileListItemComponent,
    DatePipe,
    BytesToSizePipe,
    ToHexPipe,
    FallbackPipe,
    CollapsibleContainerComponent,
    CollapsibleListItemDirective,
    CollapsibleListDirective,
  ],
  templateUrl: './qr-card-main.component.html',
  styleUrl: './qr-card-main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrCardMainComponent {
  private readonly uiSidenavService = inject(UiSidenavService);
  protected readonly isXSmall = inject(IS_XSMALL);
  protected readonly isSmallScreen = inject(IS_SMALL_SCREEN);
  protected readonly selectors = createSelectMap({
    qrCard: QrCardsState.getQrCard$,
    qrCardPreviewUrl: QrCardsState.getQrCardPreviewUrl$,
  });

  protected readonly SharedLocalization = SharedLocalization;
  protected readonly RouteTitles = RouteTitles;
  protected readonly AppRoutes = AppRoutes;

  protected readonly infoGridTemplateColumns = computed<string>(() => {
    if (this.isSmallScreen()) {
      return 'repeat(1, 1fr)';
    }
    return 'repeat(2, 1fr)';
  });

  protected openCardPreview(): void {
    this.uiSidenavService.open(QrViewComponent, {
      bindings: [inputBinding('iframeSrc', this.selectors.qrCardPreviewUrl)],
      position: 'end',
      width: this.isXSmall() ? 'full' : 'sm',
      isFixed: true,
    });
  }
}
