import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatInput, MatSuffix } from '@angular/material/input';
import { SharedLocalization } from '@shared/shared.constants';
import { MatIcon } from '@angular/material/icon';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { MatButtonToggle, MatButtonToggleChange, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { IS_SMALL_SCREEN } from '@cdk/tokens/breakpoint.tokens';
import { DataViewDisplayType } from '@shared/shared.models';
import { ToggleVisibilityDirective } from '@shared/directives/toggle-visibility.directive';

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
    MatButtonToggle,
    MatButtonToggleGroup,
    ToggleVisibilityDirective,
  ],
  templateUrl: './data-view.component.html',
  styleUrl: './data-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataViewComponent {
  protected readonly isSmallScreen = inject(IS_SMALL_SCREEN);
  protected readonly SharedLocalization = SharedLocalization;

  public readonly searchValue = input<string>('');
  public readonly displayType = input<DataViewDisplayType>('list');

  public readonly searchValueChange = output<string>();
  public readonly displayTypeChange = output<MatButtonToggleChange>();
  public readonly searchClicked = output<void>();
  public readonly advancedSearchClicked = output<void>();
}
