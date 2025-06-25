import { DestroyRef } from '@angular/core';
import { DataViewDisplayType } from '@shared/shared.models';

export class FetchFileList {
  public static readonly type = '[Files] Fetch File List';
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
