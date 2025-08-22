import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatInput, MatSuffix } from '@angular/material/input';
import { SharedLocalization } from '@shared/shared.constants';
import { MatIcon } from '@angular/material/icon';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { IS_SMALL_SCREEN } from '@cdk/tokens/breakpoint.tokens';
import { ToggleVisibilityDirective } from '@shared/directives/toggle-visibility.directive';
import { UiGridBlockComponent } from '@ui/ui-grid-block/ui-grid-block.component';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';

@Component({
  selector: 'data-view',
  imports: [
    FormsModule,
    MatFormField,
    MatSuffix,
    MatInput,
    MatIcon,
    MatIconButton,
    UiFlexBlockComponent,
    MatFabButton,
    ToggleVisibilityDirective,
    UiGridBlockComponent,
    RouterLinkActive,
    RouterLink,
    MatTabLink,
    MatTabNav,
    MatTabNavPanel,
  ],
  templateUrl: './data-view.component.html',
  styleUrl: './data-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataViewComponent {
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly isSmallScreen = inject(IS_SMALL_SCREEN);
  protected readonly SharedLocalization = SharedLocalization;

  public readonly searchValue = input<string>('');

  public readonly searchValueChange = output<string>();
  public readonly searchClicked = output<void>();
  public readonly advancedSearchClicked = output<void>();
}
