import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { CardContainerComponent } from '@shared/components/card-container/card-container.component';
import { CardFieldComponent } from '@shared/components/card-field/card-field.component';
import { MatIconButton } from '@angular/material/button';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { UiGridBlockComponent } from '@ui/ui-grid-block/ui-grid-block.component';
import { IS_XSMALL } from '@cdk/tokens/breakpoint.tokens';
import { SharedLocalization } from '@shared/shared.constants';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { AppRoutes } from '@app/app.constants';
import { MappedPCodeDto } from '@api/p-codes/p-codes-api.models';
import { PCodesLocalization } from '@app/pages/p-codes/p-codes.constants';
import { MatTooltip } from '@angular/material/tooltip';
import { FallbackPipe } from '@shared/pipe/fallback.pipe';
import { MaskedPipe } from '@shared/pipe/masked.pipe';

@Component({
  selector: 'qr-p-code-card',
  imports: [
    CardContainerComponent,
    CardFieldComponent,
    MatIcon,
    MatIconButton,
    MatProgressSpinner,
    UiFlexBlockComponent,
    UiGridBlockComponent,
    MatTooltip,
    RouterLink,
    FallbackPipe,
    MaskedPipe,
  ],
  templateUrl: './qr-p-code-card.component.html',
  styleUrl: './qr-p-code-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrPCodeCardComponent {
  protected readonly isXSmall = inject(IS_XSMALL);

  public readonly idx = input.required<number>();
  public readonly pCode = input.required<MappedPCodeDto>();
  public readonly isNavigating = input<boolean>(false);
  public readonly isDeleting = input<boolean>(false);

  public readonly onRemove = output<void>();

  protected readonly AppRoutes = AppRoutes;
  protected readonly PCodesLocalization = PCodesLocalization;
  protected readonly SharedLocalization = SharedLocalization;

  protected readonly isPShown = signal(false);
  protected readonly isP2Shown = signal(false);

  protected readonly gridTemplateColumns = computed<string>(() => {
    if (this.isXSmall()) {
      return 'repeat(1, 1fr)';
    }
    return 'repeat(2, 1fr)';
  });
}
