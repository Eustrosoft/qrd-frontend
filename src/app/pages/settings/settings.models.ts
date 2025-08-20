import { FormControl, FormGroup } from '@angular/forms';

export type SettingsForm = {
  checkUploadSize: FormControl<boolean>;
  defaultQrPrintText: FormControl<string>;
  defaultQrPrintTextDown: FormControl<string>;
};

export type PasswordChangeFormGroup = FormGroup<PasswordChangeForm>;
export type PasswordChangeForm = {
  oldPassword: FormControl<string>;
  newPassword: FormControl<string>;
  confirmNewPassword: FormControl<string>;
};
