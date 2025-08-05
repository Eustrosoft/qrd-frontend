import { inject, Injectable } from '@angular/core';
import { FileForm, FileFormGroup, FileFormGroupArray } from '@shared/shared.models';
import { FileStorageType } from '@api/files/files-api.models';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class SharedFormFactoryService {
  private readonly fb = inject(FormBuilder);

  public makeFileFormGroupArray(
    fileList: Partial<ReturnType<FileFormGroupArray['getRawValue']>> = [],
  ): FileFormGroupArray {
    return this.fb.array(fileList.map((field) => this.makeFileFormGroup(field)));
  }

  public makeFileFormGroup(initial: Partial<ReturnType<FileFormGroup['getRawValue']>> = {}): FileFormGroup {
    return this.fb.group<FileForm>({
      id: this.fb.nonNullable.control<number>(initial?.id ?? -1),
      fileStorageType: this.fb.nonNullable.control<FileStorageType>(initial?.fileStorageType ?? 'DB'),
      name: this.fb.nonNullable.control<string>(initial?.name ?? ''),
      description: this.fb.nonNullable.control<string>(initial?.description ?? ''),
      storagePath: this.fb.nonNullable.control<string>(initial?.storagePath ?? ''),
      fileSize: this.fb.nonNullable.control<number>(initial?.fileSize ?? 0),
      isPublic: this.fb.nonNullable.control<boolean>(initial?.isPublic ?? false),
      isActive: this.fb.nonNullable.control<boolean>(initial?.isActive ?? false),
      updated: this.fb.nonNullable.control<string>(initial?.updated ?? ''),
    });
  }
}
