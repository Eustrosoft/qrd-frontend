import { DestroyRef } from '@angular/core';
import { DataViewDisplayType } from '@shared/shared.models';

export class FetchFileList {
  public static readonly type = '[Files] Fetch File List';
}

export class SetFileListSearchValue {
  public static readonly type = '[Files] Set File List Search Value';
  constructor(readonly searchValue: string) {}
}

export class FetchFile {
  public static readonly type = '[Files] Fetch File';
  constructor(
    readonly id: number,
    readonly destroyRef: DestroyRef,
  ) {}
}

export class SetSelectedFiles {
  public static readonly type = '[Files] Set Selected Files';
  constructor(readonly selectedFileList: number[]) {}
}

export class SelectAllFiles {
  public static readonly type = '[Files] Select All Files';
}

export class SetFilesDataViewDisplayType {
  public static readonly type = '[Files] Set Files Display Type';
  constructor(readonly displayType: DataViewDisplayType) {}
}

export class DownloadFile {
  public static readonly type = '[Files] Download File';
  constructor(
    readonly id: number,
    readonly fileName: string,
  ) {}
}

export class DeleteFiles {
  public static readonly type = '[Files] Delete Files';
  constructor(
    readonly idList: number[],
    readonly destroyRef: DestroyRef,
    readonly refreshList: boolean = true,
    readonly returnToList: boolean = false,
  ) {}
}
