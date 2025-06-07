import { DataViewDisplayType } from '@shared/shared.models';

export class FetchQrCards {
  public static readonly type = '[Qr Cards] Fetch Qr Cards';
}

export class SetQrCardsDataViewDisplayType {
  public static readonly type = '[Qr Cards] Set Cards Display Type';
  constructor(public displayType: DataViewDisplayType) {}
}
