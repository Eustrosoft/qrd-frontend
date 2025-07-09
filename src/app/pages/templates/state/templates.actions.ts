import { DestroyRef } from '@angular/core';
import { DataViewDisplayType } from '@shared/shared.models';

export class FetchTemplateList {
  public static readonly type = '[Templates] Fetch Template List';
}

export class FetchTemplate {
  public static readonly type = '[Templates] Fetch Template';
  constructor(
    readonly id: number,
    readonly destroyRef: DestroyRef,
  ) {}
}

export class SetSelectedTemplates {
  public static readonly type = '[Templates] Set Selected Templates';
  constructor(readonly selectedTemplateList: number[]) {}
}

export class SelectAllTemplates {
  public static readonly type = '[Templates] Select All Templates';
}

export class SetTemplatesDataViewDisplayType {
  public static readonly type = '[Templates] Set Templates Display Type';
  constructor(readonly displayType: DataViewDisplayType) {}
}

export class DeleteTemplates {
  public static readonly type = '[Templates] Delete Templates';
  constructor(
    readonly idList: number[],
    readonly destroyRef: DestroyRef,
    readonly refreshList: boolean = true,
    readonly returnToList: boolean = false,
  ) {}
}
