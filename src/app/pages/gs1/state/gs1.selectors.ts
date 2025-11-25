import { createPickSelector, createPropertySelectors, createSelector } from '@ngxs/store';
import { Gs1State, Gs1StateModel } from '@app/pages/gs1/state/gs1.state';

export class Gs1Selectors {
  private static readonly getFullState = createSelector([Gs1State], (state: Gs1StateModel) => state);

  public static getSlices = createPropertySelectors<Gs1StateModel>(Gs1State);

  public static getGs1ListState$ = createPickSelector(Gs1Selectors.getFullState, [
    'gs1List',
    'isGs1ListLoading',
    'isGs1ListLoadErr',
  ]);
}
