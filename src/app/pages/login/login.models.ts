import { FormControl, FormGroup } from '@angular/forms';

export type LoginFormGroup = FormGroup<LoginForm>;
export type LoginForm = {
  login: FormControl<string>;
  password: FormControl<string>;
};
