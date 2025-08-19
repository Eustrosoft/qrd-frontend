import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, OnInit, viewChild } from '@angular/core';
import { CardContainerComponent } from '@shared/components/card-container/card-container.component';
import { Actions, createDispatchMap, createSelectMap, ofActionErrored, ofActionSuccessful } from '@ngxs/store';
import { FilesState } from '@app/pages/files/state/files.state';
import { ActivatedRoute, Router } from '@angular/router';
import { FetchFile } from '@app/pages/files/state/files.actions';
import { UiSkeletonComponent } from '@ui/ui-skeleton/ui-skeleton.component';
import { UploadState } from '@app/pages/files/files.models';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { CanComponentDeactivate } from '@shared/guards/unsaved-data.guard';
import { map, merge, Observable, of } from 'rxjs';
import {
  ResetFileUploadState,
  SetFileAttachmentMode,
  UpdateFileMetadata,
} from '@app/pages/files/components/file-upload/state/file-upload.actions';
import { FileUploadState } from '@app/pages/files/components/file-upload/state/file-upload.state';
import { FileAsUrlComponent } from '@app/pages/files/components/file-upload/file-as-url/file-as-url.component';
import { FileUploadBlobComponent } from '@app/pages/files/components/file-upload/file-upload-blob/file-upload-blob.component';
import { FileAttachmentModeComponent } from '@app/pages/files/components/file-upload/file-attachment-mode/file-attachment-mode.component';
import { TemplatesLocalization } from '@app/pages/templates/templates.constants';
import { IS_XSMALL } from '@cdk/tokens/breakpoint.tokens';
import { EllipsisDirective } from '@shared/directives/ellipsis.directive';

@Component({
  selector: 'file-edit',
  imports: [
    CardContainerComponent,
    UiSkeletonComponent,
    ToolbarComponent,
    FileAsUrlComponent,
    FileUploadBlobComponent,
    FileAttachmentModeComponent,
    EllipsisDirective,
  ],
  templateUrl: './file-edit.component.html',
  styleUrl: './file-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileEditComponent implements OnInit, CanComponentDeactivate {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly actions$ = inject(Actions);
  protected readonly isXSmall = inject(IS_XSMALL);

  protected readonly fileId = this.activatedRoute.snapshot.paramMap.get('id');
  protected readonly fileUploadBlobCmp = viewChild(FileUploadBlobComponent);
  protected readonly fileAsUrlCmp = viewChild(FileAsUrlComponent);

  protected readonly fileEff = effect(() => {
    if (this.selectors.file()?.storagePath) {
      this.actions.setFileAttachmentMode('fileUrl');
    } else {
      this.actions.setFileAttachmentMode('upload');
    }
  });

  protected readonly selectors = createSelectMap({
    fileAttachmentMode: FileUploadState.getFileAttachmentMode$,
    isLoading: FileUploadState.isLoading$,
    uploadState: FileUploadState.getUploadState$,
    isFileLoading: FilesState.isFileLoading$,
    file: FilesState.getFile$,
    isFileDownloading: FilesState.isFileDownloading$,
  });
  protected readonly actions = createDispatchMap({
    fetchFile: FetchFile,
    updateFileMetadata: UpdateFileMetadata,
    setFileAttachmentMode: SetFileAttachmentMode,
    resetFileUploadState: ResetFileUploadState,
  });

  public ngOnInit(): void {
    if (this.fileId) {
      this.actions.fetchFile(+this.fileId, this.destroyRef);
    }
  }

  public isDataSaved(): boolean {
    if (this.selectors.fileAttachmentMode() === 'upload') {
      return !this.fileUploadBlobCmp()?.hasUnsavedChanges();
    }
    if (this.selectors.fileAttachmentMode() === 'fileUrl') {
      return !this.fileAsUrlCmp()?.hasUnsavedChanges();
    }
    return false;
  }

  public canDeactivate(isConfirmed?: boolean): Observable<boolean> {
    if (isConfirmed === undefined) {
      return of(false);
    }

    if (isConfirmed) {
      if (this.selectors.fileAttachmentMode() === 'upload') {
        this.actions.updateFileMetadata(+this.fileId!, this.fileUploadBlobCmp()?.getRawValue()!, this.destroyRef);
      }
      if (this.selectors.fileAttachmentMode() === 'fileUrl') {
        this.actions.updateFileMetadata(+this.fileId!, this.fileAsUrlCmp()?.getRawValue()!, this.destroyRef);
      }
      return merge(
        this.actions$.pipe(
          ofActionSuccessful(UpdateFileMetadata),
          map(() => true),
        ),
        this.actions$.pipe(
          ofActionErrored(UpdateFileMetadata),
          map(() => false),
        ),
      );
    }

    return of(true);
  }

  protected goToView(uploadState: UploadState | null): void {
    if (uploadState?.isCancelled || uploadState?.isError || !uploadState?.fileId) {
      return;
    }
    this.router.navigate(['../', uploadState.fileId], { relativeTo: this.activatedRoute });
  }

  protected readonly TemplatesLocalization = TemplatesLocalization;
}
