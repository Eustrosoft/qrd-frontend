import { DestroyRef } from '@angular/core';
import { Dictionaries } from '@app/app.models';

export class FetchDictionaryByName {
  public static readonly type = '[DictionaryRegistry] Fetch Dictionary By Name';
  constructor(
    readonly dictionaryName: Dictionaries,
    readonly destroyRef: DestroyRef,
  ) {}
}
