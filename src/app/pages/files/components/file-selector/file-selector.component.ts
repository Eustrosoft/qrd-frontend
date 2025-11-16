import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { SharedLocalization } from '@shared/shared.constants';
import { MatButton, MatIconButton } from '@angular/material/button';
import { ErrorsLocalization } from '@modules/error/error.constants';
import { MatOptgroup, MatOption, MatSelect, MatSuffix } from '@angular/material/select';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { FileDto, HidableFileDto } from '@api/files/files-api.models';
import { DuplicateErrorHandler } from '@app/pages/files/files.models';
import { MatError } from '@angular/material/form-field';
import { DUPLICATE_ERROR_HANDLER_CMP } from '@cdk/tokens/custom-validator.token';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CustomValidationErrors } from '@shared/validators/validators.constants';
import { StopMaterialEventsDirective } from '@shared/directives/stop-material-events.directive';
import { toSignal } from '@angular/core/rxjs-interop';
import { animationFrameScheduler, first, of, scheduled, startWith } from 'rxjs';

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
    StopMaterialEventsDirective,
    MatInput,
    MatOptgroup,
    MatSuffix,
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
  public readonly showSearch = input<boolean>(true);

  public readonly refreshClick = output<void>();
  public readonly attachClick = output<FileDto[]>();
  public readonly selectedFilesChange = output<FileDto[]>();

  protected readonly control = this.fb.nonNullable.control<FileDto[]>([]);
  protected readonly controlValue = toSignal(this.control.valueChanges.pipe(startWith([])), { requireSync: true });

  protected readonly searchControl = this.fb.nonNullable.control('');
  protected readonly searchValue = toSignal(this.searchControl.valueChanges.pipe(startWith('')), { requireSync: true });
  protected readonly searchInput = viewChild.required<ElementRef<HTMLInputElement>>('searchInput');

  protected readonly filteredList = computed<HidableFileDto[]>(() => {
    const fileList = this.fileList();
    const searchValue = this.searchValue();
    return fileList.map((item) => ({
      ...item,
      hidden: !item.name.toLowerCase().includes(searchValue.toLowerCase()),
    }));
  });

  protected readonly isAllHidden = computed<boolean>(() => {
    const filteredList = this.filteredList();
    return filteredList.every((item) => item.hidden);
  });

  protected readonly hasSelectedValues = computed<boolean>(() => !!this.controlValue().length);

  protected readonly SharedLocalization = SharedLocalization;
  protected readonly ErrorsLocalization = ErrorsLocalization;
  protected readonly CustomValidationErrors = CustomValidationErrors;

  public handleDuplicateError(errorText: string): void {
    this.control.setErrors({
      [CustomValidationErrors.DuplicatedFiles]: errorText,
    });
    this.control.markAsTouched();
  }

  protected selectOpened(): void {
    scheduled(of(null), animationFrameScheduler)
      .pipe(first())
      .subscribe({
        next: () => {
          !this.hasSelectedValues() && this.searchInput().nativeElement.focus();
        },
      });
  }

  protected selectClosed(): void {
    this.searchControl.setValue('');
  }
}
