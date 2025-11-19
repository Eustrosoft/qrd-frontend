import { DestroyRef } from '@angular/core';

export class FetchMarking {
  public static readonly type = '[Markings] Fetch Marking';
  constructor(readonly id: number) {}
}

export class CreateMarking {
  public static readonly type = '[Markings] Create Marking';
  constructor() {}
}

export class SaveMarking {
  public static readonly type = '[Markings] Save Marking';
  constructor() {}
}

export class DeleteMarking {
  public static readonly type = '[Markings] Save Marking';
  constructor(readonly id: number) {}
}

export class FetchQrCardList {
  public static readonly type = '[Markings] Fetch Qr Card List';
  constructor(readonly destroyRef: DestroyRef) {}
}

export class ResetMarkingsState {
  public static readonly type = '[Markings] Reset Markings State';
}
