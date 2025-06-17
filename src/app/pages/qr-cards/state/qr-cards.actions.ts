import { DataViewDisplayType } from '@shared/shared.models';

export class FetchQrCards {
  public static readonly type = '[Qr Cards] Fetch Qr Cards';
}

export class SetSelectedQrCards {
  public static readonly type = '[Qr Cards] Set Selected Qr Cards';
  constructor(readonly selectedQrCardList: number[]) {}
}

export class SelectedAllQrCards {
  public static readonly type = '[Qr Cards]  Select All Qr Cards';
}

export class SetQrCardsDataViewDisplayType {
  public static readonly type = '[Qr Cards] Set Cards Display Type';
  constructor(readonly displayType: DataViewDisplayType) {}
}
