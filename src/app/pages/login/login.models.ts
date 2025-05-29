import { FormControl, FormGroup } from '@angular/forms';

export type LoginFormGroup = FormGroup<LoginForm>;
export type LoginForm = {
  username: FormControl<string>;
  password: FormControl<string>;
};
