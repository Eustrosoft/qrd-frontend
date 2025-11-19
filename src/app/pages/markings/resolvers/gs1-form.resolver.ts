import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { Actions, dispatch, ofActionErrored, ofActionSuccessful, select } from '@ngxs/store';
import { inject } from '@angular/core';
import { map, merge, Observable, of } from 'rxjs';
import { Gs1FormGroup } from '@app/pages/markings/markings.models';
import { Gs1FormFactoryService } from '@app/pages/markings/services/gs1-form-factory.service';
import { AppRoutes, DEFAULT_EMPTY_ID } from '@app/app.constants';
import { MarkingsSelectors } from '@app/pages/markings/state/markings.selectors';
import { FetchMarking } from '@app/pages/markings/state/markings.actions';

export const gs1FormResolver = (): ResolveFn<Observable<Gs1FormGroup | RedirectCommand>> => {
  return (route) => {
    const actions$ = inject(Actions);
    const router = inject(Router);
    const gs1FormFactoryService = inject(Gs1FormFactoryService);

    const id = route.paramMap.get('id');
    const qrIdParam = route.queryParamMap.get('qrId');
    const gs1 = select(MarkingsSelectors.getSlices.gs1);

    gs1FormFactoryService.reset();

    const initializeForm = (initialData: Partial<Gs1FormGroup['getRawValue']> = {}): Gs1FormGroup => {
      gs1FormFactoryService.initialize(initialData);
      return gs1FormFactoryService.form;
    };

    if (!id) {
      return of(initializeForm({ qrId: +(qrIdParam ?? DEFAULT_EMPTY_ID), rtype: 1 }));
    }

    dispatch(FetchMarking)(+id);
    return merge(
      actions$.pipe(
        ofActionSuccessful(FetchMarking),
        map(() =>
          // TODO заполнение данными из gs1()
          initializeForm({
            qrId: qrIdParam ?? DEFAULT_EMPTY_ID,
            rtype: DEFAULT_EMPTY_ID,
            gtin: DEFAULT_EMPTY_ID,
            key: '',
            value: '',
            tail: '',
            comment: '',
          }),
        ),
      ),
      actions$.pipe(
        ofActionErrored(FetchMarking),
        map(
          () =>
            new RedirectCommand(
              router.currentNavigation()?.previousNavigation?.extractedUrl ?? router.createUrlTree([AppRoutes.qrCards]),
            ),
        ),
      ),
    );
  };
};
