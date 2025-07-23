import { FormControl, FormGroup, FormRecord } from '@angular/forms';
import { FileFormGroupArray } from '@shared/shared.models';

export type QrCardAction = 'STD' | 'REDIRECT' | 'REDIRECT_QR_SVC' | 'HIDE';

export type QrCardFormGroup = FormGroup<QrCardForm>;
export type QrCardForm = {
  formId: FormControl<number>;
  name: FormControl<string>;
  description: FormControl<string>;
  action: FormControl<QrCardAction>;
  redirect: FormControl<string>;
  data: QrCardDataFormRecord;
  files: FileFormGroupArray;
};

export type QrCardDataFormRecord = FormRecord<FormControl<unknown>>;
