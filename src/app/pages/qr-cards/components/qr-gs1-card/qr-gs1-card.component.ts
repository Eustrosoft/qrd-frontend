import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { CardContainerComponent } from '@shared/components/card-container/card-container.component';
import { CardFieldComponent } from '@shared/components/card-field/card-field.component';
import { FallbackPipe } from '@shared/pipe/fallback.pipe';
import { MatIconButton } from '@angular/material/button';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { UiGridBlockComponent } from '@ui/ui-grid-block/ui-grid-block.component';
import { DefaultConfig, SharedLocalization } from '@shared/shared.constants';
import { AppRoutes } from '@app/app.constants';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Gs1Dto } from '@api/gs1/gs1-api.models';
import { IS_XSMALL } from '@cdk/tokens/breakpoint.tokens';
import { RouterLink } from '@angular/router';
import { CopyButtonComponent } from '@shared/components/copy-button/copy-button.component';
import { InteractionEffect } from '@shared/directives/text-interaction-effect.directive';
import { Gs1GtinLinkPipe } from '@shared/pipe/gs1-gtin-link.pipe';
import { MatTooltip } from '@angular/material/tooltip';
import { HttpParams } from '@angular/common/http';
import { select } from '@ngxs/store';
import { AppSelectors } from '@app/state/app.selectors';
import { Gs1Localization } from '@app/pages/gs1/gs1.constants';
import { UpperCasePipe } from '@angular/common';

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
    CopyButtonComponent,
    InteractionEffect,
    MatTooltip,
    UpperCasePipe,
  ],
  templateUrl: './qr-gs1-card.component.html',
  styleUrl: './qr-gs1-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrGs1CardComponent {
  private readonly configState = select(AppSelectors.getConfigState$);
  private readonly gs1GtinLinkPipe = inject(Gs1GtinLinkPipe);

  protected readonly isXSmall = inject(IS_XSMALL);

  public readonly gs1 = input.required<Gs1Dto>();
  public readonly isNavigating = input<boolean>(false);
  public readonly isDeleting = input<boolean>(false);

  public readonly onRemove = output<void>();

  protected readonly AppRoutes = AppRoutes;
  protected readonly SharedLocalization = SharedLocalization;
  protected readonly Gs1Localization = Gs1Localization;

  protected readonly gridTemplateColumns = computed<string>(() => {
    if (this.isXSmall()) {
      return 'repeat(1, 1fr)';
    }
    return 'repeat(2, 1fr)';
  });

  protected readonly digitalLink = computed<string>(() =>
    this.gs1GtinLinkPipe.transform(this.gs1().gtin?.toString(), this.gs1().key, this.gs1().value, this.gs1().tail),
  );

  protected readonly printUrl = computed<string>(() => {
    const gs1 = this.gs1();
    const qrgenUri = this.configState().config.qrdConf?.qrgenLabelUri ?? DefaultConfig.qrdConf.qrgenLabelUri;
    const url = this.gs1GtinLinkPipe.transform(gs1.gtin?.toString(), gs1.key, gs1.value, gs1.tail);
    const params = new HttpParams({
      fromObject: {
        url: url,
        type: 'URL',
        PARAM_WIDTH: 300,
        PARAM_BACKGROUND: '#ffffff',
        PARAM_COLOR: '#000000',
        PARAM_CORRECTION_LEVEL: 'M',
        PARAM_FILE_TYPE: 'SVG',
        ACTION_GENERATE: 'y',
      },
    });
    return `${qrgenUri}?${params.toString()}`;
  });
}
