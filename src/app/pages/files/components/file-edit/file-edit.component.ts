import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FileUploadComponent } from '@app/pages/files/components/file-upload/file-upload.component';
import { CardContainerComponent } from '@shared/components/card-container/card-container.component';
import { createDispatchMap, createSelectMap } from '@ngxs/store';
import { FilesState } from '@app/pages/files/state/files.state';
import { ActivatedRoute, Router } from '@angular/router';
import { FetchFile } from '@app/pages/files/state/files.actions';
import { UiSkeletonComponent } from '@ui/ui-skeleton/ui-skeleton.component';

@Component({
  selector: 'file-edit',
  imports: [FileUploadComponent, CardContainerComponent, UiSkeletonComponent],
  templateUrl: './file-edit.component.html',
  styleUrl: './file-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileEditComponent implements OnInit {
  /**
   * TODO Доделать toolbar, fetch файла и прокидывание в file-upload
   */
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  protected readonly fileId = this.activatedRoute.snapshot.paramMap.get('id');

  protected readonly selectors = createSelectMap({
    isFileLoading: FilesState.isFileLoading$,
    file: FilesState.getFile$,
    isFileDownloading: FilesState.isFileDownloading$,
  });
  protected readonly actions = createDispatchMap({
    fetchFile: FetchFile,
  });

  public ngOnInit(): void {
    if (this.fileId) {
      this.actions.fetchFile(+this.fileId, this.destroyRef);
    }
  }

  protected goToView(fileId: number | null): void {
    if (!fileId) {
      return;
    }
    this.router.navigate(['../', fileId], { relativeTo: this.activatedRoute });
  }
}
