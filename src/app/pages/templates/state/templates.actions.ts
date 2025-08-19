import { DestroyRef } from '@angular/core';
import { DataViewDisplayType } from '@shared/shared.models';
import { TemplateCreationFormGroup, TemplateFieldFormGroup } from '@app/pages/templates/templates.models';
import { TemplatesStateModel } from '@app/pages/templates/state/templates.state';

export class FetchTemplateList {
  public static readonly type = '[Templates] Fetch Template List';
}

export class SetTemplateListSearchValue {
  public static readonly type = '[Templates] Set Template List Search Value';
  constructor(readonly searchValue: string) {}
}

export class FetchTemplate {
  public static readonly type = '[Templates] Fetch Template';
  constructor(
    readonly id: number,
    readonly destroyRef?: DestroyRef,
    readonly showLoading: boolean = true,
    readonly loadingStoreProp: keyof TemplatesStateModel = 'isTemplateLoading',
  ) {}
}

export class ClearTemplate {
  public static readonly type = '[Templates] Clear Template';
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
    readonly payload: ReturnType<TemplateCreationFormGroup['getRawValue']>,
    readonly destroyRef: DestroyRef,
  ) {}
}

export class CreateDefaultTemplate {
  public static readonly type = '[Templates] Create Default Template';
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

export class FetchFileList {
  public static readonly type = '[Templates] Fetch File List';
  constructor(readonly destroyRef: DestroyRef) {}
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

export class ResetTemplatesState {
  public static readonly type = '[Templates] Reset Templates State';
}
