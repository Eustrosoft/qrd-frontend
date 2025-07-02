import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, model, viewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { FilesLocalization } from '@app/pages/files/files.constants';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { SharedLocalization, WEB_REGEXP } from '@shared/shared.constants';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { AttachmentModeListItem, FileAttachmentMode, FileForm } from '@app/pages/files/files.models';
import { MatListItem, MatNavList } from '@angular/material/list';

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
  ],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadComponent {
  private readonly fb = inject(FormBuilder);

  public readonly fileAttachmentMode = model<FileAttachmentMode>('upload');

  protected readonly fileAttachmentModeEffect = effect(() => {
    const mode = this.fileAttachmentMode();
    if (mode === 'upload') {
      console.log('upload, patch form validators');
    }
    if (mode === 'selectExisting') {
      console.log('selectExisting, patch form validators');
    }
    if (mode === 'link') {
      console.log('link, patch form validators');
    }
  });

  protected readonly attachmentModeList: AttachmentModeListItem[] = [
    {
      mode: 'upload',
      title: FilesLocalization.uploadFile,
    },
    {
      mode: 'selectExisting',
      title: FilesLocalization.selectExisting,
    },
    {
      mode: 'link',
      title: FilesLocalization.linkFile,
    },
  ];

  protected readonly fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');
  protected readonly FilesLocalization = FilesLocalization;
  protected readonly SharedLocalization = SharedLocalization;

  protected readonly form = this.fb.group<FileForm>({
    name: this.fb.nonNullable.control<string>('', [Validators.required, Validators.maxLength(127)]),
    description: this.fb.nonNullable.control<string>('', [Validators.maxLength(511)]),
    isActive: this.fb.nonNullable.control<boolean>(false),
    isPublic: this.fb.nonNullable.control<boolean>(false),
    storagePath: this.fb.nonNullable.control<string>('', [Validators.maxLength(2048), Validators.pattern(WEB_REGEXP)]),
    file: this.fb.control<File | null>(null, [Validators.required]),
  });

  protected fileChanged(): void {
    const fileList = Array.from(this.fileInput().nativeElement.files ?? []);
    console.log(fileList);
  }
}
