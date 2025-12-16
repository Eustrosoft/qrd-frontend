import { ValidGtinLengths } from '@shared/validators/gtin-length.validator';

export const Gs1Localization = {
  creation: $localize`:@@gs1.creation:Create new GS1`,
  editing: $localize`:@@gs1.editing:Edit GS1`,
  gtin: $localize`:@@gs1.gtin:GTIN`,
  noGtin: $localize`:@@gs1.noGtin:No GTIN`,
  key: $localize`:@@gs1.key:Key`,
  value: $localize`:@@gs1.value:Value`,
  tail: $localize`:@@gs1.tail:Tail`,
  digitalLinkPreview: $localize`:@@gs1.digitalLinkPreview:How link would look like`,
  nonNumericGtin: $localize`:@@gs1.nonNumericGtin:GTIN should contain only numbers`,
  invalidGtinLength: $localize`:@@gs1.invalidGtinLength:GTIN length should be ${ValidGtinLengths} symbols`,
  invalidGtinChecksum: $localize`:@@gs1.invalidGtinChecksum:GTIN checksum invalid`,
  invalidKey: $localize`:@@gs1.invalidKey:Key should contain only latin letters and numbers`,
  invalidValue: $localize`:@@gs1.invalidValue:Value should contain only latin letters and numbers`,
};
