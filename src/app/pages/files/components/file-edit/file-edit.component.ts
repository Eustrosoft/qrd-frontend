import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FileUploadComponent } from '@app/pages/files/components/file-upload/file-upload.component';
import { CardContainerComponent } from '@shared/components/card-container/card-container.component';

@Component({
  selector: 'file-edit',
  imports: [FileUploadComponent, CardContainerComponent],
  templateUrl: './file-edit.component.html',
  styleUrl: './file-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileEditComponent {}
