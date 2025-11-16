import { inject, Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FileAsUrlForm, FileAsUrlFormGroup, FileUploadForm, FileUploadFormGroup } from '@app/pages/files/files.models';
import { WebRegExp } from '@shared/shared.constants';
import { MaxDescriptionLength, MaxNameLength, MaxUrlLength } from '@app/pages/files/files.constants';
import { distinctUntilChanged, map, pairwise, startWith, Subject, takeUntil } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { easyHash } from '@shared/utils/functions/easy-hash.function';

@Injectable()
export class FileUploadFormFactoryService {
  private readonly fb = inject(FormBuilder);
  private readonly destroy$ = new Subject<void>();

  private _fileUploadForm: FileUploadFormGroup | null = null;
  private _fileAsUrlForm: FileAsUrlFormGroup | null = null;

  get fileUploadForm(): FileUploadFormGroup {
    this._fileUploadForm ??= this.makeFileUploadForm();
    return this._fileUploadForm;
  }

  get fileAsUrlForm(): FileAsUrlFormGroup {
    this._fileAsUrlForm ??= this.makeFileAsUrlForm();
    return this._fileAsUrlForm;
  }

  public readonly fileUploadFormHasUnsavedChanges = toSignal(
    this.fileUploadForm.valueChanges.pipe(
      startWith(this.fileUploadForm.getRawValue()),
      map((value) => easyHash(value)),
      pairwise(),
      map(([prev, current]) => prev !== current),
      distinctUntilChanged(),
      takeUntil(this.destroy$),
    ),
    { initialValue: false },
  );

  public readonly fileAsUrlFormHasUnsavedChanges = toSignal(
    this.fileAsUrlForm.valueChanges.pipe(
      startWith(this.fileAsUrlForm.getRawValue()),
      map((value) => easyHash(value)),
      pairwise(),
      map(([prev, current]) => prev !== current),
      distinctUntilChanged(),
      takeUntil(this.destroy$),
    ),
    { initialValue: false },
  );

  private makeFileUploadForm(): FileUploadFormGroup {
    return this.fb.group<FileUploadForm>({
      name: this.fb.nonNullable.control<string>('', [Validators.required, Validators.maxLength(MaxNameLength)]),
      description: this.fb.nonNullable.control<string>('', [Validators.maxLength(MaxDescriptionLength)]),
      isActive: this.fb.nonNullable.control<boolean>(true),
      isPublic: this.fb.nonNullable.control<boolean>(true),
      file: this.fb.control<File | null>(null, [Validators.required]),
    });
  }

  private makeFileAsUrlForm(): FileAsUrlFormGroup {
    return this.fb.group<FileAsUrlForm>({
      name: this.fb.nonNullable.control<string>('', [Validators.required, Validators.maxLength(MaxNameLength)]),
      description: this.fb.nonNullable.control<string>('', [Validators.maxLength(MaxDescriptionLength)]),
      isActive: this.fb.nonNullable.control<boolean>(true),
      isPublic: this.fb.nonNullable.control<boolean>(true),
      storagePath: this.fb.nonNullable.control<string>('', [
        Validators.required,
        Validators.maxLength(MaxUrlLength),
        Validators.pattern(WebRegExp),
      ]),
    });
  }

  public patchFileUploadForm(value: Partial<FileUploadFormGroup['getRawValue']>, emitEvent = true): void {
    this.fileUploadForm.patchValue(value, { emitEvent });
  }

  public patchFileAsUrlForm(value: Partial<FileAsUrlFormGroup['getRawValue']>, emitEvent = true): void {
    this.fileAsUrlForm.patchValue(value, { emitEvent });
  }

  public resetFileUploadForm(): void {
    this.fileUploadForm.reset();
  }

  public dispose(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
