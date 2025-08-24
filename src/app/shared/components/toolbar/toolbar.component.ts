import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { IS_SMALL_SCREEN } from '@cdk/tokens/breakpoint.tokens';
import { Location } from '@angular/common';

@Component({
  selector: 'toolbar',
  imports: [MatIcon, MatMiniFabButton, UiFlexBlockComponent],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.with-action-buttons]': 'isActionButtonsShown()',
  },
})
export class ToolbarComponent {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly activatedRoute = inject(ActivatedRoute);
  protected readonly isSmallScreen = inject(IS_SMALL_SCREEN);

  // eslint-disable-next-line
  public readonly navigateTo = input<unknown[] | null>(null);
  public readonly isActionButtonsShown = input<boolean>(true);

  protected goBack(): void {
    if (this.navigateTo()) {
      this.router.navigate(this.navigateTo()!, { relativeTo: this.activatedRoute, replaceUrl: true });
      return;
    }
    this.location.back();
  }
}
