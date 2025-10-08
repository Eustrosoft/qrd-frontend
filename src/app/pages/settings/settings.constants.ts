import { SettingsDto } from '@api/settings/settings-api.models';
import { BaseQrTableCols } from '@app/pages/qr-cards/qr-cards.constants';
import { ViewModeSettings } from '@app/pages/settings/settings.models';

export const SettingsLocalization = {
  checkUploadSize: $localize`:@@settings.checkUploadSize:Check file size before uploading`,
  defaultQrPrintText: $localize`:@@settings.defaultQrPrintText:Header text for QR print`,
  defaultQrPrintTextDown: $localize`:@@settings.defaultQrPrintTextDown:Footer text for QR print`,
  qrPrintVars: $localize`:@@settings.qrPrintUse:Use:
    \n {{qr-code}} - for card number
    \n {{qr-link}} - to link current card inside text
  `,
  main: $localize`:@@settings.main:Main`,
  viewMode: $localize`:@@settings.viewMode:View mode`,
  changePassword: $localize`:@@settings.changePassword:Change password`,
  qrTableSettings: $localize`:@@settings.qrTableSettings:QR table settings`,
  oldPassword: $localize`:@@settings.oldPassword:Old password`,
  newPassword: $localize`:@@settings.newPassword:New password`,
  repeatNewPassword: $localize`:@@settings.repeatNewPassword:Repeat new password`,
  passwordsMismatch: $localize`:@@settings.passwordsMismatch:Passwords mismatch`,
  passwordUpdated: $localize`:@@settings.passwordUpdated:Password was successfully updated`,
  passwordUpdateErr: $localize`:@@settings.passwordUpdateErr:An error occurred while updating password`,
  qrCardsViewMode: $localize`:@@settings.qrCardsViewMode:Cards layout`,
  templatesViewMode: $localize`:@@settings.templatesViewMode:Templates layout`,
  templateAttrsEditViewMode: $localize`:@@settings.templateAttrsEditViewMode:Template attributes edit layout`,
  filesViewMode: $localize`:@@settings.filesViewMode:Files layout`,
};

export const DEFAULT_SETTINGS: SettingsDto['settings'] = {
  language: 'en-US',
  qrTableColumns: [BaseQrTableCols[1], BaseQrTableCols[2], BaseQrTableCols[3]],
  defaultQrPrintText: '',
  defaultQrPrintTextDown: '',
  checkUploadSize: true,
};

export const DEFAULT_VIEW_MODE_SETTINGS: ViewModeSettings = {
  qrCardListViewMode: 'list',
  templateListViewMode: 'list',
  templateAttrsEditViewMode: 'table',
  fileListViewMode: 'list',
};
