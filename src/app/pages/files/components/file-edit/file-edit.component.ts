import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, viewChild } from '@angular/core';
import { FileUploadComponent } from '@app/pages/files/components/file-upload/file-upload.component';
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
import { UpdateFileMetadata } from '@app/pages/files/components/file-upload/state/file-upload.actions';
import { FileUploadState } from '@app/pages/files/components/file-upload/state/file-upload.state';

@Component({
  selector: 'file-edit',
  imports: [FileUploadComponent, CardContainerComponent, UiSkeletonComponent, ToolbarComponent],
  templateUrl: './file-edit.component.html',
  styleUrl: './file-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileEditComponent implements OnInit, CanComponentDeactivate {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly actions$ = inject(Actions);

  protected readonly fileId = this.activatedRoute.snapshot.paramMap.get('id');
  protected readonly fileUploadCmp = viewChild(FileUploadComponent);

  protected readonly selectors = createSelectMap({
    fileAttachmentMode: FileUploadState.getFileAttachmentMode$,
    isFileLoading: FilesState.isFileLoading$,
    file: FilesState.getFile$,
    isFileDownloading: FilesState.isFileDownloading$,
  });
  protected readonly actions = createDispatchMap({
    fetchFile: FetchFile,
    updateFileMetadata: UpdateFileMetadata,
  });

  public ngOnInit(): void {
    if (this.fileId) {
      this.actions.fetchFile(+this.fileId, this.destroyRef);
    }
  }

  public isDataSaved(): boolean {
    if (this.selectors.fileAttachmentMode() === 'upload') {
      return !this.fileUploadCmp()?.fileUploadFormFactoryService.fileUploadFormHasUnsavedChanges();
    }
    if (this.selectors.fileAttachmentMode() === 'fileUrl') {
      return !this.fileUploadCmp()?.fileUploadFormFactoryService.fileAsUrlFormHasUnsavedChanges();
    }
    return false;
  }

  public canDeactivate(isConfirmed?: boolean): Observable<boolean> {
    if (isConfirmed === undefined) {
      return of(false);
    }

    if (isConfirmed) {
      if (this.selectors.fileAttachmentMode() === 'upload') {
        this.actions.updateFileMetadata(
          +this.fileId!,
          this.fileUploadCmp()?.getFileUploadFormRawValue()!,
          this.destroyRef,
        );
      }
      if (this.selectors.fileAttachmentMode() === 'fileUrl') {
        this.actions.updateFileMetadata(
          +this.fileId!,
          this.fileUploadCmp()?.getFileAsUrlFormRawValue()!,
          this.destroyRef,
        );
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
}
