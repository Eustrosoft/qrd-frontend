import { inject, Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Gs1Form, Gs1FormGroup } from '@app/pages/markings/markings.models';
import { gtinValidator } from '@shared/validators/gtin-length.validator';

@Injectable({
  providedIn: 'root',
})
export class Gs1FormFactoryService {
  private readonly fb = inject(FormBuilder);

  private _form: Gs1FormGroup | null = null;
  private _isInitialized = false;

  public initialize(initialData: Partial<Gs1FormGroup['getRawValue']> = {}): void {
    if (!this._isInitialized) {
      this._form = this.makeGs1Form(initialData);
      this._isInitialized = true;
    }
  }

  public reset(): void {
    if (this._isInitialized) {
      this._isInitialized = false;
      this._form = null;
    }
  }

  get form(): Gs1FormGroup {
    this._form ??= this.makeGs1Form();
    return this._form;
  }

  private makeGs1Form(initialData: Partial<ReturnType<Gs1FormGroup['getRawValue']>> = {}): Gs1FormGroup {
    console.log(initialData);
    return this.fb.group<Gs1Form>({
      id: this.fb.control<number | null>(initialData?.id ?? null),
      qrId: this.fb.nonNullable.control<number>(initialData?.qrId ?? -1, [Validators.required]),
      rtype: this.fb.nonNullable.control<number>(initialData?.rtype ?? -1),
      gtin: this.fb.nonNullable.control<number>(initialData?.gtin ?? -1, [gtinValidator()]),
      key: this.fb.nonNullable.control<string>(initialData?.key ?? ''),
      value: this.fb.nonNullable.control<string>(initialData?.value ?? ''),
      tail: this.fb.nonNullable.control<string>(initialData?.tail ?? ''),
      comment: this.fb.nonNullable.control<string>(initialData?.comment ?? ''),
    });
  }
}
