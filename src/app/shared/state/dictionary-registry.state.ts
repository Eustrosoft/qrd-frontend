import { Injectable } from '@angular/core';
import { createSelector, NgxsAfterBootstrap, State, StateContext, StateToken } from '@ngxs/store';
import { Dictionaries, DictionaryState } from '@app/app.models';
import { Option } from '@shared/shared.models';
import { ThemePickerOverlayLocalization } from '@shared/components/theme-picker-overlay/theme-picker-overlay.constants';
import { patch } from '@ngxs/store/operators';
import { LocalesLocalization, RouteTitles } from '@shared/shared.constants';
import { HeaderLocalization } from '@shared/components/qrd-header/qrd-header.constants';
import { BottomNavbarLink } from '@shared/components/bottom-navbar/bottom-navbar.models';
import { HeaderNavbarLink } from '@shared/components/qrd-header/qrd-header.models';

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
          locales: patch<DictionaryState<Option<string>>>({
            list: [
              {
                value: 'ru-RU',
                viewValue: LocalesLocalization.ru,
              },
              {
                value: 'en-US',
                viewValue: LocalesLocalization.enUS,
              },
            ],
            isLoading: false,
            isLoadError: false,
          }),
          headerNavbarLinks: patch<DictionaryState<HeaderNavbarLink>>({
            list: [
              {
                title: HeaderLocalization.cards,
                route: '/qr-cards',
              },
              {
                title: HeaderLocalization.templates,
                route: '/templates',
              },
              {
                title: HeaderLocalization.files,
                route: '/files',
              },
              {
                title: HeaderLocalization.docs,
                route: '/not-found',
              },
            ],
            isLoading: false,
            isLoadError: false,
          }),
          bottomNavbarLinks: patch<DictionaryState<BottomNavbarLink>>({
            list: [
              {
                icon: 'article',
                route: '/qr-cards',
                title: RouteTitles.cards,
              },
              {
                icon: 'difference',
                route: '/templates',
                title: RouteTitles.templates,
              },
              {
                icon: 'folder',
                iconActive: 'folder_open',
                route: '/files',
                title: RouteTitles.files,
              },
              {
                icon: 'note_add',
                route: '/not-found',
                title: RouteTitles.docs,
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
}
