import { FormControl, FormGroup } from '@angular/forms';

export type Gs1FormGroup = FormGroup<Gs1Form>;
export type Gs1Form = {
  id: FormControl<number | null>;
  qrId: FormControl<number | null>;
  rtype: FormControl<string>;
  gtin: FormControl<string | null>;
  key: FormControl<string>;
  value: FormControl<string>;
  tail: FormControl<string>;
  comment: FormControl<string>;
};
