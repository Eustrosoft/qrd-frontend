import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(pwdControl: string, confirmPwdControl: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const passwordControl = control.get(pwdControl);
    const confirmPasswordControl = control.get(confirmPwdControl);

    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }
    if (confirmPasswordControl.errors?.['passwordMismatch']) {
      const newErrors = { ...confirmPasswordControl.errors };
      delete newErrors['passwordMismatch'];
      confirmPasswordControl.setErrors(Object.keys(newErrors).length ? newErrors : null);
    }

    if (!passwordControl.value || !confirmPasswordControl.value) {
      return null;
    }

    if (passwordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({
        ...confirmPasswordControl.errors,
        passwordMismatch: true,
      });
    }

    return null;
  };
}
