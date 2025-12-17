import { DestroyRef } from '@angular/core';
import { Gs1FormGroup } from '@app/pages/gs1/gs1.models';

export class FetchGs1List {
  public static readonly type = '[Gs1] Fetch Gs1 List';
  constructor(
    readonly destroyRef: DestroyRef,
    readonly qrId?: number,
  ) {}
}

export class FetchGs1 {
  public static readonly type = '[Gs1] Fetch Gs1';
  constructor(
    readonly id: number,
    readonly destroyRef?: DestroyRef,
  ) {}
}

export class CreateGs1 {
  public static readonly type = '[Gs1] Create Gs1';
  constructor(
    readonly payload: ReturnType<Gs1FormGroup['getRawValue']>,
    readonly isGtinValid: boolean,
    readonly destroyRef: DestroyRef,
  ) {}
}

export class SaveGs1 {
  public static readonly type = '[Gs1] Save Gs1';
  constructor(
    readonly payload: ReturnType<Gs1FormGroup['getRawValue']>,
    readonly isGtinValid: boolean,
    readonly destroyRef: DestroyRef,
  ) {}
}

export class ResetGs1State {
  public static readonly type = '[Gs1] Reset Gs1 State';
}
