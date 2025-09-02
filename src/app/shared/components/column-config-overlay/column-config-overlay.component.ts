import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';
import {
  MatDivider,
  MatList,
  MatListItem,
  MatListItemAvatar,
  MatListSubheaderCssMatStyler,
} from '@angular/material/list';
import { UiGridBlockComponent } from '@ui/ui-grid-block/ui-grid-block.component';
import { MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Column } from '@api/settings/settings-api.models';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ColumnConfigOverlayLocalization } from '@shared/components/column-config-overlay/column-config-overlay.constants';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { BaseQrTableCols } from '@app/pages/qr-cards/qr-cards.constants';

@Component({
  selector: 'column-config-overlay',
  imports: [
    MatListItem,
    UiGridBlockComponent,
    MatIcon,
    MatMiniFabButton,
    MatList,
    CdkDropList,
    CdkDrag,
    MatListSubheaderCssMatStyler,
    MatDivider,
    MatIconButton,
    UiFlexBlockComponent,
    MatListItemAvatar,
  ],
  templateUrl: './column-config-overlay.component.html',
  styleUrl: './column-config-overlay.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [CdkDropListGroup],
})
export class ColumnConfigOverlayComponent {
  public readonly allCols = model<Column[]>([]);
  public readonly selectedCols = model<Column[]>([]);
  public readonly isDisabled = input<boolean>(false);
  public readonly selectedColsChange = output<Column[]>();
  public readonly closeOverlay = output<void>();

  protected readonly ColumnConfigOverlayLocalization = ColumnConfigOverlayLocalization;

  protected readonly filteredCols = computed<Column[]>(() => {
    const selectedFieldNames = new Set(this.selectedCols().map((col) => col.fieldName));
    return this.allCols().filter((col) => !selectedFieldNames.has(col.fieldName));
  });

  protected drop(event: CdkDragDrop<Column[]>, container: 'all' | 'selected'): void {
    if (event.previousContainer.id === event.container.id) {
      const newArray = [...event.container.data];
      moveItemInArray(newArray, event.previousIndex, event.currentIndex);
      if (container === 'all') {
        this.allCols.set(newArray);
      }
      if (container === 'selected') {
        this.selectedCols.set(newArray);
        this.selectedColsChange.emit(newArray);
      }
    } else {
      const previousContainerArr = [...event.previousContainer.data];
      const containerArr = [...event.container.data];
      transferArrayItem(previousContainerArr, containerArr, event.previousIndex, event.currentIndex);
      if (container === 'all') {
        this.selectedCols.set(previousContainerArr);
        this.selectedColsChange.emit(previousContainerArr);
      }
      if (container === 'selected') {
        this.selectedCols.set(containerArr);
        this.selectedColsChange.emit(containerArr);
      }
    }
  }

  protected moveAllToSelected(): void {
    const newSelected = [...this.selectedCols(), ...this.filteredCols()];
    this.selectedCols.set(newSelected);
    this.selectedColsChange.emit(newSelected);
  }

  protected moveAllToList(): void {
    const newSelected: Column[] = [BaseQrTableCols[1], BaseQrTableCols[2], BaseQrTableCols[3]];
    this.selectedCols.set(newSelected);
    this.selectedColsChange.emit(newSelected);
  }

  protected toSelected(col: Column): void {
    this.selectedCols.update((selected) => [...selected, col]);
    this.selectedColsChange.emit(this.selectedCols());
  }

  protected toList(index: number): void {
    this.selectedCols.update((selected) => selected.filter((_, idx) => index !== idx));
    this.selectedColsChange.emit(this.selectedCols());
  }
}
