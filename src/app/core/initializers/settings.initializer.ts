import { inject } from '@angular/core';
import { ActionCompletion, Actions, dispatch, ofActionCompleted } from '@ngxs/store';
import { firstValueFrom } from 'rxjs';
import { FetchSettings } from '@app/state/app.actions';

export const settingsInitializer = (): Promise<ActionCompletion<FetchSettings>> => {
  const actions = inject(Actions);
  dispatch(FetchSettings)();
  return firstValueFrom(actions.pipe(ofActionCompleted(FetchSettings)));
};
