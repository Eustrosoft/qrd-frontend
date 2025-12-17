import { inject, Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PCodeForm, PCodeFormGroup } from '@app/pages/p-codes/p-codes.models';

@Injectable({
  providedIn: 'root',
})
export class PCodesFormFactoryService {
  private readonly fb = inject(FormBuilder);

  private _form: PCodeFormGroup | null = null;
  private _isInitialized = false;

  public initialize(initialData: Partial<PCodeFormGroup['getRawValue']> = {}): void {
    if (!this._isInitialized) {
      this._form = this.makePCodeForm(initialData);
      this._isInitialized = true;
    }
  }

  public reset(): void {
    if (this._isInitialized) {
      this._isInitialized = false;
      this._form = null;
    }
  }

  get form(): PCodeFormGroup {
    this._form ??= this.makePCodeForm();
    return this._form;
  }

  private makePCodeForm(initialData: Partial<ReturnType<PCodeFormGroup['getRawValue']>> = {}): PCodeFormGroup {
    return this.fb.group<PCodeForm>({
      docId: this.fb.control<number | null>(initialData?.docId ?? null),
      rowId: this.fb.control<number | null>(initialData?.rowId ?? null),
      participantId: this.fb.nonNullable.control<number>(initialData?.participantId ?? -1),
      p: this.fb.nonNullable.control<string>(initialData?.p ?? ''),
      p2: this.fb.nonNullable.control<string>(initialData?.p2 ?? ''),
      p2Mode: this.fb.nonNullable.control<string>(initialData?.p2Mode ?? ''),
      p2Prompt: this.fb.nonNullable.control<string>(initialData?.p2Prompt ?? ''),
      hfields: this.fb.nonNullable.control<boolean>(initialData?.hfields ?? false),
      hfiles: this.fb.nonNullable.control<boolean>(initialData?.hfiles ?? false),
      comment: this.fb.nonNullable.control<string>(initialData?.comment ?? ''),
    });
  }
}
