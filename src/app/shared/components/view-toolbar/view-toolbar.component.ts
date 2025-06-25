import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, RouterLink, UrlTree } from '@angular/router';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { IS_SMALL_SCREEN } from '@cdk/tokens/breakpoint.tokens';

@Component({
  selector: 'view-toolbar',
  imports: [MatIcon, MatMiniFabButton, RouterLink, UiFlexBlockComponent],
  templateUrl: './view-toolbar.component.html',
  styleUrl: './view-toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewToolbarComponent {
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly isSmallScreen = inject(IS_SMALL_SCREEN);

  public readonly navigateTo = input<string | UrlTree | null | undefined>('../');
}
