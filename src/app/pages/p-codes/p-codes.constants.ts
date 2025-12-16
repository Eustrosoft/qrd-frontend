import { Pin2Length } from '@app/pages/p-codes/p-codes.models';

export const PCodesLocalization = {
  creation: $localize`:@@pCodes.creation:Create new PIN`,
  editing: $localize`:@@pCodes.editing:Edit PIN`,
  pin: $localize`:@@pCodes.pin:PIN`,
  noPin: $localize`:@@pCodes.noPin:No PIN`,
  p2Mode: $localize`:@@pCodes.p2Mode:PIN2 mode`,
  pin2Prompt: $localize`:@@pCodes.pin2Prompt:PIN2 Prompt`,
  noPin2Prompt: $localize`:@@pCodes.noPin2Prompt:No PIN2 Prompt`,
  showHiddenFields: $localize`:@@pCodes.showHiddenFields:Show hidden fields`,
  showHiddenFiles: $localize`:@@pCodes.showHiddenFiles:Show hidden files`,
};

export const Pin2Alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' as const;
export const Pin2Sizes: readonly Pin2Length[] = [12, 13, 14, 15, 16] as const;
