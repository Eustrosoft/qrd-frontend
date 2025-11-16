import { Directive, HostListener, inject, input } from '@angular/core';
import { FileDto } from '@api/files/files-api.models';
import { DuplicateCheckService } from '@shared/service/duplicate-check.service';
import { FilesLocalization } from '@app/pages/files/files.constants';
import { DUPLICATE_ERROR_HANDLER_CMP } from '@cdk/tokens/custom-validator.token';

@Directive({
  selector: '[fileDuplicates]',
})
export class FileDuplicatesDirective<T extends Pick<FileDto, 'id' | 'name'>> {
  public readonly existingFiles = input<T[]>([]);

  private readonly hostCmp = inject(DUPLICATE_ERROR_HANDLER_CMP, { optional: true, host: true });
  private readonly duplicateCheckService = inject(DuplicateCheckService);

  @HostListener('selectedFilesChange', ['$event'])
  protected selectorEventHandler(fileList: FileDto[]): void {
    const dupes = this.duplicateCheckService.findCommon(
      this.existingFiles().map((file) => file.name),
      fileList.map((file) => file.name),
    );

    if (dupes.length) {
      this.hostCmp?.handleDuplicateError(`${FilesLocalization.duplicatedFiles}: ${dupes.toString()}`);
    }
  }

  @HostListener('fileSelected', ['$event'])
  protected uploadBlobEventHandler(file: File): void {
    const dupes = this.duplicateCheckService.findCommon(
      this.existingFiles().map((file) => file.name),
      [file.name],
    );

    if (dupes.length) {
      this.hostCmp?.handleDuplicateError(`${FilesLocalization.duplicatedFiles}: ${dupes.toString()}`);
    }
  }
}
