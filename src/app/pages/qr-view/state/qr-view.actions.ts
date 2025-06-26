import { DestroyRef } from '@angular/core';

export class FetchQR {
  public static readonly type = '[Qr View] Fetch QR';
  constructor(
    readonly q: string,
    readonly destroyRef: DestroyRef,
  ) {}
}
