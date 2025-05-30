import { UiIconComponent } from '@ui/ui-icon/ui-icon.component';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BackendError } from '@modules/error/error.models';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { MatIconButton } from '@angular/material/button';
import { ErrorsLocalization } from '@modules/error/error.constants';

@Component({
  selector: 'error-message-snackbar',
  imports: [UiIconComponent, UiFlexBlockComponent, MatIconButton],
  templateUrl: './error-message-snackbar.component.html',
  styleUrl: './error-message-snackbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorMessageSnackbarComponent {
  protected readonly errors = inject<BackendError[]>(MAT_SNACK_BAR_DATA);
  protected readonly matSnackBarRef = inject<MatSnackBarRef<ErrorMessageSnackbarComponent>>(MatSnackBarRef<ErrorMessageSnackbarComponent>);
  protected readonly ErrorsLocalization = ErrorsLocalization;
}
