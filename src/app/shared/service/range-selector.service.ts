import { inject, Injectable } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { IS_SHIFT_PRESSED } from '@cdk/tokens/is-shift-pressed.token';

@Injectable()
export class RangeSelectorService {
  private readonly isShiftPressed = inject(IS_SHIFT_PRESSED);
  private lastSelectedId: unknown | null = null;

  public selectItemOrRange<T, K extends keyof T, S = number>(
    itemList: T[],
    selectionModel: SelectionModel<S>,
    clickedItem: T,
    itemKey?: K,
    idFn?: (item: T) => S,
    isRangeSelect = this.isShiftPressed(),
  ): void {
    const key = <K>(itemKey ?? 'id');
    const getIdFn = idFn ?? ((item: T): S => <S>item[key]);
    const clickedId = getIdFn(clickedItem);

    if (selectionModel.isSelected(clickedId) && isRangeSelect) {
      selectionModel.toggle(clickedId);
      return;
    }

    if (!isRangeSelect || this.lastSelectedId === null) {
      selectionModel.toggle(clickedId);
      this.lastSelectedId = clickedId;
      return;
    }

    const startIndex = itemList.findIndex((i) => getIdFn(i) === this.lastSelectedId);
    const endIndex = itemList.findIndex((i) => getIdFn(i) === clickedId);

    if (startIndex === -1 || endIndex === -1) {
      selectionModel.toggle(clickedId);
      this.lastSelectedId = clickedId;
      return;
    }

    const [from, to] = startIndex < endIndex ? [startIndex, endIndex] : [endIndex, startIndex];

    const idsInRange = itemList.slice(from, to + 1).map(getIdFn);

    idsInRange.forEach((id) => selectionModel.select(id));

    this.lastSelectedId = clickedId;
  }

  public updateLastSelectedId<T>(selectionModel: SelectionModel<T>): void {
    const selected = selectionModel.selected;
    this.lastSelectedId = selected.length > 0 ? selected[selected.length - 1] : null;
  }
}
