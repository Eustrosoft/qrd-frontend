import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  viewChild,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, Subject } from 'rxjs';
import { Actions, createDispatchMap, createSelectMap, ofActionSuccessful } from '@ngxs/store';
import { FileUploadState } from '@app/pages/files/components/file-upload/state/file-upload.state';
import {
  ClearFileUploadState,
  ResetFileUploadState,
  UpdateFileMetadata,
  UploadBlobByChunks,
} from '@app/pages/files/components/file-upload/state/file-upload.actions';
import { FileEditableMetadata } from '@api/files/file-api.models';
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
import { FileUploadFormFactoryService } from '@app/pages/files/components/file-upload/service/file-upload-form-factory.service';
import { FileUploadFormGroup } from '@app/pages/files/files.models';
import { UiGridBlockComponent } from '@ui/ui-grid-block/ui-grid-block.component';
import { IS_XSMALL } from '@cdk/tokens/breakpoint.tokens';
import { IndicatorComponent } from '@shared/components/indicator/indicator.component';

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
    UiGridBlockComponent,
    IndicatorComponent,
  ],
  templateUrl: './file-upload-blob.component.html',
  styleUrl: './file-upload-blob.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FileUploadFormFactoryService, { provide: ErrorStateMatcher, useClass: TouchedErrorStateMatcher }],
})
export class FileUploadBlobComponent implements OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly actions$ = inject(Actions);
  private readonly fileUploadFormFactoryService = inject(FileUploadFormFactoryService);

  private readonly startUpload$ = new Subject<void>();
  private readonly cancelUpload$ = new Subject<void>();

  protected readonly isXSmall = inject(IS_XSMALL);
  protected readonly gridCols = computed<string>(() => {
    if (this.isXSmall()) {
      return 'repeat(1, 1fr)';
    }
    return 'repeat(2, 1fr)';
  });

  protected readonly form = this.fileUploadFormFactoryService.fileUploadForm;
  protected readonly selectors = createSelectMap({
    isLoading: FileUploadState.isLoading$,
    uploadState: FileUploadState.getUploadState$,
  });
  protected readonly actions = createDispatchMap({
    uploadBlobByChunks: UploadBlobByChunks,
    updateFileMetadata: UpdateFileMetadata,
    clearFileUploadState: ClearFileUploadState,
    resetFileUploadState: ResetFileUploadState,
  });

  public readonly hasUnsavedChanges = this.fileUploadFormFactoryService.fileUploadFormHasUnsavedChanges;
  public readonly fileMetadata = input<FileEditableMetadata | null>(null);
  public readonly uploadCompleted = outputFromObservable(
    this.actions$.pipe(
      ofActionSuccessful(UploadBlobByChunks),
      map(() => this.selectors.uploadState()),
    ),
  );
  public readonly saveCompleted = outputFromObservable<void>(
    this.actions$.pipe(
      ofActionSuccessful(UpdateFileMetadata),
      map(() => undefined),
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

    this.fileUploadFormFactoryService.patchFileUploadForm(
      {
        name: metadata.name,
        description: metadata.description,
        isActive: metadata.isActive,
        isPublic: metadata.isPublic,
      },
      false,
    );
  });

  protected readonly fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');
  protected readonly FilesLocalization = FilesLocalization;
  protected readonly SharedLocalization = SharedLocalization;
  protected readonly ErrorsLocalization = ErrorsLocalization;
  protected readonly MAX_NAME_LENGTH = MAX_NAME_LENGTH;
  protected readonly MAX_DESCRIPTION_LENGTH = MAX_DESCRIPTION_LENGTH;

  protected fileChanged(): void {
    const fileList = Array.from(this.fileInput().nativeElement.files ?? []);
    if (!fileList.length) {
      return;
    }
    const file = fileList[0];
    this.fileUploadFormFactoryService.patchFileUploadForm({
      name: file.name,
      file,
    });
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
    this.fileUploadFormFactoryService.resetFileUploadForm();
    this.actions.resetFileUploadState();
  }

  private clearInput(): void {
    this.fileInput().nativeElement.files = new DataTransfer().files;
  }

  public getRawValue(): ReturnType<FileUploadFormGroup['getRawValue']> {
    return this.form.getRawValue();
  }

  public ngOnDestroy(): void {
    this.startUpload$.complete();
    this.cancelUpload$.next();
    this.cancelUpload$.complete();
    this.actions.clearFileUploadState();
    this.fileUploadFormFactoryService.dispose();
  }
}
