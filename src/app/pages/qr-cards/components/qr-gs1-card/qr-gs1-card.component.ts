import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { CardContainerComponent } from '@shared/components/card-container/card-container.component';
import { CardFieldComponent } from '@shared/components/card-field/card-field.component';
import { FallbackPipe } from '@shared/pipe/fallback.pipe';
import { MatIconButton } from '@angular/material/button';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { UiGridBlockComponent } from '@ui/ui-grid-block/ui-grid-block.component';
import { SharedLocalization } from '@shared/shared.constants';
import { AppRoutes } from '@app/app.constants';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Gs1Dto } from '@api/gs/gs-api.models';
import { IS_XSMALL } from '@cdk/tokens/breakpoint.tokens';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'qr-gs1-card',
  imports: [
    CardContainerComponent,
    CardFieldComponent,
    FallbackPipe,
    MatIcon,
    MatIconButton,
    MatProgressSpinner,
    UiFlexBlockComponent,
    UiGridBlockComponent,
    RouterLink,
  ],
  templateUrl: './qr-gs1-card.component.html',
  styleUrl: './qr-gs1-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrGs1CardComponent {
  protected readonly isXSmall = inject(IS_XSMALL);

  public readonly gs1 = input.required<Gs1Dto>();
  public readonly isNavigating = input<boolean>(false);
  public readonly isDeleting = input<boolean>(false);

  public readonly onRemove = output<void>();

  protected readonly gridTemplateColumns = computed<string>(() => {
    if (this.isXSmall()) {
      return 'repeat(1, 1fr)';
    }
    return 'repeat(2, 1fr)';
  });

  protected readonly SharedLocalization = SharedLocalization;
  protected readonly AppRoutes = AppRoutes;
}
