import { createPropertySelectors } from '@ngxs/store';
import { Gs1State, Gs1StateModel } from '@app/pages/gs1/state/gs1.state';

export class Gs1Selectors {
  public static getSlices = createPropertySelectors<Gs1StateModel>(Gs1State);
}
