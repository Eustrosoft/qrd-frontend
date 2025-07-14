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
import { createDispatchMap, createSelectMap } from '@ngxs/store';
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
import { MatButton, MatIconButton } from '@angular/material/button';
import { RouteTitles, SharedLocalization } from '@shared/shared.constants';
import { UiGridBlockComponent } from '@ui/ui-grid-block/ui-grid-block.component';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { IS_SMALL_SCREEN } from '@cdk/tokens/breakpoint.tokens';
import { TemplatesLocalization } from '@app/pages/templates/templates.constants';
import { TemplateFieldForm, TemplateFieldFormGroup, TemplateForm } from '@app/pages/templates/templates.models';
import { FieldType } from '@api/templates/template-api.models';
import { FilesLocalization, MAX_DESCRIPTION_LENGTH, MAX_NAME_LENGTH } from '@app/pages/files/files.constants';
import { ErrorStateMatcher, MatOption } from '@angular/material/core';
import { TouchedErrorStateMatcher } from '@cdk/classes/touched-error-state-matcher.class';
import { MatError } from '@angular/material/form-field';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { MatIcon } from '@angular/material/icon';
import { FetchDictionaryByName } from '@shared/state/dictionary-registry.actions';
import { DictionaryRegistryState } from '@shared/state/dictionary-registry.state';
import { DictionaryItem, FileForm, FileFormGroup } from '@shared/shared.models';
import { MatSelect } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { BytesToSizePipe } from '@shared/pipe/bytes-to-size.pipe';
import { DatePipe } from '@angular/common';
import { FileListItemComponent } from '@shared/components/file-list-item/file-list-item.component';
import { FileUploadComponent } from '@app/pages/files/components/file-upload/file-upload.component';
import { UploadState } from '@app/pages/files/files.models';
import { FileStorageType } from '@api/files/file-api.models';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

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
  ],
  providers: [{ provide: ErrorStateMatcher, useClass: TouchedErrorStateMatcher }],
  templateUrl: './template-edit.component.html',
  styleUrl: './template-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateEditComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly activatedRoute = inject(ActivatedRoute);
  protected readonly isSmallScreen = inject(IS_SMALL_SCREEN);
  protected readonly templateId = this.activatedRoute.snapshot.paramMap.get('id');

  protected readonly selectors = createSelectMap({
    isTemplateLoading: TemplatesState.isTemplateLoading$,
    isSaveInProgress: TemplatesState.isSaveInProgress$,
    isFileBeingAdded: TemplatesState.isFileBeingAdded$,
    isFileListLoading: TemplatesState.isFileListLoading$,
    template: TemplatesState.getTemplate$,
    inputType: DictionaryRegistryState.getDictionary$<DictionaryItem>('INPUT_TYPE'),
    fileList: TemplatesState.getFileList$,
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

  protected readonly form = this.fb.group<TemplateForm>({
    name: this.fb.nonNullable.control<string>('', [Validators.required, Validators.maxLength(MAX_NAME_LENGTH)]),
    description: this.fb.nonNullable.control<string>('', [Validators.maxLength(MAX_DESCRIPTION_LENGTH)]),
    fields: this.fb.nonNullable.array<TemplateFieldFormGroup>([]),
    files: this.fb.nonNullable.array<FileFormGroup>([]),
  });

  protected readonly templateEff = effect(() => {
    const template = this.selectors.template();
    this.form.patchValue({
      name: template?.name ?? '',
      description: template?.description ?? '',
    });
    this.patchFields(template?.fields ?? []);
    this.patchFiles(template?.files ?? []);
  });

  protected readonly expandedFieldIndex = signal<number | null>(null);
  protected readonly isUploadVisible = signal<boolean>(false);
  protected readonly isFileSelectorVisible = signal<boolean>(false);

  protected readonly RouteTitles = RouteTitles;
  protected readonly TemplatesLocalization = TemplatesLocalization;
  protected readonly SharedLocalization = SharedLocalization;
  protected readonly FilesLocalization = FilesLocalization;
  protected readonly MAX_NAME_LENGTH = MAX_NAME_LENGTH;
  protected readonly MAX_DESCRIPTION_LENGTH = MAX_DESCRIPTION_LENGTH;

  public ngOnInit(): void {
    if (this.templateId) {
      this.actions.fetchTemplate(+this.templateId, this.destroyRef);
    }
    this.actions.fetchDictionaryByName('INPUT_TYPE', this.destroyRef);
  }

  public ngOnDestroy(): void {
    this.actions.resetTemplatesState();
  }

  protected saveData(): void {
    if (this.templateId) {
      this.actions.saveTemplate(+this.templateId, this.form.getRawValue(), this.destroyRef);
      return;
    }
    this.actions.createTemplate(this.form.getRawValue(), this.destroyRef);
  }

  protected addField(initial: Partial<ReturnType<TemplateFieldFormGroup['getRawValue']>> = {}): void {
    this.form.controls.fields.push(this.makeFieldForm(initial));
  }

  public patchFields(fieldList: Partial<ReturnType<TemplateFieldFormGroup['getRawValue']>>[] = []): void {
    this.form.controls.fields.clear();
    for (const field of fieldList) {
      this.addField(field);
    }
  }

  protected deleteField(index: number): void {
    this.expandedFieldIndex.set(null);
    this.form.controls.fields.removeAt(index);
  }

  protected addFile(initial: Partial<ReturnType<FileFormGroup['getRawValue']>> = {}): void {
    this.form.controls.files.push(this.makeFileForm(initial));
  }

  public patchFiles(fileList: Partial<ReturnType<FileFormGroup['getRawValue']>>[] = []): void {
    this.form.controls.files.clear();
    for (const file of fileList) {
      this.addFile(file);
    }
  }

  protected deleteFile(index: number): void {
    this.form.controls.files.removeAt(index);
  }

  protected makeFieldForm(
    initial: Partial<ReturnType<TemplateFieldFormGroup['getRawValue']>> = {},
  ): TemplateFieldFormGroup {
    const last = this.form.controls.fields.length + 1;
    return this.fb.group<TemplateFieldForm>({
      caption: this.fb.nonNullable.control<string>(initial?.caption ?? ''),
      fieldOrder: this.fb.nonNullable.control<number>(initial?.fieldOrder ?? last),
      fieldType: this.fb.nonNullable.control<FieldType>(initial?.fieldType ?? 'TEXT'),
      isPublic: this.fb.nonNullable.control<boolean>(initial?.isPublic ?? true),
      isStatic: this.fb.nonNullable.control<boolean>(initial?.isStatic ?? true),
      name: this.fb.nonNullable.control<string>(initial?.name ?? `FN${last}`),
      placeholder: this.fb.nonNullable.control<string>(initial?.placeholder ?? ''),
    });
  }

  protected makeFileForm(initial: Partial<ReturnType<FileFormGroup['getRawValue']>> = {}): FileFormGroup {
    return this.fb.group<FileForm>({
      id: this.fb.nonNullable.control<number>(initial?.id ?? -1),
      fileStorageType: this.fb.nonNullable.control<FileStorageType>(initial?.fileStorageType ?? 'DB'),
      name: this.fb.nonNullable.control<string>(initial?.name ?? ''),
      fileSize: this.fb.nonNullable.control<number>(initial?.fileSize ?? 0),
      isPublic: this.fb.nonNullable.control<boolean>(initial?.isPublic ?? false),
      isActive: this.fb.nonNullable.control<boolean>(initial?.isActive ?? false),
      updated: this.fb.nonNullable.control<string>(initial?.updated ?? ''),
    });
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
