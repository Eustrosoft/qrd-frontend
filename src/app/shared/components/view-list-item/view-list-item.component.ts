import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { IS_SMALL_SCREEN } from '@cdk/tokens/breakpoint.tokens';
import { EllipsisDirective } from '@shared/directives/ellipsis.directive';
import { ActivatedRoute, RouterLink, UrlTree } from '@angular/router';
import { MoreMenuComponent } from '@shared/components/more-menu/more-menu.component';

@Component({
  selector: 'view-list-item',
  imports: [MatCheckbox, UiFlexBlockComponent, RouterLink, EllipsisDirective, MoreMenuComponent],
  templateUrl: './view-list-item.component.html',
  styleUrl: './view-list-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [EllipsisDirective],
})
export class ViewListItemComponent {
  protected readonly activatedRoute = inject(ActivatedRoute);

  protected readonly isSmallScreen = inject(IS_SMALL_SCREEN);

  public readonly isSelected = input<boolean>(false);
  public readonly isPreviewShown = input<boolean>(false);
  public readonly title = input<string | number>('');
  public readonly navigateTo = input<string | UrlTree | null | undefined>('./');

  public readonly checkboxChanged = output<boolean>();
}
