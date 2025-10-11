import { createPickSelector, createPropertySelectors, createSelector } from '@ngxs/store';
import { QrCardsState, QrCardsStateModel } from '@app/pages/qr-cards/state/qr-cards.state';

export class QrCardsSelectors {
  private static readonly getFullState = createSelector([QrCardsState], (state: QrCardsStateModel) => state);

  public static getSlices = createPropertySelectors<QrCardsStateModel>(QrCardsState);

  public static getQrCardListSkeletonLoaders$ = createSelector(
    [QrCardsSelectors.getSlices.qrCardListSkeletonLoaders],
    (length) => Array.from({ length }, (_, i) => i),
  );

  public static getQrCardList$ = createSelector(
    [QrCardsSelectors.getSlices.qrCardList, QrCardsSelectors.getSlices.searchValue],
    (qrCardList, searchValue) =>
      qrCardList.filter(
        (qrCard) =>
          qrCard.name.toLowerCase().includes(searchValue) ||
          qrCard.description.toLowerCase().includes(searchValue) ||
          qrCard.code.toString().includes(searchValue),
      ),
  );

  public static getTemplatesState$ = createPickSelector(QrCardsSelectors.getFullState, [
    'templateList',
    'isTemplateListLoading',
    'isTemplateListLoadErr',
  ]);

  public static getQrRangesState$ = createPickSelector(QrCardsSelectors.getFullState, [
    'qrRangeList',
    'isQrRangeListLoading',
    'isQrRangeListLoadErr',
  ]);

  public static getFilesState$ = createPickSelector(QrCardsSelectors.getFullState, [
    'fileList',
    'isFileListLoading',
    'isFileListLoadErr',
  ]);
}
