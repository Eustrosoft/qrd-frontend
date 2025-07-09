import { DataViewDisplayType } from '@shared/shared.models';
import { DestroyRef } from '@angular/core';

export class FetchQrCardList {
  public static readonly type = '[Qr Cards] Fetch Qr Card List';
}

export class FetchQrCard {
  public static readonly type = '[Qr Cards] Fetch Qr Card';
  constructor(
    readonly code: string,
    readonly destroyRef: DestroyRef,
  ) {}
}

export class SetSelectedQrCards {
  public static readonly type = '[Qr Cards] Set Selected Qr Cards';
  constructor(readonly selectedQrCardList: number[]) {}
}

export class SelectAllQrCards {
  public static readonly type = '[Qr Cards] Select All Qr Cards';
}

export class SetQrCardsDataViewDisplayType {
  public static readonly type = '[Qr Cards] Set Cards Display Type';
  constructor(readonly displayType: DataViewDisplayType) {}
}

export class DeleteQrCards {
  public static readonly type = '[Qr Cards] Delete Qr Cards';
  constructor(
    readonly idList: number[],
    readonly destroyRef: DestroyRef,
    readonly refreshList: boolean = true,
    readonly returnToList: boolean = false,
  ) {}
}
