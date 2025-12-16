import { FormControl, FormGroup } from '@angular/forms';

export type PCodeFormGroup = FormGroup<PCodeForm>;
export type PCodeForm = {
  docId: FormControl<number | null>;
  rowId: FormControl<number | null>;
  p: FormControl<string>;
  p2: FormControl<string>;
  p2Mode: FormControl<string>;
  p2Prompt: FormControl<string>;
  hfields: FormControl<boolean>;
  hfiles: FormControl<boolean>;
  comment: FormControl<string>;
};

export type Pin2Length = 12 | 13 | 14 | 15 | 16;
