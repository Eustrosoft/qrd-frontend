import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FileUploadComponent } from '@app/pages/files/components/file-upload/file-upload.component';

@Component({
  selector: 'file-edit',
  imports: [FileUploadComponent],
  templateUrl: './file-edit.component.html',
  styleUrl: './file-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileEditComponent {}
