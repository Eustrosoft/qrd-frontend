import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ERROR_CONFIG, ErrorButton, ErrorConfig } from '@cdk/tokens/error-config.token';
import { FlexBlockComponent } from '@shared/components/flex-block/flex-block.component';
import { UiIconComponent } from '@ui/ui-icon/ui-icon.component';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'error-page',
  imports: [FlexBlockComponent, UiIconComponent, MatButton],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorPageComponent implements OnInit, OnDestroy {
  protected readonly errorConfig: ErrorConfig = inject(ERROR_CONFIG);

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
