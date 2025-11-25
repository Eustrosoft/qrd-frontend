import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CardContainerComponent } from '@shared/components/card-container/card-container.component';
import { EllipsisDirective } from '@shared/directives/ellipsis.directive';
import { FallbackPipe } from '@shared/pipe/fallback.pipe';
import { UiBadgeComponent } from '@ui/ui-badge/ui-badge.component';
import { UiGridBlockComponent } from '@ui/ui-grid-block/ui-grid-block.component';
import { createSelectMap } from '@ngxs/store';
import { AppRoutes } from '@app/app.constants';
import { RouteTitles, SharedLocalization } from '@shared/shared.constants';
import { NavigationStart, Router, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { Gs1Localization } from '@app/pages/gs1/gs1.constants';
import { QrCardsSelectors } from '@app/pages/qr-cards/state/qr-cards.selectors';
import { Gs1Selectors } from '@app/pages/gs1/state/gs1.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'qr-card-gs1',
  imports: [
    CardContainerComponent,
    EllipsisDirective,
    FallbackPipe,
    UiBadgeComponent,
    UiGridBlockComponent,
    RouterLink,
    MatButton,
    MatProgressSpinner,
  ],
  templateUrl: './qr-card-gs1.component.html',
  styleUrl: './qr-card-gs1.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrCardGs1Component {
  private readonly router = inject(Router);

  protected readonly AppRoutes = AppRoutes;
  protected readonly RouteTitles = RouteTitles;
  protected readonly Gs1Localization = Gs1Localization;
  protected readonly SharedLocalization = SharedLocalization;

  protected readonly currentlyNavigatingGs1Id = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationStart),
      map((event) => {
        const match = event.url.match(/\/gs1\/(\d+)(?:\/|$)/);
        return match ? Number(match[1]) : null;
      }),
    ),
  );

  protected readonly selectors = createSelectMap({
    qrCard: QrCardsSelectors.getSlices.qrCard,
    gs1LabelsState: QrCardsSelectors.getGs1LabelsState$,
    isGs1Loading: Gs1Selectors.getSlices.isGs1Loading,
  });
}
