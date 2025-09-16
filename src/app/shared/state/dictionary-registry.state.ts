import { inject, Injectable } from '@angular/core';
import { Action, createSelector, NgxsAfterBootstrap, State, StateContext, StateToken } from '@ngxs/store';
import { Dictionaries, DictionaryState } from '@app/app.models';
import { DictionaryItem, Option } from '@shared/shared.models';
import { ThemePickerOverlayLocalization } from '@shared/components/theme-picker-overlay/theme-picker-overlay.constants';
import { patch } from '@ngxs/store/operators';
import { FetchDictionaryByName } from '@shared/state/dictionary-registry.actions';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, EMPTY, Observable, of, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { QrCardActionsLocalization } from '@app/pages/qr-cards/qr-cards.constants';

// eslint-disable-next-line
export interface DictionaryRegistryStateModel<T = any> {
  dictionaries: Partial<Record<Dictionaries, DictionaryState<T>>>;
}

const defaults: DictionaryRegistryStateModel = {
  dictionaries: {},
} as const;

const DICTIONARY_REGISTRY_STATE_TOKEN: StateToken<DictionaryRegistryStateModel> =
  new StateToken<DictionaryRegistryStateModel>('dictionaryRegistry');

@State<DictionaryRegistryStateModel>({
  name: DICTIONARY_REGISTRY_STATE_TOKEN,
  defaults,
})
@Injectable()
export class DictionaryRegistryState implements NgxsAfterBootstrap {
  private readonly http = inject(HttpClient);
  public ngxsAfterBootstrap({ setState }: StateContext<DictionaryRegistryStateModel>): void {
    setState(
      patch({
        dictionaries: patch({
          themes: patch<DictionaryState<Option<string>>>({
            list: [
              {
                value: 'light',
                viewValue: ThemePickerOverlayLocalization.light,
              },
              {
                value: 'dark',
                viewValue: ThemePickerOverlayLocalization.dark,
              },
              {
                value: 'system',
                viewValue: ThemePickerOverlayLocalization.system,
              },
            ],
            isLoading: false,
            isLoadError: false,
          }),
          contrast: patch<DictionaryState<Option<string>>>({
            list: [
              {
                value: '',
                viewValue: ThemePickerOverlayLocalization.defaultContrast,
              },
              {
                value: '-mc',
                viewValue: ThemePickerOverlayLocalization.mediumContrast,
              },
              {
                value: '-hc',
                viewValue: ThemePickerOverlayLocalization.highContrast,
              },
            ],
            isLoading: false,
            isLoadError: false,
          }),
          qrCardActions: patch<DictionaryState<DictionaryItem>>({
            list: [
              {
                name: '',
                code: '',
                value: 'STD',
                description: QrCardActionsLocalization.std,
              },
              {
                name: '',
                code: '',
                value: 'REDIRECT',
                description: QrCardActionsLocalization.redirect,
              },
              {
                name: '',
                code: '',
                value: 'REDIRECT_QR_SVC',
                description: QrCardActionsLocalization.redirectQrSvc,
              },
              {
                name: '',
                code: '',
                value: 'HIDE',
                description: QrCardActionsLocalization.hide,
              },
            ],
            isLoading: false,
            isLoadError: false,
          }),
        }),
      }),
    );
  }

  public static getDictionary$<T = Option<unknown>>(
    dictionary: Dictionaries,
  ): (state: DictionaryRegistryStateModel) => DictionaryState<T> {
    return createSelector([DictionaryRegistryState], (state: DictionaryRegistryStateModel): DictionaryState<T> => {
      return (
        <DictionaryState<T>>state.dictionaries?.[dictionary] ?? {
          list: [],
          isLoading: false,
          isLoadError: false,
        }
      );
    });
  }

  @Action(FetchDictionaryByName)
  public fetchDictionaryByName(
    { getState, setState }: StateContext<DictionaryRegistryStateModel>,
    { dictionaryName, destroyRef }: FetchDictionaryByName,
  ): Observable<unknown> {
    if (getState().dictionaries?.[dictionaryName]?.list?.length) {
      return of();
    }

    setState(
      patch({
        dictionaries: patch({
          [dictionaryName]: {
            list: [],
            isLoading: true,
            isLoadError: false,
          },
        }),
      }),
    );

    const params = new HttpParams({ fromObject: { code: dictionaryName } });
    return this.http.get('/qrCodeDemo/v1/api/secured/dictionaries', { params }).pipe(
      tap({
        next: (res) => {
          setState(
            patch({
              dictionaries: patch({
                [dictionaryName]: {
                  list: res,
                  isLoading: false,
                  isLoadError: false,
                },
              }),
            }),
          );
        },
      }),
      catchError(() => {
        setState(
          patch({
            dictionaries: patch({
              [dictionaryName]: {
                list: [],
                isLoading: false,
                isLoadError: true,
              },
            }),
          }),
        );
        return EMPTY;
      }),
      takeUntilDestroyed(destroyRef),
    );
  }
}
