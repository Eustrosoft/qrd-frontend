import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { ERROR_CONFIG, ErrorButton, ErrorConfig } from '@cdk/tokens/error-config.token';
import { UiIconComponent } from '@ui/ui-icon/ui-icon.component';
import { MatButton } from '@angular/material/button';
import { IS_SMALL, IS_XSMALL } from '@cdk/tokens/breakpoint.tokens';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';

@Component({
  selector: 'error-page',
  imports: [UiIconComponent, MatButton, UiFlexBlockComponent],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorPageComponent implements OnInit, OnDestroy {
  protected readonly errorConfig: ErrorConfig = inject(ERROR_CONFIG);
  private readonly isXSmall = inject(IS_XSMALL);
  private readonly isSmall = inject(IS_SMALL);
  protected readonly isSmallScreen = computed<boolean>(() => this.isXSmall() || this.isSmall());

  public ngOnInit(): void {
    this.errorConfig.onInit?.call(this);
  }

  public ngOnDestroy(): void {
    this.errorConfig.onDestroy?.call(this);
  }

  protected onButtonClick(buttonAction: ErrorButton['buttonAction']): void {
    buttonAction?.call(this);
  }
}
