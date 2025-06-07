import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { IS_SMALL_SCREEN } from '@cdk/tokens/breakpoint.tokens';
import { EllipsisDirective } from '@shared/directives/ellipsis.directive';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'view-list-item',
  imports: [MatCheckbox, UiFlexBlockComponent, MatIcon, MatIconButton, MatMenuTrigger, MatMenu],
  templateUrl: './view-list-item.component.html',
  styleUrl: './view-list-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [EllipsisDirective],
})
export class ViewListItemComponent {
  protected readonly isSmallScreen = inject(IS_SMALL_SCREEN);

  public readonly isSelected = input<boolean>(false);
  public readonly isPreviewShown = input<boolean>(false);
  public readonly title = input<string | number>('');

  public readonly checkboxChanged = output<boolean>();
}
