import { FormControl, FormGroup } from '@angular/forms';

export type ViewMode = 'list' | 'table';
export type ViewModeSettings = Pick<
  ReturnType<SettingsFormGroup['getRawValue']>,
  'cardsViewMode' | 'templatesViewMode' | 'templateAttrsEditViewMode' | 'filesViewMode'
>;

export type SettingsFormGroup = FormGroup<SettingsForm>;
export type SettingsForm = {
  checkUploadSize: FormControl<boolean>;
  defaultQrPrintText: FormControl<string>;
  defaultQrPrintTextDown: FormControl<string>;
  cardsViewMode: FormControl<ViewMode>;
  templatesViewMode: FormControl<ViewMode>;
  templateAttrsEditViewMode: FormControl<ViewMode>;
  filesViewMode: FormControl<ViewMode>;
};

export type PasswordChangeFormGroup = FormGroup<PasswordChangeForm>;
export type PasswordChangeForm = {
  oldPassword: FormControl<string>;
  newPassword: FormControl<string>;
  confirmNewPassword: FormControl<string>;
};
