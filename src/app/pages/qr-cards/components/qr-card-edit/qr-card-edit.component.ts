import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  inputBinding,
  linkedSignal,
  OnDestroy,
  OnInit,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Actions, createDispatchMap, createSelectMap, ofActionErrored, ofActionSuccessful } from '@ngxs/store';
import { IS_SMALL_SCREEN, IS_XSMALL } from '@cdk/tokens/breakpoint.tokens';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, EMPTY, map, merge, Observable, of, pairwise, startWith, switchMap } from 'rxjs';
import { DictionaryItem, Option } from '@shared/shared.models';
import { easyHash } from '@shared/utils/functions/easy-hash.function';
import { FileUploadState } from '@app/pages/files/components/file-upload/state/file-upload.state';
import { FileEditableMetadata } from '@api/files/files-api.models';
import { UploadState } from '@app/pages/files/files.models';
import { CanComponentDeactivate } from '@shared/guards/unsaved-data.guard';
import { QrCardFormGroup } from '@app/pages/qr-cards/qr-cards.models';
import { RouteTitles, SharedLocalization } from '@shared/shared.constants';
import {
  FilesLocalization,
  MAX_DESCRIPTION_LENGTH,
  MAX_NAME_LENGTH,
  MAX_URL_LENGTH,
} from '@app/pages/files/files.constants';
import { ErrorsLocalization } from '@modules/error/error.constants';
import {
  AddFilesToQrCard,
  ClearQrCard,
  FetchFileList,
  FetchQrCard,
  FetchTemplateList,
  ReplaceQrCardFields,
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
import { MatButton, MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { UiSkeletonComponent } from '@ui/ui-skeleton/ui-skeleton.component';
import { UiGridBlockComponent } from '@ui/ui-grid-block/ui-grid-block.component';
import { MatFormField, MatHint, MatInput, MatLabel, MatSuffix } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { MatIcon } from '@angular/material/icon';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatError } from '@angular/material/form-field';
import { QrCardsLocalization } from '@app/pages/qr-cards/qr-cards.constants';
import { InteractionEffect } from '@shared/directives/text-interaction-effect.directive';
import { DictionaryRegistryState } from '@shared/state/dictionary-registry.state';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { IndicatorComponent } from '@shared/components/indicator/indicator.component';
import { QrViewComponent } from '@app/pages/qr-view/qr-view.component';
import { UiSidenavService } from '@ui/ui-sidenav/ui-sidenav.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { TouchedErrorStateMatcher } from '@cdk/classes/touched-error-state-matcher.class';
import { Iso8601DateFormatDirective } from '@shared/directives/iso8601-date-format.directive';
import { FetchTemplate } from '@app/pages/templates/state/templates.actions';
import { DEFAULT_EMPTY_ID } from '@app/app.constants';
import { UiBottomMenuService } from '@ui/ui-bottom-menu/ui-bottom-menu.service';
import { MobileToolbarComponent } from '@shared/components/mobile-toolbar/mobile-toolbar.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { ChangeTemplateDialogData } from '@shared/components/confirmation-dialog/confirmation-dialog.constants';
import { ConfirmationDialogData } from '@shared/components/confirmation-dialog/confirmation-dialog.models';
import { TextareaAutoresizeDirective } from '@shared/directives/textarea-autoresize.directive';
import { FallbackPipe } from '@shared/pipe/fallback.pipe';
import { ToHexPipe } from '@shared/pipe/to-hex.pipe';
import { Title } from '@angular/platform-browser';
import { QrCardsSelectors } from '@app/pages/qr-cards/state/qr-cards.selectors';

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
    MatIconButton,
    MatHint,
    InteractionEffect,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerInput,
    MatSuffix,
    IndicatorComponent,
    RouterLink,
    Iso8601DateFormatDirective,
    MobileToolbarComponent,
    MatMiniFabButton,
    TextareaAutoresizeDirective,
    FallbackPipe,
  ],
  providers: [{ provide: ErrorStateMatcher, useClass: TouchedErrorStateMatcher }],
  templateUrl: './qr-card-edit.component.html',
  styleUrl: './qr-card-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrCardEditComponent implements OnInit, AfterContentInit, OnDestroy, CanComponentDeactivate {
  private readonly qrCardFormFactoryService = inject(QrCardFormFactoryService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly actions$ = inject(Actions);
  private readonly uiSidenavService = inject(UiSidenavService);
  private readonly uiBottomMenuService = inject(UiBottomMenuService);
  private readonly matDialog = inject(MatDialog);
  private readonly title = inject(Title);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly toHexPipe = inject(ToHexPipe);
  protected readonly isXSmall = inject(IS_XSMALL);
  protected readonly isSmallScreen = inject(IS_SMALL_SCREEN);
  protected readonly form = toSignal<QrCardFormGroup>(
    this.activatedRoute.data.pipe(map((data) => data['qrCardForm'])),
    { requireSync: true },
  );

  public readonly formHasUnsavedChanges = toSignal(
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
    isQrCardLoading: QrCardsSelectors.getSlices.isQrCardLoading,
    isQrCardLoadErr: QrCardsSelectors.getSlices.isQrCardLoadErr,
    isSaveInProgress: QrCardsSelectors.getSlices.isSaveInProgress,
    isQrCardFilesLoading: QrCardsSelectors.getSlices.isQrCardFilesLoading,
    qrCard: QrCardsSelectors.getSlices.qrCard,
    qrCardPreviewUrl: QrCardsSelectors.getSlices.qrCardPreviewUrl,
    templatesState: QrCardsSelectors.getTemplatesState$,
    filesState: QrCardsSelectors.getFilesState$,
    fileAttachmentMode: FileUploadState.getFileAttachmentMode$,
  });

  protected readonly actions = createDispatchMap({
    fetchQrCard: FetchQrCard,
    saveQrCard: SaveQrCard,
    addFileToQrCard: AddFilesToQrCard,
    replaceQrCardFields: ReplaceQrCardFields,
    fetchTemplateList: FetchTemplateList,
    fetchTemplate: FetchTemplate,
    fetchFileList: FetchFileList,
    clearQrCard: ClearQrCard,
  });

  protected readonly titleEff = effect(() => {
    this.title.setTitle(
      `${SharedLocalization.defaultTitle} | ${RouteTitles.edit} - ${RouteTitles.card} ${this.selectors.qrCard()?.name ?? ''}`,
    );
  });

  protected readonly lostAttributes = computed<Option<string>[]>(() => {
    const data = this.selectors.qrCard()?.data ?? {};
    const fieldNames = this.selectors.qrCard()?.form?.fields?.map((field) => field.name) ?? [];
    return Object.keys(data).reduce((acc: Option<string>[], key) => {
      if (!fieldNames.includes(key)) {
        acc.push({ value: key, viewValue: data[key] });
      }
      return acc;
    }, []);
  });

  protected readonly gridTemplateColumns = computed<string>(() => {
    if (this.isSmallScreen()) {
      return 'repeat(1, 1fr)';
    }
    return 'repeat(3, 1fr)';
  });

  protected readonly qrCardEff = effect(() => {
    const qrCard = this.selectors.qrCard();
    this.qrCardFormFactoryService.patchQrCardForm(
      {
        id: qrCard?.id ?? -1,
        code: qrCard?.code ?? -1,
        formId: qrCard?.form?.id ?? -1,
        name: qrCard?.name ?? '',
        description: qrCard?.description ?? '',
        action: qrCard?.action ?? 'STD',
        redirect: qrCard?.redirect ?? null,
        data: qrCard?.data ?? {},
      },
      false,
    );
    this.qrCardFormFactoryService.patchFiles(qrCard?.files ?? [], false);
    this.qrCardFormFactoryService.patchDataFormRecord(qrCard?.form?.fields ?? [], qrCard?.data ?? {}, false);
  });

  protected readonly isUploadVisible = signal<boolean>(false);
  protected readonly isFileSelectorVisible = signal<boolean>(false);

  protected readonly fileInEditIndex = signal<number | null>(null);
  protected readonly fileInEditMetadata = signal<FileEditableMetadata | null>(null);

  protected readonly mobileToolbar = viewChild.required('mobileToolbar', { read: TemplateRef<unknown> });

  protected readonly RouteTitles = RouteTitles;
  protected readonly QrCardsLocalization = QrCardsLocalization;
  protected readonly SharedLocalization = SharedLocalization;
  protected readonly FilesLocalization = FilesLocalization;
  protected readonly ErrorsLocalization = ErrorsLocalization;
  protected readonly MAX_NAME_LENGTH = MAX_NAME_LENGTH;
  protected readonly MAX_DESCRIPTION_LENGTH = MAX_DESCRIPTION_LENGTH;
  protected readonly MAX_URL_LENGTH = MAX_URL_LENGTH;
  protected readonly DEFAULT_EMPTY_ID = DEFAULT_EMPTY_ID;

  public ngOnInit(): void {
    this.actions.fetchTemplateList(this.destroyRef);
    this.initFormSubs();
  }

  public ngAfterContentInit(): void {
    this.uiBottomMenuService.renderTemplate(this.mobileToolbar());
  }

  public ngOnDestroy(): void {
    this.actions.clearQrCard();
    this.uiBottomMenuService.renderDefaultCmp();
  }

  protected readonly prevFormId = toSignal(
    this.form().controls.formId.valueChanges.pipe(
      pairwise(),
      map(([prev]) => prev),
      startWith(this.form().controls.formId.getRawValue()),
    ),
    { requireSync: true },
  );

  protected readonly lastSelectedFormId = linkedSignal<number, number>({
    source: this.prevFormId,
    computation: (next, prev) => prev?.value ?? next,
  });

  protected initFormSubs(): void {
    this.form()
      .controls.formId.valueChanges.pipe(
        switchMap(() =>
          this.matDialog
            .open<ConfirmationDialogComponent, ConfirmationDialogData, boolean>(ConfirmationDialogComponent, {
              data: ChangeTemplateDialogData,
            })
            .afterClosed(),
        ),
        switchMap((result) => {
          if (!result) {
            this.form().controls.formId.setValue(this.lastSelectedFormId(), { emitEvent: false });
            this.lastSelectedFormId.set(this.form().controls.formId.getRawValue());
            return EMPTY;
          }
          this.lastSelectedFormId.set(this.form().controls.formId.getRawValue());
          return this.actions.replaceQrCardFields(this.form().getRawValue(), this.destroyRef);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
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
      this.actions.saveQrCard(this.form().getRawValue(), this.destroyRef);
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

  protected openCardPreview(): void {
    this.uiSidenavService.open(QrViewComponent, {
      bindings: [
        inputBinding('iframeSrc', this.selectors.qrCardPreviewUrl),
        inputBinding('isPreviewingUnsaved', this.formHasUnsavedChanges),
      ],
      position: 'end',
      width: this.isXSmall() ? 'full' : 'sm',
      isFixed: true,
    });
  }

  protected saveData(): void {
    this.form().markAllAsTouched();
    if (this.form().invalid) {
      return;
    }
    this.actions.saveQrCard(this.form().getRawValue(), this.destroyRef);
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
    this.actions.fetchQrCard(
      this.selectors.qrCard()!.id,
      this.selectors.qrCard()!.code.toString(),
      this.destroyRef,
      true,
      'isQrCardFilesLoading',
    );
  }

  protected showFileSelection(): void {
    this.isUploadVisible.set(false);
    this.isFileSelectorVisible.set(!this.isFileSelectorVisible());
    this.actions.fetchFileList(this.destroyRef);
  }

  protected addFileToQrCard(state: UploadState | null): void {
    this.isUploadVisible.set(false);
    if (state?.fileId) {
      this.actions.addFileToQrCard(
        this.selectors.qrCard()!.id,
        this.toHexPipe.transform(this.selectors.qrCard()!.code.toString()),
        [state.fileId],
        this.destroyRef,
      );
    }
  }

  protected addExistingFilesToQrCard(fileIdList: number[]): void {
    this.isFileSelectorVisible.set(false);
    this.actions.addFileToQrCard(
      this.selectors.qrCard()!.id,
      this.toHexPipe.transform(this.selectors.qrCard()!.code.toString()),
      fileIdList,
      this.destroyRef,
    );
  }
}
