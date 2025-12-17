import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject } from '@angular/core';
import { CardContainerComponent } from '@shared/components/card-container/card-container.component';
import { MatButton } from '@angular/material/button';
import { UiGridBlockComponent } from '@ui/ui-grid-block/ui-grid-block.component';
import { NavigationStart, Router, RouterLink } from '@angular/router';
import { IS_XSMALL } from '@cdk/tokens/breakpoint.tokens';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { createDispatchMap, createSelectMap } from '@ngxs/store';
import { QrCardsSelectors } from '@app/pages/qr-cards/state/qr-cards.selectors';
import { UnbindPCode } from '@app/pages/qr-cards/state/qr-cards.actions';
import { AppRoutes } from '@app/app.constants';
import { RouteTitles, SharedLocalization } from '@shared/shared.constants';
import { PCodesLocalization } from '@app/pages/p-codes/p-codes.constants';
import { PCodesSelectors } from '@app/pages/p-codes/state/p-codes.selectors';
import { QrPCodeCardComponent } from '@app/pages/qr-cards/components/qr-p-code-card/qr-p-code-card.component';

@Component({
  selector: 'qr-card-p-codes',
  imports: [CardContainerComponent, MatButton, UiGridBlockComponent, RouterLink, QrPCodeCardComponent],
  templateUrl: './qr-card-p-codes.component.html',
  styleUrl: './qr-card-p-codes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrCardPCodesComponent {
  private readonly router = inject(Router);

  protected readonly destroyRef = inject(DestroyRef);
  protected readonly isXSmall = inject(IS_XSMALL);

  protected readonly AppRoutes = AppRoutes;
  protected readonly RouteTitles = RouteTitles;
  protected readonly PCodesLocalization = PCodesLocalization;
  protected readonly SharedLocalization = SharedLocalization;

  protected readonly gridTemplateColumns = computed<string>(() => {
    if (this.isXSmall()) {
      return 'repeat(1, 1fr)';
    }
    return 'repeat(2, 1fr)';
  });

  protected readonly currentlyNavigatingPCodeId = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationStart),
      map((event) => {
        const match = event.url.match(/\/pins\/(\d+)(?:\/|$)/);
        return match ? Number(match[1]) : null;
      }),
    ),
  );

  protected readonly selectors = createSelectMap({
    qrCard: QrCardsSelectors.getSlices.qrCard,
    pCodesState: QrCardsSelectors.getPCodesState$,
    isPCodeLoading: PCodesSelectors.getSlices.isPCodeLoading,
    pCodeDeleteInProgressMap: QrCardsSelectors.getSlices.pCodeDeleteInProgressMap,
  });

  protected readonly actions = createDispatchMap({
    unbindPCode: UnbindPCode,
  });
}
