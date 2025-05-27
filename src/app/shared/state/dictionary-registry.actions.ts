import { DestroyRef } from '@angular/core';
import { Dictionaries } from '@app/app.models';

export class GetDictionaryByName {
  public static readonly type = '[DictionaryRegistry] Get Dictionary By Name';
  constructor(
    readonly dictionaryName: Dictionaries,
    readonly destroyRef: DestroyRef,
  ) {}
}
