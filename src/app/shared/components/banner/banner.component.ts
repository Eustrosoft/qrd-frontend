import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { GenericButton, Icon } from '@app/app.models';
import { MatButton } from '@angular/material/button';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { IS_SMALL_SCREEN } from '@cdk/tokens/breakpoint.tokens';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'banner',
  imports: [MatButton, UiFlexBlockComponent, MatIcon],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerComponent {
  protected readonly isSmallScreen = inject(IS_SMALL_SCREEN);

  public readonly title = input<string>('');
  public readonly message = input<string>('');
  public readonly buttonList = input<GenericButton[]>([]);
  public readonly icon = input<Icon>('unknown-err');

  protected onButtonClick(buttonAction: GenericButton['buttonAction']): void {
    buttonAction?.call(this);
  }
}
