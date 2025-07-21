import { inject, Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  TemplateFieldForm,
  TemplateFieldFormGroup,
  TemplateFieldFormGroupArray,
  TemplateForm,
  TemplateFormGroup,
} from '@app/pages/templates/templates.models';
import { FileForm, FileFormGroup, FileFormGroupArray } from '@shared/shared.models';
import { FieldType } from '@api/templates/template-api.models';
import { FileStorageType } from '@api/files/file-api.models';
import { MAX_DESCRIPTION_LENGTH, MAX_NAME_LENGTH } from '@app/pages/files/files.constants';
import { Subject } from 'rxjs';

@Injectable()
export class TemplateFormFactoryService {
  private readonly fb = inject(FormBuilder);
  private readonly destroy$ = new Subject<void>();

  private _form: TemplateFormGroup | null = null;
  private _isInitialized = false;

  public initialize(initialData: Partial<TemplateFormGroup['getRawValue']> = {}): void {
    if (!this._isInitialized) {
      this._form = this.makeTemplateForm(initialData);
      this._isInitialized = true;
    }
  }

  get form(): TemplateFormGroup {
    if (!this._form) {
      throw new Error('Form not initialized. Call initialize() first.');
    }
    return this._form;
  }

  private makeTemplateForm(initialData: Partial<ReturnType<TemplateFormGroup['getRawValue']>> = {}): TemplateFormGroup {
    return this.fb.group<TemplateForm>({
      name: this.fb.nonNullable.control<string>(initialData?.name ?? '', [
        Validators.required,
        Validators.maxLength(MAX_NAME_LENGTH),
      ]),
      description: this.fb.nonNullable.control<string>(initialData?.description ?? '', [
        Validators.maxLength(MAX_DESCRIPTION_LENGTH),
      ]),
      fields: this.makeFieldFormGroupArray(initialData?.fields ?? []),
      files: this.makeFileFormGroupArray(initialData?.files ?? []),
    });
  }

  public patchTemplateForm(value: Partial<TemplateFormGroup['getRawValue']>, emitEvent = true): void {
    this.form.patchValue(value, { emitEvent });
  }

  public addField(initial: Partial<ReturnType<TemplateFieldFormGroup['getRawValue']>> = {}, emitEvent = true): void {
    this.form.controls.fields.push(this.makeFieldFormGroup(initial), { emitEvent });
  }

  public patchFields(
    fieldList: Partial<ReturnType<TemplateFieldFormGroup['getRawValue']>>[] = [],
    emitEvent = true,
  ): void {
    this.form.controls.fields.clear({ emitEvent });
    for (const field of fieldList) {
      this.addField(field, emitEvent);
    }
  }

  public deleteField(index: number): void {
    this.form.controls.fields.removeAt(index);
  }

  public addFile(initial: Partial<ReturnType<FileFormGroup['getRawValue']>> = {}, emitEvent = true): void {
    this.form.controls.files.push(this.makeFileFormGroup(initial), { emitEvent });
  }

  public patchFiles(fileList: Partial<ReturnType<FileFormGroup['getRawValue']>>[] = [], emitEvent = true): void {
    this.form.controls.files.clear({ emitEvent });
    for (const file of fileList) {
      this.addFile(file, emitEvent);
    }
  }

  public deleteFile(index: number): void {
    this.form.controls.files.removeAt(index);
  }

  protected makeFieldFormGroupArray(
    fieldList: Partial<ReturnType<TemplateFieldFormGroupArray['getRawValue']>> = [],
  ): TemplateFieldFormGroupArray {
    return this.fb.array(fieldList.map((field) => this.makeFieldFormGroup(field)));
  }

  protected makeFieldFormGroup(
    initial: Partial<ReturnType<TemplateFieldFormGroup['getRawValue']>> = {},
  ): TemplateFieldFormGroup {
    const last = this._form ? this._form.controls.fields.length + 1 : 1;
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

  protected makeFileFormGroupArray(
    fileList: Partial<ReturnType<FileFormGroupArray['getRawValue']>> = [],
  ): FileFormGroupArray {
    return this.fb.array(fileList.map((field) => this.makeFileFormGroup(field)));
  }

  protected makeFileFormGroup(initial: Partial<ReturnType<FileFormGroup['getRawValue']>> = {}): FileFormGroup {
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

  public dispose(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
