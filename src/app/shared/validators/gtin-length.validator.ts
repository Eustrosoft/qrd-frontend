import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const ValidGtinLengths = [8, 12, 13, 14];

function computeGtinCheckDigit(withoutCheckDigit: string): number {
  const digits = withoutCheckDigit
    .split('')
    .reverse()
    .map((ch) => parseInt(ch, 10));
  let total = 0;
  for (let i = 0; i < digits.length; i++) {
    const weight = i % 2 === 0 ? 3 : 1;
    total += digits[i] * weight;
  }
  return (10 - (total % 10)) % 10;
}

export function gtinValidator(): ValidatorFn {
  return (control: AbstractControl<number, number>): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const normalized = String(value).replace(/[\s-]+/g, '');

    if (!/^\d+$/.test(normalized)) {
      return { nonNumericGtin: true };
    }

    if (!ValidGtinLengths.includes(normalized.length)) {
      return { invalidGtinLength: true };
    }

    const withoutCheck = normalized.slice(0, -1);
    const providedCheck = parseInt(normalized.slice(-1), 10);
    const expectedCheck = computeGtinCheckDigit(withoutCheck);

    if (providedCheck !== expectedCheck) {
      return {
        invalidGtinChecksum: true,
      };
    }

    return null;
  };
}
