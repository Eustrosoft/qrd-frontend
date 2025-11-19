import { createPickSelector, createPropertySelectors, createSelector } from '@ngxs/store';
import { MarkingsState, MarkingsStateModel } from '@app/pages/markings/state/markings.state';

export class MarkingsSelectors {
  private static readonly getFullState = createSelector([MarkingsState], (state: MarkingsStateModel) => state);

  public static getSlices = createPropertySelectors<MarkingsStateModel>(MarkingsState);

  public static getGs1ListState$ = createPickSelector(MarkingsSelectors.getFullState, [
    'gs1List',
    'isGs1ListLoading',
    'isGs1ListLoadErr',
  ]);

  public static getQrCardsState$ = createPickSelector(MarkingsSelectors.getFullState, [
    'qrCardList',
    'isQrCardListLoading',
    'isQrCardListLoadErr',
  ]);
}
