import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { Actions, dispatch, ofActionErrored, ofActionSuccessful, select } from '@ngxs/store';
import { inject } from '@angular/core';
import { map, merge, Observable } from 'rxjs';
import { QrCardFormFactoryService } from '@app/pages/qr-cards/services/qr-card-form-factory.service';
import { QrCardFormGroup } from '@app/pages/qr-cards/qr-cards.models';
import { QrCardsState } from '@app/pages/qr-cards/state/qr-cards.state';
import { FetchQrCard } from '@app/pages/qr-cards/state/qr-cards.actions';
import { AppRoutes, DEFAULT_EMPTY_ID } from '@app/app.constants';

export const qrCardFormResolver = (): ResolveFn<Observable<QrCardFormGroup | RedirectCommand>> => {
  return (route) => {
    const actions$ = inject(Actions);
    const router = inject(Router);
    const qrCardFormFactoryService = inject(QrCardFormFactoryService);

    const code = route.paramMap.get('code')!;
    const qrCard = select(QrCardsState.getQrCard$);

    qrCardFormFactoryService.reset();

    const initializeForm = (): QrCardFormGroup => {
      qrCardFormFactoryService.initialize(
        {
          id: qrCard()?.id ?? DEFAULT_EMPTY_ID,
          code: qrCard()?.code ?? DEFAULT_EMPTY_ID,
          formId: qrCard()?.form?.id ?? DEFAULT_EMPTY_ID,
          name: qrCard()?.name ?? '',
          description: qrCard()?.description ?? '',
          action: qrCard()?.action ?? 'STD',
          redirect: qrCard()?.redirect ?? '',
          data: qrCard()?.data ?? {},
          files: qrCard()?.files ?? [],
        },
        qrCard()?.form?.fields,
      );
      return qrCardFormFactoryService.form;
    };

    dispatch(FetchQrCard)(code);
    return merge(
      actions$.pipe(
        ofActionSuccessful(FetchQrCard),
        map(() => initializeForm()),
      ),
      actions$.pipe(
        ofActionErrored(FetchQrCard),
        map(
          () =>
            new RedirectCommand(
              router.getCurrentNavigation()?.previousNavigation?.extractedUrl ??
                router.createUrlTree([AppRoutes.qrCards]),
            ),
        ),
      ),
    );
  };
};
