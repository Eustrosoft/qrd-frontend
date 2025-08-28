import { SettingsDto } from '@api/settings/settings-api.models';
import { AllQrTableCols } from '@app/pages/qr-cards/qr-cards.constants';

export const SettingsLocalization = {
  checkUploadSize: $localize`:@@settings.checkUploadSize:Check file size before uploading`,
  defaultQrPrintText: $localize`:@@settings.defaultQrPrintText:Header text for QR print`,
  defaultQrPrintTextDown: $localize`:@@settings.defaultQrPrintTextDown:Footer text for QR print`,
  main: $localize`:@@settings.main:Main`,
  changePassword: $localize`:@@settings.changePassword:Change password`,
  qrTableSettings: $localize`:@@settings.qrTableSettings:QR table settings`,
  oldPassword: $localize`:@@settings.oldPassword:Old password`,
  newPassword: $localize`:@@settings.newPassword:New password`,
  repeatNewPassword: $localize`:@@settings.repeatNewPassword:Repeat new password`,
  passwordsMismatch: $localize`:@@settings.passwordsMismatch:Passwords mismatch`,
  passwordUpdated: $localize`:@@settings.passwordUpdated:Password was successfully updated`,
  passwordUpdateErr: $localize`:@@settings.passwordUpdateErr:An error occurred while updating password`,
};
export const DEFAULT_SETTINGS: SettingsDto['settings'] = {
  language: 'en-US',
  qrTableColumns: [AllQrTableCols[1], AllQrTableCols[2], AllQrTableCols[3]],
  defaultQrPrintText: '',
  defaultQrPrintTextDown: '',
  checkUploadSize: true,
};
