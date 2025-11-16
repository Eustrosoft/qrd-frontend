import { ChangeDetectionStrategy, Component, forwardRef, inject, input, output } from '@angular/core';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { SharedLocalization } from '@shared/shared.constants';
import { MatButton, MatIconButton } from '@angular/material/button';
import { ErrorsLocalization } from '@modules/error/error.constants';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatFormField, MatLabel } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { FileDto } from '@api/files/files-api.models';
import { DuplicateErrorHandler } from '@app/pages/files/files.models';
import { MatError } from '@angular/material/form-field';
import { DUPLICATE_ERROR_HANDLER_CMP } from '@cdk/tokens/custom-validator.token';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CustomValidationErrors } from '@shared/validators/validators.constants';

@Component({
  selector: 'file-selector',
  imports: [
    MatFormField,
    UiFlexBlockComponent,
    MatLabel,
    MatOption,
    MatButton,
    MatIconButton,
    MatIcon,
    MatProgressSpinner,
    MatFormField,
    MatSelect,
    MatError,
    ReactiveFormsModule,
  ],
  providers: [{ provide: DUPLICATE_ERROR_HANDLER_CMP, useExisting: forwardRef(() => FileSelectorComponent) }],
  templateUrl: './file-selector.component.html',
  styleUrl: './file-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileSelectorComponent implements DuplicateErrorHandler {
  private readonly fb = inject(FormBuilder);

  public readonly isFileListLoading = input.required<boolean>();
  public readonly isFileListLoadErr = input.required<boolean>();
  public readonly fileList = input.required<FileDto[]>();

  public readonly refreshClick = output<void>();
  public readonly attachClick = output<number[]>();
  public readonly selectedFilesChange = output<number[]>();

  protected readonly control = this.fb.nonNullable.control<number[]>([]);

  protected readonly SharedLocalization = SharedLocalization;
  protected readonly ErrorsLocalization = ErrorsLocalization;
  protected readonly CustomValidationErrors = CustomValidationErrors;

  public handleDuplicateError(errorText: string): void {
    this.control.setErrors({
      [CustomValidationErrors.DuplicatedFiles]: errorText,
    });
    this.control.markAsTouched();
  }
}
