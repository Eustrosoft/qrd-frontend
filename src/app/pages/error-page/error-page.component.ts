import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ERROR_CONFIG, ErrorConfig } from '@cdk/tokens/error-config.token';
import { IS_SMALL_SCREEN } from '@cdk/tokens/breakpoint.tokens';
import { BannerComponent } from '@shared/components/banner/banner.component';

@Component({
  selector: 'error-page',
  imports: [BannerComponent],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorPageComponent implements OnInit, OnDestroy {
  protected readonly errorConfig = inject<ErrorConfig>(ERROR_CONFIG);
  protected readonly isSmallScreen = inject(IS_SMALL_SCREEN);

  public ngOnInit(): void {
    this.errorConfig.onInit?.call(this);
  }

  public ngOnDestroy(): void {
    this.errorConfig.onDestroy?.call(this);
  }
}
