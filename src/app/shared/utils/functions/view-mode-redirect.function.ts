import { RedirectFunction } from '@angular/router';
import { viewModeRoutesMap } from '@shared/shared.constants';
import { select } from '@ngxs/store';
import { ViewModeSettings } from '@app/pages/settings/settings.models';
import { AppSelectors } from '@app/state/app.selectors';

export const viewModeRedirect = (key: keyof ViewModeSettings): RedirectFunction => {
  return () => {
    const vms = select(AppSelectors.getSlices.viewModeSettings);
    return viewModeRoutesMap.get(vms()[key]) ?? 'list';
  };
};
