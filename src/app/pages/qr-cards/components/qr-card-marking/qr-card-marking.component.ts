import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CardContainerComponent } from '@shared/components/card-container/card-container.component';
import { EllipsisDirective } from '@shared/directives/ellipsis.directive';
import { FallbackPipe } from '@shared/pipe/fallback.pipe';
import { UiBadgeComponent } from '@ui/ui-badge/ui-badge.component';
import { UiGridBlockComponent } from '@ui/ui-grid-block/ui-grid-block.component';
import { createSelectMap } from '@ngxs/store';
import { AppRoutes } from '@app/app.constants';
import { RouteTitles, SharedLocalization } from '@shared/shared.constants';
import { RouterLink } from '@angular/router';
import { MarkingsSelectors } from '@app/pages/markings/state/markings.selectors';
import { JsonPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MarkingsLocalization } from '@app/pages/markings/markings.constants';
import { QrCardsSelectors } from '@app/pages/qr-cards/state/qr-cards.selectors';

@Component({
  selector: 'qr-card-marking',
  imports: [
    CardContainerComponent,
    EllipsisDirective,
    FallbackPipe,
    UiBadgeComponent,
    UiGridBlockComponent,
    RouterLink,
    JsonPipe,
    MatButton,
  ],
  templateUrl: './qr-card-marking.component.html',
  styleUrl: './qr-card-marking.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrCardMarkingComponent {
  protected readonly AppRoutes = AppRoutes;
  protected readonly RouteTitles = RouteTitles;
  protected readonly MarkingsLocalization = MarkingsLocalization;
  protected readonly SharedLocalization = SharedLocalization;

  protected readonly selectors = createSelectMap({
    qrCard: QrCardsSelectors.getSlices.qrCard,
    gs1ListState: MarkingsSelectors.getGs1ListState$,
  });
}
