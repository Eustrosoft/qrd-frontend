import { inject, Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  TemplateFieldForm,
  TemplateFieldFormGroup,
  TemplateFieldFormGroupArray,
  TemplateForm,
  TemplateFormGroup,
} from '@app/pages/templates/templates.models';
import { FileFormGroup } from '@shared/shared.models';
import { FieldType } from '@api/templates/template-api.models';
import { MAX_DESCRIPTION_LENGTH, MAX_NAME_LENGTH } from '@app/pages/files/files.constants';
import { SharedFormFactoryService } from '@shared/service/shared-form-factory.service';

@Injectable()
export class TemplateFormFactoryService {
  private readonly fb = inject(FormBuilder);
  private readonly sharedFormFactoryService = inject(SharedFormFactoryService);

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
      files: this.sharedFormFactoryService.makeFileFormGroupArray(initialData?.files ?? []),
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
    this.form.controls.files.push(this.sharedFormFactoryService.makeFileFormGroup(initial), { emitEvent });
  }

  public patchFiles(fileList: Partial<ReturnType<FileFormGroup['getRawValue']>>[] = [], emitEvent = true): void {
    this.form.controls.files.clear({ emitEvent });
    for (const file of fileList) {
      this.addFile(file, emitEvent);
    }
  }

  public removeFile(index: number): void {
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
}
