import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { Actions, dispatch, ofActionErrored, ofActionSuccessful, select } from '@ngxs/store';
import { DestroyRef, inject } from '@angular/core';
import { map, merge, Observable, of } from 'rxjs';
import { AppRoutes } from '@app/app.constants';
import { PCodesFormFactoryService } from '@app/pages/p-codes/services/p-codes-form-factory.service';
import { PCodeFormGroup } from '@app/pages/p-codes/p-codes.models';
import { FetchPCode } from '@app/pages/p-codes/state/p-codes.actions';
import { PCodesSelectors } from '@app/pages/p-codes/state/p-codes.selectors';
import { AuthSelectors } from '@modules/auth/state/auth.selectors';

export const pCodeFormResolver = (): ResolveFn<Observable<PCodeFormGroup | RedirectCommand>> => {
  return (route) => {
    const actions$ = inject(Actions);
    const router = inject(Router);
    const pCodesFormFactoryService = inject(PCodesFormFactoryService);
    const destroyRef = inject(DestroyRef);

    const rowIdParam = route.paramMap.get('rowId');
    const rowId = rowIdParam ? +rowIdParam || null : null;
    const docIdParam = route.queryParamMap.get('docId');
    const docId = docIdParam ? +docIdParam || null : null;
    const idx = +route.queryParamMap.get('idx')!;

    if (!docId) {
      return new RedirectCommand(
        router.currentNavigation()?.previousNavigation?.extractedUrl ?? router.createUrlTree([AppRoutes.qrCards]),
      );
    }

    const pCode = select(PCodesSelectors.getSlices.pCode);
    const authInfo = select(AuthSelectors.getSlices.authInfo);

    pCodesFormFactoryService.reset();

    const initializeForm = (initialData: Partial<PCodeFormGroup['getRawValue']> = {}): PCodeFormGroup => {
      pCodesFormFactoryService.initialize(initialData);
      return pCodesFormFactoryService.form;
    };

    if (!rowId) {
      return of(initializeForm({ docId, rowId, participantId: authInfo()?.id }));
    }

    dispatch(FetchPCode)(idx, docId, destroyRef);
    return merge(
      actions$.pipe(
        ofActionSuccessful(FetchPCode),
        map(() =>
          initializeForm({
            docId: pCode()?.docId,
            rowId: pCode()?.rowId,
            participantId: authInfo()?.id,
            p: pCode()?.p,
            p2: pCode()?.p2,
            p2Mode: pCode()?.p2Mode,
            p2Prompt: pCode()?.p2Prompt,
            hfields: pCode()?.hfields,
            hfiles: pCode()?.hfiles,
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
