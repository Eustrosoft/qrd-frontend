import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CardContainerComponent } from '@shared/components/card-container/card-container.component';
import { createSelectMap } from '@ngxs/store';
import { QrCardsState } from '@app/pages/qr-cards/state/qr-cards.state';
import { CardFieldComponent } from '@shared/components/card-field/card-field.component';
import { SharedLocalization } from '@shared/shared.constants';
import { UiGridBlockComponent } from '@ui/ui-grid-block/ui-grid-block.component';
import { IS_SMALL_SCREEN } from '@cdk/tokens/breakpoint.tokens';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { InteractionEffect } from '@shared/directives/text-interaction-effect.directive';

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
  ],
  templateUrl: './qr-card-main.component.html',
  styleUrl: './qr-card-main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrCardMainComponent {
  protected readonly isSmallScreen = inject(IS_SMALL_SCREEN);
  protected readonly selectors = createSelectMap({
    qrCard: QrCardsState.getQrCard$,
  });
  protected readonly SharedLocalization = SharedLocalization;

  protected readonly infoGridTemplateColumns = computed<string>(() => {
    if (this.isSmallScreen()) {
      return 'repeat(1, 1fr)';
    }
    return 'repeat(2, 1fr)';
  });
}
