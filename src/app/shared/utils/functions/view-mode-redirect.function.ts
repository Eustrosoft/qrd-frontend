import { RedirectFunction } from '@angular/router';
import { viewModeRoutesMap } from '@shared/shared.constants';
import { select } from '@ngxs/store';
import { AppState } from '@app/state/app.state';
import { ViewModeSettings } from '@app/pages/settings/settings.models';

export const viewModeRedirect = (key: keyof ViewModeSettings): RedirectFunction => {
  return () => {
    const vms = select(AppState.getSlices.viewModeSettings);
    return viewModeRoutesMap.get(vms()[key]) ?? 'list';
  };
};
