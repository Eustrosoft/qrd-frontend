import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  model,
  OnDestroy,
  signal,
  Signal,
  viewChild,
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  FilesLocalization,
  MAX_DESCRIPTION_LENGTH,
  MAX_NAME_LENGTH,
  MAX_STORAGE_PATH_LENGTH,
} from '@app/pages/files/files.constants';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { SharedLocalization, WEB_REGEXP } from '@shared/shared.constants';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { AttachmentModeListItem, FileAttachmentMode, FileForm, UploadState } from '@app/pages/files/files.models';
import { MatListItem, MatNavList } from '@angular/material/list';
import { ErrorStateMatcher } from '@angular/material/core';
import { TouchedErrorStateMatcher } from '@cdk/classes/touched-error-state-matcher.class';
import { MatIcon } from '@angular/material/icon';
import { MatError } from '@angular/material/form-field';
import { FilesService } from '@app/pages/files/services/files.service';
import { Subject } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltip } from '@angular/material/tooltip';
import { EllipsisDirective } from '@shared/directives/ellipsis.directive';
import { JsonPipe } from '@angular/common';
import { FormMode } from '@shared/shared.models';
import { FileStorageType } from '@api/files/file-api.models';

@Component({
  selector: 'file-upload',
  imports: [
    MatButton,
    MatLabel,
    MatFormField,
    FormsModule,
    MatInput,
    MatSlideToggle,
    UiFlexBlockComponent,
    MatListItem,
    ReactiveFormsModule,
    MatNavList,
    MatError,
    MatIcon,
    MatIconButton,
    MatProgressSpinner,
    MatTooltip,
    EllipsisDirective,
    JsonPipe,
  ],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: ErrorStateMatcher, useClass: TouchedErrorStateMatcher }],
})
export class FileUploadComponent implements OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly filesService = inject(FilesService);
  private readonly injector = inject(Injector);
  private readonly cancelUpload$ = new Subject<void>();

  public readonly fileAttachmentMode = model<FileAttachmentMode>('upload');
  public readonly fileStorageType = input<FileStorageType>('DB');
  public readonly formMode = input<FormMode>('new');

  protected readonly fileAttachmentModeEffect = effect(() => {
    const mode = this.fileAttachmentMode();
    if (mode === 'upload') {
      console.log('upload, patch form validators');
    }
    if (mode === 'link') {
      this.cancelFile();
      console.log('link, patch form validators');
    }
  });

  protected readonly attachmentModeList: AttachmentModeListItem[] = [
    {
      mode: 'upload',
      title: FilesLocalization.uploadFile,
    },
    {
      mode: 'link',
      title: FilesLocalization.linkFile,
    },
  ];

  protected readonly fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');
  protected readonly FilesLocalization = FilesLocalization;
  protected readonly SharedLocalization = SharedLocalization;
  protected readonly MAX_NAME_LENGTH = MAX_NAME_LENGTH;
  protected readonly MAX_DESCRIPTION_LENGTH = MAX_DESCRIPTION_LENGTH;
  protected readonly MAX_STORAGE_PATH_LENGTH = MAX_STORAGE_PATH_LENGTH;

  protected readonly form = this.fb.group<FileForm>({
    name: this.fb.nonNullable.control<string>('', [Validators.required, Validators.maxLength(MAX_NAME_LENGTH)]),
    description: this.fb.nonNullable.control<string>('', [Validators.maxLength(MAX_DESCRIPTION_LENGTH)]),
    isActive: this.fb.nonNullable.control<boolean>(false),
    isPublic: this.fb.nonNullable.control<boolean>(false),
    storagePath: this.fb.nonNullable.control<string>('', [
      Validators.required,
      Validators.maxLength(MAX_STORAGE_PATH_LENGTH),
      Validators.pattern(WEB_REGEXP),
    ]),
    file: this.fb.control<File | null>(null, [Validators.required]),
  });

  protected uploadState: Signal<UploadState | null> = signal(null);

  protected fileChanged(): void {
    const fileList = Array.from(this.fileInput().nativeElement.files ?? []);
    if (!fileList.length) {
      return;
    }
    const file = fileList[0];
    this.form.controls.name.patchValue(file.name);
    this.form.controls.file.patchValue(file);
  }

  protected performAction(): void {
    console.log(this.form.getRawValue());
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    if (this.fileAttachmentMode() === 'upload') {
      this.uploadState = toSignal<UploadState, UploadState>(
        this.filesService.uploadFile(this.form.getRawValue(), this.cancelUpload$.asObservable()),
        {
          injector: this.injector,
          initialValue: {
            progress: 0,
            isDone: false,
            isLoading: false,
            isCancelled: false,
            isError: false,
            fileId: null,
          },
        },
      );
    }
  }

  protected cancelFile(): void {
    this.cancelUpload$.next();
    this.clearInput();
    this.form.controls.file.reset();
    this.form.controls.name.reset();
  }

  private clearInput(): void {
    this.fileInput().nativeElement.files = new DataTransfer().files;
  }

  public ngOnDestroy(): void {
    this.cancelUpload$.next();
    this.cancelUpload$.complete();
  }
}
