import { createPropertySelectors } from '@ngxs/store';
import { PCodesState, PCodesStateModel } from '@app/pages/p-codes/state/p-codes.state';

export class PCodesSelectors {
  public static getSlices = createPropertySelectors<PCodesStateModel>(PCodesState);
}
