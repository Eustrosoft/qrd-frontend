import { inject } from '@angular/core';
import { ActionCompletion, Actions, dispatch, ofActionCompleted } from '@ngxs/store';
import { FetchConfig } from '@app/state/app.actions';
import { firstValueFrom } from 'rxjs';

export const configInitializer = (): Promise<ActionCompletion<FetchConfig>> | Promise<void> => {
  const actions = inject(Actions);
  dispatch(FetchConfig)();
  return firstValueFrom(actions.pipe(ofActionCompleted(FetchConfig)));
};
