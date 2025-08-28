import { Column } from '@api/settings/settings-api.models';
import { SharedLocalization } from '@shared/shared.constants';

export const QrCardsLocalization = {
  viewCard: $localize`:@@qrCards.viewCard:View card`,
  previewCard: $localize`:@@qrCards.previewCard:Preview card`,
  creation: $localize`:@@qrCards.creation:Create new QR card`,
  editing: $localize`:@@qrCards.editing:Edit QR card`,
} as const;

export const QrCardActionsLocalization = {
  std: $localize`:@@qrCardActions.std:Standard`,
  redirect: $localize`:@@qrCardActions.redirect:Redirect`,
  redirectQrSvc: $localize`:@@qrCardActions.redirectQrSvc:Redirect to another QR service`,
  hide: $localize`:@@qrCardActions.hide:Hide QR card`,
} as const;

export const AllQrTableCols: Column[] = [
  {
    type: 'qr_image',
    fieldName: 'code_picture',
    name: 'QR',
    enable: true,
  },
  {
    type: 'qr_code',
    fieldName: 'code',
    name: SharedLocalization.code,
    enable: true,
  },
  {
    type: 'text',
    fieldName: 'name',
    name: SharedLocalization.name,
    enable: true,
  },
  {
    type: 'text',
    fieldName: 'description',
    name: SharedLocalization.description,
    enable: true,
  },
  {
    type: 'date',
    fieldName: 'created',
    name: SharedLocalization.createDate,
    enable: true,
  },
  {
    type: 'date',
    fieldName: 'updated',
    name: SharedLocalization.updateDate,
    enable: true,
  },
];
