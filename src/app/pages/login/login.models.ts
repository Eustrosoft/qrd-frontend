import { FormControl } from '@angular/forms';

export type LoginForm = {
  username: FormControl<string>;
  password: FormControl<string>;
};
