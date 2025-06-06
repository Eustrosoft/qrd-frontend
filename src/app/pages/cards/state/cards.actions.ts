import { DataViewDisplayType } from '@shared/shared.models';

export class SearchCards {
  public static readonly type = '[Cards] Set Display Type';
  constructor(public displayType: DataViewDisplayType) {}
}

export class SetCardsDataViewDisplayType {
  public static readonly type = '[Cards] Set Cards Display Type';
  constructor(public displayType: DataViewDisplayType) {}
}
