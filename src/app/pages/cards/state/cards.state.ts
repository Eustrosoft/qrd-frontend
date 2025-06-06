import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';
import { SetCardsDataViewDisplayType } from './cards.actions';
import { DataViewDisplayType } from '@shared/shared.models';
import { patch } from '@ngxs/store/operators';

export interface CardsStateModel {
  displayType: DataViewDisplayType;
}

const defaults: CardsStateModel = {
  displayType: 'list',
} as const;

const CARDS_STATE_TOKEN: StateToken<CardsStateModel> = new StateToken<CardsStateModel>('cards');

@State<CardsStateModel>({
  name: CARDS_STATE_TOKEN,
  defaults,
})
@Injectable()
export class CardsState {
  @Selector()
  public static getDisplayType$({ displayType }: CardsStateModel): DataViewDisplayType {
    return displayType;
  }

  @Action(SetCardsDataViewDisplayType)
  public setDisplayType(
    { getState, setState }: StateContext<CardsStateModel>,
    { displayType }: SetCardsDataViewDisplayType,
  ): void {
    console.log(displayType);
    setState(patch({ displayType }));
  }
}
