import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { UiSkeletonComponent } from '@ui/ui-skeleton/ui-skeleton.component';
import { map, Subject } from 'rxjs';
import { Actions, createDispatchMap, createSelectMap, ofActionSuccessful } from '@ngxs/store';
import { FileUploadState } from '@app/pages/files/components/file-upload/state/file-upload.state';
import { AddFileUrl, UpdateFileMetadata } from '@app/pages/files/components/file-upload/state/file-upload.actions';
import { FileDto } from '@api/files/file-api.models';
import { SharedLocalization } from '@shared/shared.constants';
import { MatError } from '@angular/material/form-field';
import {
  FilesLocalization,
  MAX_DESCRIPTION_LENGTH,
  MAX_NAME_LENGTH,
  MAX_STORAGE_PATH_LENGTH,
} from '@app/pages/files/files.constants';
import { ErrorStateMatcher } from '@angular/material/core';
import { TouchedErrorStateMatcher } from '@cdk/classes/touched-error-state-matcher.class';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { FileUploadFormFactoryService } from '@app/pages/files/components/file-upload/service/file-upload-form-factory.service';

@Component({
  selector: 'file-as-url',
  imports: [
    FormsModule,
    MatButton,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    MatFormField,
    UiFlexBlockComponent,
    MatSlideToggle,
    UiSkeletonComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './file-as-url.component.html',
  styleUrl: './file-as-url.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: ErrorStateMatcher, useClass: TouchedErrorStateMatcher }],
})
export class FileAsUrlComponent implements OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly actions$ = inject(Actions);
  private readonly fileUploadFormFactoryService = inject(FileUploadFormFactoryService);

  private readonly startUpload$ = new Subject<void>();
  private readonly cancelUpload$ = new Subject<void>();

  protected readonly form = this.fileUploadFormFactoryService.fileAsUrlForm;
  protected readonly selectors = createSelectMap({
    isLoading: FileUploadState.isLoading$,
    uploadState: FileUploadState.getUploadState$,
  });
  protected readonly actions = createDispatchMap({
    addFileUrl: AddFileUrl,
    updateFileMetadata: UpdateFileMetadata,
  });

  public readonly fileMetadata = input<FileDto | null>(null);
  public readonly uploadCompleted = outputFromObservable(
    this.actions$.pipe(
      ofActionSuccessful(AddFileUrl),
      map(() => this.selectors.uploadState()),
    ),
  );

  protected readonly isLoadingEffect = effect(() => {
    if (this.selectors.isLoading()) {
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

    this.fileUploadFormFactoryService.patchFileAsUrlForm(
      {
        name: metadata.name,
        description: metadata.description,
        isActive: metadata.isActive,
        isPublic: metadata.isPublic,
        storagePath: metadata.storagePath,
      },
      false,
    );
  });

  protected readonly FilesLocalization = FilesLocalization;
  protected readonly SharedLocalization = SharedLocalization;
  protected readonly MAX_NAME_LENGTH = MAX_NAME_LENGTH;
  protected readonly MAX_DESCRIPTION_LENGTH = MAX_DESCRIPTION_LENGTH;
  protected readonly MAX_STORAGE_PATH_LENGTH = MAX_STORAGE_PATH_LENGTH;

  protected addFileUrl(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.actions.addFileUrl(this.form.getRawValue(), this.destroyRef);
  }

  protected save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.actions.updateFileMetadata(this.fileMetadata()!.id, this.form.getRawValue(), this.destroyRef);
  }

  public ngOnDestroy(): void {
    this.startUpload$.complete();
    this.cancelUpload$.complete();
    this.fileUploadFormFactoryService.resetFileAsUrlForm();
  }
}
