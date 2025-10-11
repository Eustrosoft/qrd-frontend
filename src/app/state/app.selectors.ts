import { createPickSelector, createPropertySelectors, createSelector, Selector } from '@ngxs/store';
import { Column, QrTableColumnFieldName } from '@api/settings/settings-api.models';
import { uniq } from '@shared/utils/functions/uniq.function';
import { BaseQrTableCols } from '@app/pages/qr-cards/qr-cards.constants';
import { AppState, AppStateModel } from '@app/state/app.state';

export class AppSelectors {
  private static readonly getFullState = createSelector([AppState], (state: AppStateModel) => state);

  public static getSlices = createPropertySelectors<AppStateModel>(AppState);

  public static getSettingsState$ = createPickSelector(AppSelectors.getFullState, [
    'isLoadingSettings',
    'isSavingSettings',
    'settings',
  ]);

  public static getConfigState$ = createPickSelector(AppSelectors.getFullState, ['isLoadingConfig', 'config']);

  public static getLayoutConfigState$ = createPickSelector(AppSelectors.getFullState, [
    'isLoadingLayoutConfig',
    'layoutConfig',
  ]);

  public static getQrTableColumns$ = createSelector(
    [AppSelectors.getSlices.settings],
    (settings) => settings.qrTableColumns,
  );

  @Selector([AppState])
  public static getAllQrCols$({ settings, qrFieldColumns }: AppStateModel): Column[] {
    const columns = settings.qrTableColumns;

    return uniq([...columns, ...qrFieldColumns, ...BaseQrTableCols], 'name');
  }

  @Selector([AppState])
  public static getEnabledQrTableColumns$({ settings }: AppStateModel): string[] {
    const columns = settings.qrTableColumns;

    return columns.reduce<string[]>((acc, col) => {
      if (col.enable && BaseQrTableCols.some((column) => column.fieldName === col.fieldName)) {
        acc.push(col.fieldName);
      }
      return acc;
    }, []);
  }

  @Selector([AppState])
  public static qrTableColumnVisibility$({ settings }: AppStateModel): Record<QrTableColumnFieldName, boolean> {
    const columns = settings.qrTableColumns;

    return {
      code_picture: columns.some((col) => col.fieldName === 'code_picture'),
      code: columns.some((col) => col.fieldName === 'code'),
      name: columns.some((col) => col.fieldName === 'name'),
      description: columns.some((col) => col.fieldName === 'description'),
      created: columns.some((col) => col.fieldName === 'created'),
      updated: columns.some((col) => col.fieldName === 'updated'),
    };
  }
}
