import { DestroyRef } from '@angular/core';
import { QrCardCreationFormGroup, QrCardFormGroup } from '@app/pages/qr-cards/qr-cards.models';
import { QrCardsStateModel } from '@app/pages/qr-cards/state/qr-cards.state';

export class FetchQrCardList {
  public static readonly type = '[Qr Cards] Fetch Qr Card List';
  constructor(
    readonly destroyRef: DestroyRef,
    readonly rangeIds: number[] = [],
  ) {}
}

export class SetQrCardListSearchValue {
  public static readonly type = '[Qr Cards] Set Qr Card List Search Value';
  constructor(readonly searchValue: string) {}
}

export class FetchQrCard {
  public static readonly type = '[Qr Cards] Fetch Qr Card';
  constructor(
    readonly id: number | string,
    /**
     * @deprecated убрать после фикса form: null
     */
    readonly code?: string,
    readonly destroyRef?: DestroyRef,
    readonly showLoading: boolean = true,
    readonly storeProp: keyof QrCardsStateModel = 'isQrCardLoading',
  ) {}
}

export class FetchGs1LabelList {
  public static readonly type = '[Qr Cards] Fetch Gs1 Label List';
  constructor(
    readonly destroyRef: DestroyRef,
    readonly qrId?: number,
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

export class CreateQrCard {
  public static readonly type = '[Qr Cards] Create Qr Card';
  constructor(
    readonly payload: ReturnType<QrCardCreationFormGroup['getRawValue']>,
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

export class AddFilesToQrCard {
  public static readonly type = '[Qr Cards] Add Files To Qr Card';
  constructor(
    readonly qrCardId: number,
    readonly qrCardCode: string,
    readonly fileIdList: number[],
    readonly destroyRef: DestroyRef,
  ) {}
}

export class ReplaceQrCardFields {
  public static readonly type = '[Qr Cards] Replace Qr Card Fields';
  constructor(
    readonly formValue: Partial<ReturnType<QrCardFormGroup['getRawValue']>>,
    readonly destroyRef: DestroyRef,
  ) {}
}

export class FetchTemplateList {
  public static readonly type = '[Qr Cards] Fetch Template List';
  constructor(readonly destroyRef: DestroyRef) {}
}

export class FetchQrRangeList {
  public static readonly type = '[Qr Cards] Fetch Qr Range List';
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
