import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CardContainerComponent } from '@shared/components/card-container/card-container.component';
import { createSelectMap } from '@ngxs/store';
import { QrCardsState } from '@app/pages/qr-cards/state/qr-cards.state';
import { CardFieldComponent } from '@shared/components/card-field/card-field.component';
import { RouteTitles, SharedLocalization } from '@shared/shared.constants';
import { UiGridBlockComponent } from '@ui/ui-grid-block/ui-grid-block.component';
import { IS_SMALL_SCREEN } from '@cdk/tokens/breakpoint.tokens';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { InteractionEffect } from '@shared/directives/text-interaction-effect.directive';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { FileListItemComponent } from '@shared/components/file-list-item/file-list-item.component';
import { DatePipe } from '@angular/common';
import { BytesToSizePipe } from '@shared/pipe/bytes-to-size.pipe';
import { UiSidenavService } from '@ui/ui-sidenav/ui-sidenav.service';
import { QrViewComponent } from '@app/pages/qr-view/qr-view.component';
import { ToHexPipe } from '@shared/pipe/to-hex.pipe';

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
    UiFlexBlockComponent,
    FileListItemComponent,
    DatePipe,
    BytesToSizePipe,
    ToHexPipe,
  ],
  templateUrl: './qr-card-main.component.html',
  styleUrl: './qr-card-main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrCardMainComponent {
  private readonly uiSidenavService = inject(UiSidenavService);
  protected readonly isSmallScreen = inject(IS_SMALL_SCREEN);
  protected readonly selectors = createSelectMap({
    qrCard: QrCardsState.getQrCard$,
  });

  protected readonly SharedLocalization = SharedLocalization;
  protected readonly RouteTitles = RouteTitles;

  protected readonly infoGridTemplateColumns = computed<string>(() => {
    if (this.isSmallScreen()) {
      return 'repeat(1, 1fr)';
    }
    return 'repeat(2, 1fr)';
  });

  protected openCardPreview(): void {
    this.uiSidenavService.open(QrViewComponent, {
      position: 'end',
    });
  }
}
