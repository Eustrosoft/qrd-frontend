import { SettingsDto } from '@api/settings/settings-api.models';
import { ALL_QR_TABLE_COLS } from '@app/pages/qr-cards/qr-cards.constants';

export const SettingsLocalization = {
  checkUploadSize: $localize`:@@settings.checkUploadSize:Check file size before uploading`,
  defaultQrPrintText: $localize`:@@settings.defaultQrPrintText:Header text for QR print`,
  defaultQrPrintTextDown: $localize`:@@settings.defaultQrPrintTextDown:Footer text for QR print`,
  main: $localize`:@@settings.main:Main`,
  changePassword: $localize`:@@settings.changePassword:Change password`,
  oldPassword: $localize`:@@settings.oldPassword:Old password`,
  newPassword: $localize`:@@settings.newPassword:New password`,
  repeatNewPassword: $localize`:@@settings.repeatNewPassword:Repeat new password`,
  passwordsMismatch: $localize`:@@settings.passwordsMismatch:Passwords mismatch`,
  passwordUpdated: $localize`:@@settings.passwordUpdated:Password was successfully updated`,
  passwordUpdateErr: $localize`:@@settings.passwordUpdateErr:An error occurred while updating password`,
};
export const DEFAULT_SETTINGS: SettingsDto['settings'] = {
  language: 'en-US',
  qrTableColumns: [ALL_QR_TABLE_COLS[1], ALL_QR_TABLE_COLS[2], ALL_QR_TABLE_COLS[3]],
  defaultQrPrintText: '',
  defaultQrPrintTextDown: '',
  checkUploadSize: true,
};
