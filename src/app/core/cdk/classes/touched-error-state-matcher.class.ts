import { ErrorStateMatcher } from '@angular/material/core';
import { AbstractControl } from '@angular/forms';

export class TouchedErrorStateMatcher implements ErrorStateMatcher {
  public isErrorState(control: AbstractControl | null): boolean {
    return !!(control?.touched && control?.invalid);
  }
}
