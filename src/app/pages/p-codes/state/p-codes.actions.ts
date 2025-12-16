import { DestroyRef } from '@angular/core';
import { PCodeFormGroup } from '@app/pages/p-codes/p-codes.models';

export class FetchPCodeList {
  public static readonly type = '[PCodes] Fetch PCode List';
  constructor(
    readonly docId: number,
    readonly destroyRef: DestroyRef,
  ) {}
}

export class FetchPCode {
  public static readonly type = '[PCodes] Fetch PCode';
  constructor(
    readonly docId: number,
    readonly destroyRef?: DestroyRef,
  ) {}
}

export class CreatePCode {
  public static readonly type = '[PCodes] Create PCode';
  constructor(
    readonly payload: ReturnType<PCodeFormGroup['getRawValue']>,
    readonly destroyRef: DestroyRef,
  ) {}
}

export class SavePCode {
  public static readonly type = '[PCodes] Save PCode';
  constructor(
    readonly payload: ReturnType<PCodeFormGroup['getRawValue']>,
    readonly destroyRef: DestroyRef,
  ) {}
}

export class ResetPCodeState {
  public static readonly type = '[PCodes] Reset PCode State';
}
