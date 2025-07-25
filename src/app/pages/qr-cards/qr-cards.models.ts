import { FormControl, FormGroup, FormRecord } from '@angular/forms';
import { FileFormGroupArray } from '@shared/shared.models';

export type QrCardAction = 'STD' | 'REDIRECT' | 'REDIRECT_QR_SVC' | 'HIDE';

export type QrCardFormGroup = FormGroup<QrCardForm>;
export type QrCardForm = {
  id: FormControl<number>;
  code: FormControl<number>;
  formId: FormControl<number>;
  name: FormControl<string>;
  description: FormControl<string>;
  action: FormControl<QrCardAction>;
  redirect: FormControl<string>;
  data: QrCardDataFormRecord;
  files: FileFormGroupArray;
};

export type QrCardCreationFormGroup = FormGroup<QrCardCreationForm>;
export type QrCardCreationForm = {
  name: FormControl<string>;
  description: FormControl<string>;
  formId: FormControl<number | null>;
  rangeId: FormControl<number | null>;
};
export type QrCardDataFormRecord = FormRecord<FormControl<unknown>>;
