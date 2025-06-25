import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CardContainerComponent } from '@shared/components/card-container/card-container.component';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { IS_SMALL_SCREEN } from '@cdk/tokens/breakpoint.tokens';
import { createSelectMap } from '@ngxs/store';
import { QrCardsState } from '@app/pages/qr-cards/state/qr-cards.state';
import { SharedLocalization } from '@shared/shared.constants';
import { AttrListItemComponent } from '@shared/components/attr-list-item/attr-list-item.component';

@Component({
  selector: 'qr-card-attrs',
  imports: [CardContainerComponent, UiFlexBlockComponent, AttrListItemComponent],
  templateUrl: './qr-card-attrs.component.html',
  styleUrl: './qr-card-attrs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrCardAttrsComponent {
  protected readonly isSmallScreen = inject(IS_SMALL_SCREEN);
  protected readonly selectors = createSelectMap({
    qrCard: QrCardsState.getQrCard$,
  });
  protected readonly SharedLocalization = SharedLocalization;
}
