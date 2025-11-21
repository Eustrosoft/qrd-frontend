import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function gs1KeyValueValidator(): ValidatorFn {
  return (control: AbstractControl<string, string>): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const latinAndNumbersRegex = /^[a-zA-Z0-9]*$/;

    if (!latinAndNumbersRegex.test(value)) {
      return {
        invalid: true,
      };
    }

    return null;
  };
}
