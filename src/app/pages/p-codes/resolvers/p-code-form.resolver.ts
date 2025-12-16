import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { Actions, dispatch, ofActionErrored, ofActionSuccessful, select } from '@ngxs/store';
import { inject } from '@angular/core';
import { map, merge, Observable, of } from 'rxjs';
import { AppRoutes } from '@app/app.constants';
import { PCodesFormFactoryService } from '@app/pages/p-codes/services/p-codes-form-factory.service';
import { PCodeFormGroup } from '@app/pages/p-codes/p-codes.models';
import { FetchPCode } from '@app/pages/p-codes/state/p-codes.actions';
import { PCodesSelectors } from '@app/pages/p-codes/state/p-codes.selectors';

export const pCodeFormResolver = (): ResolveFn<Observable<PCodeFormGroup | RedirectCommand>> => {
  return (route) => {
    const actions$ = inject(Actions);
    const router = inject(Router);
    const pCodesFormFactoryService = inject(PCodesFormFactoryService);

    const rowIdParam = route.paramMap.get('rowId');
    const rowId = rowIdParam ? +rowIdParam || null : null;
    const docIdParam = route.queryParamMap.get('docId');
    const docId = docIdParam ? +docIdParam || null : null;

    if (!docId) {
      return new RedirectCommand(
        router.currentNavigation()?.previousNavigation?.extractedUrl ?? router.createUrlTree([AppRoutes.qrCards]),
      );
    }

    const pCode = select(PCodesSelectors.getSlices.pCode);

    pCodesFormFactoryService.reset();

    const initializeForm = (initialData: Partial<PCodeFormGroup['getRawValue']> = {}): PCodeFormGroup => {
      pCodesFormFactoryService.initialize(initialData);
      return pCodesFormFactoryService.form;
    };

    if (!rowId) {
      return of(initializeForm({ docId, rowId }));
    }

    dispatch(FetchPCode)(+docId);
    return merge(
      actions$.pipe(
        ofActionSuccessful(FetchPCode),
        map(() =>
          initializeForm({
            docId: pCode()?.docId,
            rowId: pCode()?.rowId,
            p: pCode()?.p,
            p2: pCode()?.p2,
            p2Mode: pCode()?.p2Mode,
            p2Prompt: pCode()?.p2Prompt,
            hfields: pCode()?.hfields,
            hfiles: pCode()?.comment,
            comment: pCode()?.comment,
          }),
        ),
      ),
      actions$.pipe(
        ofActionErrored(FetchPCode),
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
