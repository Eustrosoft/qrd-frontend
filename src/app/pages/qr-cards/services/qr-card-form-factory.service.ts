import { inject, Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { QrCardAction, QrCardDataFormRecord, QrCardForm, QrCardFormGroup } from '@app/pages/qr-cards/qr-cards.models';
import { MAX_DESCRIPTION_LENGTH, MAX_NAME_LENGTH, MAX_URL_LENGTH } from '@app/pages/files/files.constants';
import { SharedFormFactoryService } from '@shared/service/shared-form-factory.service';
import { FileFormGroup } from '@shared/shared.models';
import { TemplateField } from '@api/templates/templates-api.models';
import { WEB_REGEXP } from '@shared/shared.constants';

@Injectable()
export class QrCardFormFactoryService {
  private readonly fb = inject(FormBuilder);
  private readonly sharedFormFactoryService = inject(SharedFormFactoryService);

  private _form: QrCardFormGroup | null = null;
  private _isInitialized = false;

  public initialize(initialData: Partial<QrCardFormGroup['getRawValue']> = {}, fieldList: TemplateField[] = []): void {
    if (!this._isInitialized) {
      this._form = this.makeQrCardForm(initialData, fieldList);
      this._isInitialized = true;
    }
  }

  get form(): QrCardFormGroup {
    if (!this._form) {
      throw new Error('Form not initialized. Call initialize() first.');
    }
    return this._form;
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

  public patchQrCardForm(value: Partial<QrCardFormGroup['getRawValue']>, emitEvent = true): void {
    this.form.patchValue(value, { emitEvent });
  }

  public patchDataFormRecord(fieldList: TemplateField[], emitEvent = true): void {
    Object.keys(this.form.controls.data.controls).forEach((controlName) => {
      this.form.controls.data.removeControl(controlName, { emitEvent });
    });
    this.form.controls.data.setParent(this.makeDataFormRecord(fieldList, emitEvent));
  }

  public reset(): void {
    if (this._isInitialized) {
      this._isInitialized = false;
      this._form = null;
    }
  }

  private makeQrCardForm(
    initialData: Partial<ReturnType<QrCardFormGroup['getRawValue']>> = {},
    fieldList: TemplateField[] = [],
  ): QrCardFormGroup {
    return this.fb.group<QrCardForm>({
      id: this.fb.nonNullable.control<number>(initialData?.id ?? -1),
      code: this.fb.nonNullable.control<number>(initialData?.code ?? -1),
      formId: this.fb.nonNullable.control<number>(initialData?.formId ?? -1),
      name: this.fb.nonNullable.control<string>(initialData?.name ?? '', [
        Validators.required,
        Validators.maxLength(MAX_NAME_LENGTH),
      ]),
      description: this.fb.nonNullable.control<string>(initialData?.description ?? '', [
        Validators.maxLength(MAX_DESCRIPTION_LENGTH),
      ]),
      action: this.fb.nonNullable.control<QrCardAction>('STD'),
      redirect: this.fb.nonNullable.control<string>('', [
        Validators.maxLength(MAX_URL_LENGTH),
        Validators.pattern(WEB_REGEXP),
      ]),
      data: this.makeDataFormRecord(fieldList ?? []),
      files: this.sharedFormFactoryService.makeFileFormGroupArray(initialData?.files ?? []),
    });
  }

  private makeDataFormRecord(fieldList: TemplateField[], emitEvent = true): QrCardDataFormRecord {
    const formRecord = this.fb.record({});

    fieldList.forEach((field) => {
      formRecord.addControl(field.name, this.fb.control(''), { emitEvent });
    });

    return formRecord;
  }
}
