import { ResolveFn } from '@angular/router';
import { Actions, dispatch, ofActionCompleted, select } from '@ngxs/store';
import { inject } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { QrCardFormFactoryService } from '@app/pages/qr-cards/services/qr-card-form-factory.service';
import { QrCardFormGroup } from '@app/pages/qr-cards/qr-cards.models';
import { QrCardsState } from '@app/pages/qr-cards/state/qr-cards.state';
import { FetchQrCard } from '@app/pages/qr-cards/state/qr-cards.actions';
import { uniq } from '@shared/utils/functions/uniq.function';

export const qrCardFormResolver = (): ResolveFn<Observable<QrCardFormGroup>> => {
  return (route) => {
    const actions$ = inject(Actions);
    const qrCardFormFactoryService = inject(QrCardFormFactoryService);

    const code = route.paramMap.get('code')!;
    const qrCard = select(QrCardsState.getQrCard$);

    qrCardFormFactoryService.reset();

    const initializeForm = (): QrCardFormGroup => {
      qrCardFormFactoryService.initialize(
        {
          id: qrCard()?.id ?? -1,
          code: qrCard()?.code ?? -1,
          formId: qrCard()?.form?.id ?? -1,
          name: qrCard()?.name ?? '',
          description: qrCard()?.description ?? '',
          action: qrCard()?.action ?? 'STD',
          redirect: qrCard()?.redirect ?? '',
          data: qrCard()?.data ?? {},
          // eslint-disable-next-line no-extra-parens
          files: uniq([...(qrCard()?.files ?? []), ...(qrCard()?.form?.files ?? [])], 'id'),
        },
        qrCard()?.form?.fields,
      );
      return qrCardFormFactoryService.form;
    };

    if (qrCard()) {
      return of(initializeForm());
    }

    dispatch(FetchQrCard)(code);
    return actions$.pipe(
      ofActionCompleted(FetchQrCard),
      map(() => initializeForm()),
    );
  };
};
