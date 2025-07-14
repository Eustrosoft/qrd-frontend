import { DestroyRef } from '@angular/core';
import { DataViewDisplayType } from '@shared/shared.models';
import { TemplateFieldFormGroup } from '@app/pages/templates/templates.models';

export class FetchTemplateList {
  public static readonly type = '[Templates] Fetch Template List';
}

export class FetchTemplate {
  public static readonly type = '[Templates] Fetch Template';
  constructor(
    readonly id: number,
    readonly destroyRef: DestroyRef,
    readonly showLoading: boolean = true,
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

export class CreateTemplate {
  public static readonly type = '[Templates] Create Template';
  constructor(
    readonly payload: Partial<ReturnType<TemplateFieldFormGroup['getRawValue']>>,
    readonly destroyRef: DestroyRef,
  ) {}
}

export class SaveTemplate {
  public static readonly type = '[Templates] Save Template';
  constructor(
    readonly id: number,
    readonly payload: Partial<ReturnType<TemplateFieldFormGroup['getRawValue']>>,
    readonly destroyRef: DestroyRef,
  ) {}
}

export class AddFileToTemplate {
  public static readonly type = '[Templates] Add File To Template';
  constructor(
    readonly templateId: number,
    readonly fileId: number,
    readonly destroyRef: DestroyRef,
  ) {}
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
