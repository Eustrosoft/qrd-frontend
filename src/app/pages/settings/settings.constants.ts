import { SettingsDto } from '@api/settings/settings-api.models';
import { BaseQrTableCols } from '@app/pages/qr-cards/qr-cards.constants';

export const SettingsLocalization = {
  checkUploadSize: $localize`:@@settings.checkUploadSize:Check file size before uploading`,
  defaultQrPrintText: $localize`:@@settings.defaultQrPrintText:Header text for QR print`,
  defaultQrPrintTextDown: $localize`:@@settings.defaultQrPrintTextDown:Footer text for QR print`,
  qrPrintVars: $localize`:@@settings.qrPrintUse:Use:
    \n {{qr-code}} - for card number
    \n {{qr-link}} - to link current card inside text
  `,
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
  qrTableColumns: [BaseQrTableCols[1], BaseQrTableCols[2], BaseQrTableCols[3]],
  defaultQrPrintText: '',
  defaultQrPrintTextDown: '',
  checkUploadSize: true,
};
