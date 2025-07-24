import { DataViewDisplayType } from '@shared/shared.models';
import { DestroyRef } from '@angular/core';
import { QrCardFormGroup } from '@app/pages/qr-cards/qr-cards.models';
import { QrCardsStateModel } from '@app/pages/qr-cards/state/qr-cards.state';

export class FetchQrCardList {
  public static readonly type = '[Qr Cards] Fetch Qr Card List';
}

export class FetchQrCard {
  public static readonly type = '[Qr Cards] Fetch Qr Card';
  constructor(
    readonly code: string,
    readonly destroyRef?: DestroyRef,
    readonly showLoading: boolean = true,
    readonly storeProp: keyof QrCardsStateModel = 'isQrCardLoading',
  ) {}
}

export class ClearQrCard {
  public static readonly type = '[Qr Cards] Clear Qr Card';
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

export class CreateQrCard {
  public static readonly type = '[Qr Cards] Create Qr Card';
  constructor(
    readonly payload: Partial<ReturnType<QrCardFormGroup['getRawValue']>>,
    readonly destroyRef: DestroyRef,
  ) {}
}

export class SaveQrCard {
  public static readonly type = '[Qr Cards] Save v';
  constructor(
    readonly formValue: Partial<ReturnType<QrCardFormGroup['getRawValue']>>,
    readonly destroyRef: DestroyRef,
  ) {}
}

export class AddFileToQrCard {
  public static readonly type = '[Qr Cards] Add File To Qr Card';
  constructor(
    readonly qrCardId: number,
    readonly qrCardCode: string,
    readonly fileId: number,
    readonly destroyRef: DestroyRef,
  ) {}
}

export class FetchTemplateList {
  public static readonly type = '[Qr Cards] Fetch Template List';
  constructor(readonly destroyRef: DestroyRef) {}
}

export class FetchFileList {
  public static readonly type = '[Qr Cards] Fetch File List';
  constructor(readonly destroyRef: DestroyRef) {}
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

export class ResetQrCardsState {
  public static readonly type = '[Qr Cards] Reset Qr Cards State';
}
