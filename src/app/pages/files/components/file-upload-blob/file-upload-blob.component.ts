import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  viewChild,
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, Subject } from 'rxjs';
import { Actions, createDispatchMap, createSelectMap, ofActionSuccessful } from '@ngxs/store';
import { FileUploadState } from '@app/pages/files/components/file-upload/state/file-upload.state';
import {
  ResetFileUploadState,
  UpdateFileMetadata,
  UploadBlobByChunks,
} from '@app/pages/files/components/file-upload/state/file-upload.actions';
import { FileUploadForm } from '@app/pages/files/files.models';
import { FileDto } from '@api/files/file-api.models';
import { SharedLocalization } from '@shared/shared.constants';
import { FilesLocalization, MAX_DESCRIPTION_LENGTH, MAX_NAME_LENGTH } from '@app/pages/files/files.constants';
import { EllipsisDirective } from '@shared/directives/ellipsis.directive';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { UiSkeletonComponent } from '@ui/ui-skeleton/ui-skeleton.component';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { ErrorStateMatcher } from '@angular/material/core';
import { TouchedErrorStateMatcher } from '@cdk/classes/touched-error-state-matcher.class';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { ErrorsLocalization } from '@modules/error/error.constants';

@Component({
  selector: 'file-upload-blob',
  imports: [
    EllipsisDirective,
    FormsModule,
    MatButton,
    MatError,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    UiSkeletonComponent,
    UiFlexBlockComponent,
    MatSlideToggle,
    MatError,
    MatFormField,
    ReactiveFormsModule,
    MatProgressSpinner,
    MatTooltip,
  ],
  templateUrl: './file-upload-blob.component.html',
  styleUrl: './file-upload-blob.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: ErrorStateMatcher, useClass: TouchedErrorStateMatcher }],
})
export class FileUploadBlobComponent implements OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  private readonly actions$ = inject(Actions);
  private readonly startUpload$ = new Subject<void>();
  private readonly cancelUpload$ = new Subject<void>();

  protected readonly selectors = createSelectMap({
    isLoading: FileUploadState.isLoading$,
    uploadState: FileUploadState.getUploadState$,
  });
  protected readonly actions = createDispatchMap({
    uploadBlobByChunks: UploadBlobByChunks,
    updateFileMetadata: UpdateFileMetadata,
    resetFileUploadState: ResetFileUploadState,
  });

  public readonly fileMetadata = input<FileDto | null>(null);
  public readonly uploadCompleted = outputFromObservable(
    this.actions$.pipe(
      ofActionSuccessful(UploadBlobByChunks),
      map(() => this.selectors.uploadState()),
    ),
  );

  protected readonly isLoadingEffect = effect(() => {
    if (this.selectors.uploadState()?.isLoading || this.selectors.isLoading()) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  });

  protected readonly fileMetadataEffect = effect(() => {
    const metadata = this.fileMetadata();
    if (!metadata) {
      return;
    }
    this.form.controls.file.removeValidators(Validators.required);
    this.form.controls.file.updateValueAndValidity();

    this.form.patchValue({
      name: metadata.name,
      description: metadata.description,
      isActive: metadata.isActive,
      isPublic: metadata.isPublic,
    });
  });

  protected readonly fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');
  protected readonly FilesLocalization = FilesLocalization;
  protected readonly SharedLocalization = SharedLocalization;
  protected readonly ErrorsLocalization = ErrorsLocalization;
  protected readonly MAX_NAME_LENGTH = MAX_NAME_LENGTH;
  protected readonly MAX_DESCRIPTION_LENGTH = MAX_DESCRIPTION_LENGTH;

  protected readonly form = this.fb.group<FileUploadForm>({
    name: this.fb.nonNullable.control<string>('', [Validators.required, Validators.maxLength(MAX_NAME_LENGTH)]),
    description: this.fb.nonNullable.control<string>('', [Validators.maxLength(MAX_DESCRIPTION_LENGTH)]),
    isActive: this.fb.nonNullable.control<boolean>(false),
    isPublic: this.fb.nonNullable.control<boolean>(false),
    file: this.fb.control<File | null>(null, [Validators.required]),
  });

  protected fileChanged(): void {
    const fileList = Array.from(this.fileInput().nativeElement.files ?? []);
    if (!fileList.length) {
      return;
    }
    const file = fileList[0];
    this.form.controls.name.patchValue(file.name);
    this.form.controls.file.patchValue(file);
  }

  protected uploadFile(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.actions.uploadBlobByChunks(this.form.getRawValue(), this.cancelUpload$.asObservable());
  }

  protected updateMetadata(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.actions.updateFileMetadata(this.fileMetadata()!.id, this.form.getRawValue(), this.destroyRef);
  }

  protected cancelFile(): void {
    this.cancelUpload$.next();
    this.clearInput();
    this.form.controls.file.reset();
    this.form.controls.name.reset();
    this.actions.resetFileUploadState();
  }

  private clearInput(): void {
    this.fileInput().nativeElement.files = new DataTransfer().files;
  }

  public ngOnDestroy(): void {
    this.startUpload$.complete();
    this.cancelUpload$.next();
    this.cancelUpload$.complete();
  }
}
