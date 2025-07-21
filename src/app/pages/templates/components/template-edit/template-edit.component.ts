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
import { CardContainerComponent } from '@shared/components/card-container/card-container.component';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { UiSkeletonComponent } from '@ui/ui-skeleton/ui-skeleton.component';
import { TemplatesState } from '@app/pages/templates/state/templates.state';
import {
  AddFileToTemplate,
  CreateTemplate,
  FetchFileList,
  FetchTemplate,
  ResetTemplatesState,
  SaveTemplate,
} from '@app/pages/templates/state/templates.actions';
import { MatButton, MatFabButton, MatIconButton } from '@angular/material/button';
import { RouteTitles, SharedLocalization } from '@shared/shared.constants';
import { UiGridBlockComponent } from '@ui/ui-grid-block/ui-grid-block.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { IS_SMALL_SCREEN } from '@cdk/tokens/breakpoint.tokens';
import { TemplatesLocalization } from '@app/pages/templates/templates.constants';
import { FilesLocalization, MAX_DESCRIPTION_LENGTH, MAX_NAME_LENGTH } from '@app/pages/files/files.constants';
import { ErrorStateMatcher, MatOption } from '@angular/material/core';
import { TouchedErrorStateMatcher } from '@cdk/classes/touched-error-state-matcher.class';
import { MatError } from '@angular/material/form-field';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { MatIcon } from '@angular/material/icon';
import { FetchDictionaryByName } from '@shared/state/dictionary-registry.actions';
import { DictionaryRegistryState } from '@shared/state/dictionary-registry.state';
import { DictionaryItem, FormMode } from '@shared/shared.models';
import { MatSelect } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { BytesToSizePipe } from '@shared/pipe/bytes-to-size.pipe';
import { DatePipe } from '@angular/common';
import { FileListItemComponent } from '@shared/components/file-list-item/file-list-item.component';
import { FileUploadComponent } from '@app/pages/files/components/file-upload/file-upload.component';
import { UploadState } from '@app/pages/files/files.models';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CanComponentDeactivate } from '@shared/guards/unsaved-data.guard';
import { distinctUntilChanged, map, merge, Observable, of, pairwise, startWith } from 'rxjs';
import { ErrorsLocalization } from '@modules/error/error.constants';
import { TemplateFormFactoryService } from '@app/pages/templates/services/template-form-factory.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { TemplateFormGroup } from '@app/pages/templates/templates.models';
import { easyHash } from '@shared/utils/functions/easy-hash.function';
import { FileEditableMetadata } from '@api/files/file-api.models';

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
    FileUploadComponent,
    MatProgressSpinner,
    MatFabButton,
  ],
  providers: [{ provide: ErrorStateMatcher, useClass: TouchedErrorStateMatcher }],
  templateUrl: './template-edit.component.html',
  styleUrl: './template-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateEditComponent implements OnInit, OnDestroy, CanComponentDeactivate {
  private readonly templateFormFactoryService = inject(TemplateFormFactoryService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly actions$ = inject(Actions);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly isSmallScreen = inject(IS_SMALL_SCREEN);
  protected readonly templateId = this.activatedRoute.snapshot.paramMap.get('id');
  protected readonly form = toSignal<TemplateFormGroup>(
    this.activatedRoute.data.pipe(map((data) => data['templateForm'])),
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
        ofActionSuccessful(SaveTemplate),
        map(() => false),
      ),
    ).pipe(distinctUntilChanged(), takeUntilDestroyed()),
    { initialValue: false },
  );

  protected readonly selectors = createSelectMap({
    isTemplateLoading: TemplatesState.isTemplateLoading$,
    templateLoadErr: TemplatesState.templateLoadErr$,
    isSaveInProgress: TemplatesState.isSaveInProgress$,
    isTemplateFilesLoading: TemplatesState.isTemplateFilesLoading$,
    template: TemplatesState.getTemplate$,
    inputType: DictionaryRegistryState.getDictionary$<DictionaryItem>('INPUT_TYPE'),
    filesState: TemplatesState.getFilesState$,
  });
  protected readonly actions = createDispatchMap({
    fetchTemplate: FetchTemplate,
    createTemplate: CreateTemplate,
    saveTemplate: SaveTemplate,
    addFileToTemplate: AddFileToTemplate,
    fetchFileList: FetchFileList,
    fetchDictionaryByName: FetchDictionaryByName,
    resetTemplatesState: ResetTemplatesState,
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

  protected readonly templateEff = effect(() => {
    if (this.formMode === 'new') {
      return;
    }
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

  protected readonly RouteTitles = RouteTitles;
  protected readonly TemplatesLocalization = TemplatesLocalization;
  protected readonly SharedLocalization = SharedLocalization;
  protected readonly FilesLocalization = FilesLocalization;
  protected readonly ErrorsLocalization = ErrorsLocalization;
  protected readonly MAX_NAME_LENGTH = MAX_NAME_LENGTH;
  protected readonly MAX_DESCRIPTION_LENGTH = MAX_DESCRIPTION_LENGTH;

  public ngOnInit(): void {
    if (this.templateId && !this.selectors.template()) {
      this.actions.fetchTemplate(+this.templateId, this.destroyRef);
    }
    this.actions.fetchDictionaryByName('INPUT_TYPE', this.destroyRef);
  }

  public ngOnDestroy(): void {
    this.actions.resetTemplatesState();
    this.templateFormFactoryService.dispose();
  }

  protected addField(): void {
    this.templateFormFactoryService.addField();
  }

  protected deleteField(index: number): void {
    this.expandedFieldIndex.set(null);
    this.templateFormFactoryService.deleteField(index);
  }

  protected deleteFile(index: number): void {
    this.templateFormFactoryService.deleteFile(index);
  }

  public isDataSaved(): boolean {
    return !this.formHasUnsavedChanges();
  }

  public canDeactivate(isConfirmed?: boolean): Observable<boolean> {
    if (isConfirmed === undefined) {
      return of(false);
    }

    if (isConfirmed) {
      this.actions.saveTemplate(+this.templateId!, this.form().getRawValue(), this.destroyRef);
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

  protected saveData(): void {
    this.form().markAllAsTouched();
    if (this.templateId) {
      this.actions.saveTemplate(+this.templateId, this.form().getRawValue(), this.destroyRef);
      return;
    }
    this.actions.createTemplate(this.form().getRawValue(), this.destroyRef);
  }

  protected showAdditionalFields(index: number): void {
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
    this.actions.fetchTemplate(+this.templateId!, this.destroyRef, true, 'isTemplateFilesLoading');
  }

  protected showFileSelection(): void {
    this.isUploadVisible.set(false);
    this.isFileSelectorVisible.set(!this.isFileSelectorVisible());
    this.actions.fetchFileList(this.destroyRef);
  }

  protected addFileToTemplate(state: UploadState | null): void {
    this.isUploadVisible.set(false);
    if (state?.fileId && this.templateId) {
      this.actions.addFileToTemplate(+this.templateId, state.fileId, this.destroyRef);
    }
  }

  protected addExistingFilesToTemplate(fileIdList: number[]): void {
    this.isFileSelectorVisible.set(false);
    for (const fileId of fileIdList) {
      this.actions.addFileToTemplate(+this.templateId!, fileId, this.destroyRef);
    }
  }
}
