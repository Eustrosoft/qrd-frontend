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
  protected selectorEventHandler(ids: number[]): void {
    const existingFiles = this.existingFiles();
    const fileMap = new Map(existingFiles.map((file) => [file.id, file]));

    const hasDupes: number[] = this.duplicateCheckService.findCommon(
      existingFiles.map((file) => file.id),
      ids,
    );

    if (hasDupes.length) {
      const fileNames = hasDupes.map((id) => fileMap.get(id)?.name).filter((name): name is string => Boolean(name));
      this.hostCmp?.handleDuplicateError(`${FilesLocalization.duplicatedFiles}: ${fileNames.toString()}`);
    }
  }

  @HostListener('fileSelected', ['$event'])
  protected uploadBlobEventHandler(file: File): void {
    const hasDupes = this.duplicateCheckService.findCommon(
      this.existingFiles().map((file) => file.name),
      [file.name],
    );
    if (hasDupes.length) {
      this.hostCmp?.handleDuplicateError(`${FilesLocalization.duplicatedFiles}: ${hasDupes.toString()}`);
    }
  }
}
