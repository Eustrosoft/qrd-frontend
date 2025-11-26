import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { Actions, dispatch, ofActionErrored, ofActionSuccessful, select } from '@ngxs/store';
import { inject } from '@angular/core';
import { map, merge, Observable, of } from 'rxjs';
import { Gs1FormGroup } from '@app/pages/gs1/gs1.models';
import { Gs1FormFactoryService } from '@app/pages/gs1/services/gs1-form-factory.service';
import { AppRoutes } from '@app/app.constants';
import { Gs1Selectors } from '@app/pages/gs1/state/gs1.selectors';
import { FetchGs1 } from '@app/pages/gs1/state/gs1.actions';

export const gs1FormResolver = (): ResolveFn<Observable<Gs1FormGroup | RedirectCommand>> => {
  return (route) => {
    const actions$ = inject(Actions);
    const router = inject(Router);
    const gs1FormFactoryService = inject(Gs1FormFactoryService);

    const id = route.paramMap.get('id');
    const qrIdParam = route.queryParamMap.get('qrId');
    const qrId = qrIdParam ? +qrIdParam || null : null;
    const gs1 = select(Gs1Selectors.getSlices.gs1);

    gs1FormFactoryService.reset();

    const initializeForm = (initialData: Partial<Gs1FormGroup['getRawValue']> = {}): Gs1FormGroup => {
      gs1FormFactoryService.initialize(initialData);
      return gs1FormFactoryService.form;
    };

    if (!id) {
      return of(initializeForm({ qrId: qrId, rtype: 'gtin' }));
    }

    dispatch(FetchGs1)(+id);
    return merge(
      actions$.pipe(
        ofActionSuccessful(FetchGs1),
        map(() =>
          initializeForm({
            id: gs1()?.id,
            qrId: gs1()?.qrId,
            rtype: gs1()?.rtype,
            gtin: gs1()?.gtin,
            key: gs1()?.key,
            value: gs1()?.value,
            tail: gs1()?.tail,
            comment: gs1()?.comment,
          }),
        ),
      ),
      actions$.pipe(
        ofActionErrored(FetchGs1),
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
