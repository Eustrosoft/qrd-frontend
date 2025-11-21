import { ValidGtinLengths } from '@shared/validators/gtin-length.validator';

export const MarkingsLocalization = {
  creation: $localize`:@@markings.creation:Create new GS1`,
  editing: $localize`:@@markings.editing:Edit GS1`,
  gtin: $localize`:@@markings.gtin:GTIN`,
  key: $localize`:@@markings.key:Key`,
  value: $localize`:@@markings.value:Value`,
  tail: $localize`:@@markings.value:Tail`,
  comment: $localize`:@@markings.comment:Comment`,
  nonNumericGtin: $localize`:@@markings.nonNumericGtin:GTIN should contain only numbers`,
  invalidGtinLength: $localize`:@@markings.invalidGtinLength:GTIN length should be ${ValidGtinLengths} symbols`,
  invalidGtinChecksum: $localize`:@@markings.invalidGtinChecksum:GTIN checksum invalid`,
  invalidKey: $localize`:@@markings.invalidKey:Key should contain only latin letters and numbers`,
  invalidValue: $localize`:@@markings.invalidValue:Value should contain only latin letters and numbers`,
};
