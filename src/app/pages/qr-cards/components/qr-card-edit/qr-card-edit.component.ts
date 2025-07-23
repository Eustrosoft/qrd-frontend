import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Actions, createDispatchMap, createSelectMap, ofActionErrored, ofActionSuccessful } from '@ngxs/store';
import { IS_SMALL_SCREEN, IS_XSMALL } from '@cdk/tokens/breakpoint.tokens';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, map, merge, Observable, of, pairwise, startWith } from 'rxjs';
import { DictionaryItem, FormMode } from '@shared/shared.models';
import { easyHash } from '@shared/utils/functions/easy-hash.function';
import { FileUploadState } from '@app/pages/files/components/file-upload/state/file-upload.state';
import { FileEditableMetadata } from '@api/files/file-api.models';
import { UploadState } from '@app/pages/files/files.models';
import { CanComponentDeactivate } from '@shared/guards/unsaved-data.guard';
import { QrCardFormGroup } from '@app/pages/qr-cards/qr-cards.models';
import { QrCardsState } from '@app/pages/qr-cards/state/qr-cards.state';
import { RouteTitles, SharedLocalization } from '@shared/shared.constants';
import {
  FilesLocalization,
  MAX_DESCRIPTION_LENGTH,
  MAX_NAME_LENGTH,
  MAX_URL_LENGTH,
} from '@app/pages/files/files.constants';
import { ErrorsLocalization } from '@modules/error/error.constants';
import {
  AddFileToQrCard,
  CreateQrCard,
  FetchFileList,
  FetchQrCard,
  FetchTemplateList,
  ResetQrCardsState,
  SaveQrCard,
} from '@app/pages/qr-cards/state/qr-cards.actions';
import { QrCardFormFactoryService } from '@app/pages/qr-cards/services/qr-card-form-factory.service';
import { BannerComponent } from '@shared/components/banner/banner.component';
import { BytesToSizePipe } from '@shared/pipe/bytes-to-size.pipe';
import { CardContainerComponent } from '@shared/components/card-container/card-container.component';
import { DatePipe } from '@angular/common';
import { FileAsUrlComponent } from '@app/pages/files/components/file-upload/file-as-url/file-as-url.component';
import { FileAttachmentModeComponent } from '@app/pages/files/components/file-upload/file-attachment-mode/file-attachment-mode.component';
import { FileListItemComponent } from '@shared/components/file-list-item/file-list-item.component';
import { FileUploadBlobComponent } from '@app/pages/files/components/file-upload/file-upload-blob/file-upload-blob.component';
import { MatButton, MatFabButton, MatIconButton } from '@angular/material/button';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { UiSkeletonComponent } from '@ui/ui-skeleton/ui-skeleton.component';
import { UiGridBlockComponent } from '@ui/ui-grid-block/ui-grid-block.component';
import { MatFormField, MatHint, MatInput, MatLabel } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { MatIcon } from '@angular/material/icon';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatError } from '@angular/material/form-field';
import { QrCardsLocalization } from '@app/pages/qr-cards/qr-cards.constants';
import { InteractionEffect } from '@shared/directives/text-interaction-effect.directive';
import { DictionaryRegistryState } from '@shared/state/dictionary-registry.state';

@Component({
  selector: 'qr-card-edit',
  imports: [
    BannerComponent,
    BytesToSizePipe,
    CardContainerComponent,
    DatePipe,
    FileAsUrlComponent,
    FileAttachmentModeComponent,
    FileListItemComponent,
    FileUploadBlobComponent,
    MatButton,
    ToolbarComponent,
    UiSkeletonComponent,
    UiGridBlockComponent,
    MatFormField,
    ReactiveFormsModule,
    UiFlexBlockComponent,
    MatIcon,
    MatSelect,
    MatProgressSpinner,
    MatLabel,
    MatError,
    MatOption,
    MatInput,
    MatFabButton,
    MatIconButton,
    MatHint,
    InteractionEffect,
  ],
  templateUrl: './qr-card-edit.component.html',
  styleUrl: './qr-card-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrCardEditComponent implements OnInit, OnDestroy, CanComponentDeactivate {
  private readonly qrCardFormFactoryService = inject(QrCardFormFactoryService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly actions$ = inject(Actions);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly isXSmall = inject(IS_XSMALL);
  protected readonly isSmallScreen = inject(IS_SMALL_SCREEN);
  protected readonly qrCardCode = this.activatedRoute.snapshot.paramMap.get('code');
  protected readonly form = toSignal<QrCardFormGroup>(
    this.activatedRoute.data.pipe(map((data) => data['qrCardForm'])),
    { requireSync: true },
  );
  protected readonly formMode: FormMode = this.activatedRoute.snapshot.data['mode'];

  public formHasUnsavedChanges = toSignal<boolean, boolean>(
    merge(
      this.form().valueChanges.pipe(
        startWith(this.form().getRawValue()),
        map((value) => easyHash(value)),
        pairwise(),
        map(([prev, current]) => prev !== current),
      ),
      this.actions$.pipe(
        ofActionSuccessful(SaveQrCard),
        map(() => false),
      ),
    ).pipe(distinctUntilChanged(), takeUntilDestroyed()),
    { initialValue: false },
  );

  protected readonly selectors = createSelectMap({
    qrCardActions: DictionaryRegistryState.getDictionary$<DictionaryItem>('qrCardActions'),
    isQrCardLoading: QrCardsState.isQrCardLoading$,
    qrCardLoadErr: QrCardsState.qrCardLoadErr$,
    isSaveInProgress: QrCardsState.isSaveInProgress$,
    isTemplateFilesLoading: QrCardsState.isQrCardFilesLoading$,
    qrCard: QrCardsState.getQrCard$,
    templatesState: QrCardsState.getTemplatesState$,
    filesState: QrCardsState.getFilesState$,
    fileAttachmentMode: FileUploadState.getFileAttachmentMode$,
  });
  protected readonly actions = createDispatchMap({
    fetchQrCard: FetchQrCard,
    createQrCard: CreateQrCard,
    saveQrCard: SaveQrCard,
    addFileToQrCard: AddFileToQrCard,
    fetchTemplateList: FetchTemplateList,
    fetchFileList: FetchFileList,
    resetQrCardsState: ResetQrCardsState,
  });

  protected readonly gridTemplateColumns = computed<string>(() => {
    if (this.isSmallScreen()) {
      return 'repeat(1, 1fr)';
    }
    return 'repeat(3, 1fr)';
  });

  protected readonly qrCardEff = effect(() => {
    if (this.formMode === 'new') {
      return;
    }
    const qrCard = this.selectors.qrCard();
    this.qrCardFormFactoryService.patchQrCardForm(
      {
        name: qrCard?.name ?? '',
        description: qrCard?.description ?? '',
        action: qrCard?.action ?? 'STD',
        redirect: qrCard?.redirect ?? null,
        data: qrCard?.data ?? {},
      },
      false,
    );
    this.qrCardFormFactoryService.patchFiles(qrCard?.files ?? [], false);
  });

  protected readonly isUploadVisible = signal<boolean>(false);
  protected readonly isFileSelectorVisible = signal<boolean>(false);

  protected readonly fileInEditIndex = signal<number | null>(null);
  protected readonly fileInEditMetadata = signal<FileEditableMetadata | null>(null);

  protected readonly RouteTitles = RouteTitles;
  protected readonly QrCardsLocalization = QrCardsLocalization;
  protected readonly SharedLocalization = SharedLocalization;
  protected readonly FilesLocalization = FilesLocalization;
  protected readonly ErrorsLocalization = ErrorsLocalization;
  protected readonly MAX_NAME_LENGTH = MAX_NAME_LENGTH;
  protected readonly MAX_DESCRIPTION_LENGTH = MAX_DESCRIPTION_LENGTH;

  public ngOnInit(): void {
    if (this.qrCardCode && !this.selectors.qrCard()) {
      this.actions.fetchQrCard(this.qrCardCode, this.destroyRef);
    }
    this.actions.fetchTemplateList(this.destroyRef);
  }

  public ngOnDestroy(): void {
    this.actions.resetQrCardsState();
  }

  protected unlinkFile(index: number): void {
    this.fileInEditIndex.set(null);
    this.fileInEditMetadata.set(null);
    this.qrCardFormFactoryService.removeFile(index);
  }

  public isDataSaved(): boolean {
    return !this.formHasUnsavedChanges();
  }

  public canDeactivate(isConfirmed?: boolean): Observable<boolean> {
    if (isConfirmed === undefined) {
      return of(false);
    }

    if (isConfirmed) {
      this.actions.saveQrCard(+this.qrCardCode!, this.form().getRawValue(), this.destroyRef);
      return merge(
        this.actions$.pipe(
          ofActionSuccessful(SaveQrCard),
          map(() => true),
        ),
        this.actions$.pipe(
          ofActionErrored(SaveQrCard),
          map(() => false),
        ),
      );
    }

    return of(true);
  }

  protected saveData(): void {
    this.form().markAllAsTouched();
    if (this.qrCardCode) {
      this.actions.saveQrCard(+this.qrCardCode, this.form().getRawValue(), this.destroyRef);
      return;
    }
    this.actions.createQrCard(this.form().getRawValue(), this.destroyRef);
  }

  protected showFileUpload(): void {
    this.isFileSelectorVisible.set(false);
    this.isUploadVisible.set(!this.isUploadVisible());
  }

  protected showFileEdit(metadata: FileEditableMetadata, index: number): void {
    this.fileInEditMetadata.set(metadata);
    if (index === this.fileInEditIndex()) {
      this.fileInEditIndex.set(null);
      return;
    }
    this.fileInEditIndex.set(index);
  }

  protected fileMetadataUpdated(): void {
    this.fileInEditIndex.set(null);
    this.fileInEditMetadata.set(null);
    this.actions.fetchQrCard(this.selectors.qrCard()!.code.toString(), this.destroyRef, true, 'isQrCardFilesLoading');
  }

  protected showFileSelection(): void {
    this.isUploadVisible.set(false);
    this.isFileSelectorVisible.set(!this.isFileSelectorVisible());
    this.actions.fetchFileList(this.destroyRef);
  }

  protected addFileToTemplate(state: UploadState | null): void {
    this.isUploadVisible.set(false);
    if (state?.fileId && this.qrCardCode) {
      this.actions.addFileToQrCard(
        +this.qrCardCode,
        this.selectors.qrCard()!.code.toString(),
        state.fileId,
        this.destroyRef,
      );
    }
  }

  protected addExistingFilesToTemplate(fileIdList: number[]): void {
    this.isFileSelectorVisible.set(false);
    for (const fileId of fileIdList) {
      this.actions.addFileToQrCard(
        +this.qrCardCode!,
        this.selectors.qrCard()!.code.toString(),
        fileId,
        this.destroyRef,
      );
    }
  }

  protected readonly MAX_STORAGE_PATH_LENGTH = MAX_URL_LENGTH;
}
