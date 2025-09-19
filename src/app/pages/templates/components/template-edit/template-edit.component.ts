import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Actions, createDispatchMap, createSelectMap, ofActionErrored, ofActionSuccessful } from '@ngxs/store';
import { CardContainerComponent } from '@shared/components/card-container/card-container.component';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { UiSkeletonComponent } from '@ui/ui-skeleton/ui-skeleton.component';
import { TemplatesState } from '@app/pages/templates/state/templates.state';
import {
  AddFileToTemplate,
  ClearTemplate,
  CreateTemplate,
  FetchFileList,
  FetchTemplate,
  SaveTemplate,
} from '@app/pages/templates/state/templates.actions';
import { MatButton, MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { RouteTitles, SharedLocalization } from '@shared/shared.constants';
import { UiGridBlockComponent } from '@ui/ui-grid-block/ui-grid-block.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatInput, MatLabel, MatSuffix } from '@angular/material/input';
import { IS_SMALL_SCREEN, IS_XSMALL } from '@cdk/tokens/breakpoint.tokens';
import { TemplatesLocalization } from '@app/pages/templates/templates.constants';
import { FilesLocalization, MAX_DESCRIPTION_LENGTH, MAX_NAME_LENGTH } from '@app/pages/files/files.constants';
import { ErrorStateMatcher, MatOption } from '@angular/material/core';
import { TouchedErrorStateMatcher } from '@cdk/classes/touched-error-state-matcher.class';
import { MatError } from '@angular/material/form-field';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { MatIcon } from '@angular/material/icon';
import { FetchDictionaryByName } from '@shared/state/dictionary-registry.actions';
import { DictionaryRegistryState } from '@shared/state/dictionary-registry.state';
import { DictionaryItem } from '@shared/shared.models';
import { MatSelect } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { BytesToSizePipe } from '@shared/pipe/bytes-to-size.pipe';
import { DatePipe } from '@angular/common';
import { FileListItemComponent } from '@shared/components/file-list-item/file-list-item.component';
import { UploadState } from '@app/pages/files/files.models';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CanComponentDeactivate } from '@shared/guards/unsaved-data.guard';
import { distinctUntilChanged, map, merge, Observable, of, pairwise, startWith } from 'rxjs';
import { ErrorsLocalization } from '@modules/error/error.constants';
import { TemplateFormFactoryService } from '@app/pages/templates/services/template-form-factory.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { TemplateFormGroup } from '@app/pages/templates/templates.models';
import { easyHash } from '@shared/utils/functions/easy-hash.function';
import { FileEditableMetadata } from '@api/files/files-api.models';
import { MatTooltip } from '@angular/material/tooltip';
import { BannerComponent } from '@shared/components/banner/banner.component';
import { FileAsUrlComponent } from '@app/pages/files/components/file-upload/file-as-url/file-as-url.component';
import { FileUploadBlobComponent } from '@app/pages/files/components/file-upload/file-upload-blob/file-upload-blob.component';
import { FileAttachmentModeComponent } from '@app/pages/files/components/file-upload/file-attachment-mode/file-attachment-mode.component';
import { FileUploadState } from '@app/pages/files/components/file-upload/state/file-upload.state';
import { IndicatorComponent } from '@shared/components/indicator/indicator.component';
import { MobileToolbarComponent } from '@shared/components/mobile-toolbar/mobile-toolbar.component';
import { UiBottomMenuService } from '@ui/ui-bottom-menu/ui-bottom-menu.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'template-edit',
  imports: [
    CardContainerComponent,
    ToolbarComponent,
    UiSkeletonComponent,
    MatButton,
    UiGridBlockComponent,
    FormsModule,
    MatFormField,
    MatLabel,
    MatError,
    ReactiveFormsModule,
    MatInput,
    UiFlexBlockComponent,
    MatIcon,
    MatIconButton,
    MatSelect,
    MatOption,
    MatSlideToggle,
    BytesToSizePipe,
    DatePipe,
    FileListItemComponent,
    MatProgressSpinner,
    MatSuffix,
    MatTooltip,
    MatMiniFabButton,
    BannerComponent,
    FileAsUrlComponent,
    FileUploadBlobComponent,
    FileAttachmentModeComponent,
    IndicatorComponent,
    MobileToolbarComponent,
  ],
  providers: [{ provide: ErrorStateMatcher, useClass: TouchedErrorStateMatcher }],
  templateUrl: './template-edit.component.html',
  styleUrl: './template-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateEditComponent implements OnInit, AfterContentInit, OnDestroy, CanComponentDeactivate {
  private readonly templateFormFactoryService = inject(TemplateFormFactoryService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly actions$ = inject(Actions);
  private readonly uiBottomMenuService = inject(UiBottomMenuService);
  private readonly title = inject(Title);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly isXSmall = inject(IS_XSMALL);
  protected readonly isSmallScreen = inject(IS_SMALL_SCREEN);
  protected readonly routeParams = toSignal(this.activatedRoute.params, { requireSync: true });
  protected readonly form = toSignal<TemplateFormGroup>(
    this.activatedRoute.data.pipe(map((data) => data['templateForm'])),
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
        ofActionSuccessful(SaveTemplate),
        map(() => false),
      ),
    ).pipe(distinctUntilChanged(), takeUntilDestroyed()),
    { initialValue: false },
  );

  protected readonly selectors = createSelectMap({
    isTemplateLoading: TemplatesState.isTemplateLoading$,
    isTemplateLoadErr: TemplatesState.isTemplateLoadErr$,
    isSaveInProgress: TemplatesState.isSaveInProgress$,
    isTemplateFilesLoading: TemplatesState.isTemplateFilesLoading$,
    template: TemplatesState.getTemplate$,
    inputType: DictionaryRegistryState.getDictionary$<DictionaryItem>('INPUT_TYPE'),
    filesState: TemplatesState.getFilesState$,
    fileAttachmentMode: FileUploadState.getFileAttachmentMode$,
  });

  protected readonly actions = createDispatchMap({
    fetchTemplate: FetchTemplate,
    createTemplate: CreateTemplate,
    saveTemplate: SaveTemplate,
    addFileToTemplate: AddFileToTemplate,
    fetchFileList: FetchFileList,
    fetchDictionaryByName: FetchDictionaryByName,
    clearTemplate: ClearTemplate,
  });

  protected readonly titleEff = effect(() => {
    this.title.setTitle(
      `${SharedLocalization.defaultTitle} | ${RouteTitles.edit} - ${RouteTitles.template} ${this.selectors.template()?.name ?? ''}`,
    );
  });

  protected readonly gridTemplateColumns = computed<string>(() => {
    if (this.isSmallScreen()) {
      return 'repeat(1, 1fr)';
    }
    return 'repeat(3, 1fr)';
  });

  protected readonly expandedFieldsGridTemplateColumns = computed<string>(() => {
    if (this.isSmallScreen()) {
      return 'repeat(1, 1fr)';
    }
    return 'repeat(3, 1fr)';
  });

  protected readonly slideTogglesGridTemplateColumns = computed<string>(() => {
    if (this.isXSmall()) {
      return 'repeat(1, 1fr)';
    }
    return 'repeat(2, 1fr)';
  });

  protected readonly templateEff = effect(() => {
    const template = this.selectors.template();
    this.templateFormFactoryService.patchTemplateForm(
      {
        name: template?.name ?? '',
        description: template?.description ?? '',
      },
      false,
    );
    this.templateFormFactoryService.patchFields(template?.fields ?? [], false);
    this.templateFormFactoryService.patchFiles(template?.files ?? [], false);
  });

  protected readonly expandedFieldIndex = signal<number | null>(null);
  protected readonly isUploadVisible = signal<boolean>(false);
  protected readonly isFileSelectorVisible = signal<boolean>(false);

  protected readonly fileInEditIndex = signal<number | null>(null);
  protected readonly fileInEditMetadata = signal<FileEditableMetadata | null>(null);

  protected readonly mobileToolbar = viewChild.required('mobileToolbar', { read: TemplateRef<unknown> });

  protected readonly RouteTitles = RouteTitles;
  protected readonly TemplatesLocalization = TemplatesLocalization;
  protected readonly SharedLocalization = SharedLocalization;
  protected readonly FilesLocalization = FilesLocalization;
  protected readonly ErrorsLocalization = ErrorsLocalization;
  protected readonly MAX_NAME_LENGTH = MAX_NAME_LENGTH;
  protected readonly MAX_DESCRIPTION_LENGTH = MAX_DESCRIPTION_LENGTH;

  public ngOnInit(): void {
    this.actions.fetchDictionaryByName('INPUT_TYPE', this.destroyRef);
  }

  public ngAfterContentInit(): void {
    this.uiBottomMenuService.renderTemplate(this.mobileToolbar());
  }

  public ngOnDestroy(): void {
    this.actions.clearTemplate();
    this.uiBottomMenuService.renderDefaultCmp();
  }

  protected addField(): void {
    this.templateFormFactoryService.addField();
  }

  protected deleteField(index: number): void {
    this.expandedFieldIndex.set(null);
    this.templateFormFactoryService.deleteField(index);
  }

  protected unlinkFile(index: number): void {
    this.fileInEditIndex.set(null);
    this.fileInEditMetadata.set(null);
    this.templateFormFactoryService.removeFile(index);
  }

  public canDeactivate(isConfirmed?: boolean): Observable<boolean> {
    if (isConfirmed === undefined) {
      return of(false);
    }

    if (isConfirmed) {
      this.actions.saveTemplate(this.routeParams()['id'], this.form().getRawValue(), this.destroyRef);
      return merge(
        this.actions$.pipe(
          ofActionSuccessful(SaveTemplate),
          map(() => true),
        ),
        this.actions$.pipe(
          ofActionErrored(SaveTemplate),
          map(() => false),
        ),
      );
    }

    return of(true);
  }

  public isDataSaved(): boolean {
    return !this.formHasUnsavedChanges();
  }

  protected saveData(): void {
    this.form().markAllAsTouched();
    if (this.form().invalid) {
      return;
    }
    this.actions.saveTemplate(this.routeParams()['id'], this.form().getRawValue(), this.destroyRef);
  }

  protected toggleAdditionalFields(index: number): void {
    if (index === this.expandedFieldIndex()) {
      this.expandedFieldIndex.set(null);
      return;
    }
    this.expandedFieldIndex.set(index);
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
    this.actions.fetchTemplate(this.routeParams()['id'], this.destroyRef, true, 'isTemplateFilesLoading');
  }

  protected showFileSelection(): void {
    this.isUploadVisible.set(false);
    this.isFileSelectorVisible.set(!this.isFileSelectorVisible());
    this.actions.fetchFileList(this.destroyRef);
  }

  protected addFileToTemplate(state: UploadState | null): void {
    this.isUploadVisible.set(false);
    if (state?.fileId) {
      this.actions.addFileToTemplate(this.routeParams()['id'], state.fileId, this.destroyRef);
    }
  }

  protected addExistingFilesToTemplate(fileIdList: number[]): void {
    this.isFileSelectorVisible.set(false);
    for (const fileId of fileIdList) {
      this.actions.addFileToTemplate(this.routeParams()['id'], fileId, this.destroyRef);
    }
  }
}
