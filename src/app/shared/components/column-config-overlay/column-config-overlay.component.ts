import { ChangeDetectionStrategy, Component, computed, model, output } from '@angular/core';
import { MatDivider, MatList, MatListItem, MatListSubheaderCssMatStyler } from '@angular/material/list';
import { UiGridBlockComponent } from '@ui/ui-grid-block/ui-grid-block.component';
import { MatMiniFabButton } from '@angular/material/button';
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
  ],
  templateUrl: './column-config-overlay.component.html',
  styleUrl: './column-config-overlay.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [CdkDropListGroup],
})
export class ColumnConfigOverlayComponent {
  public readonly allCols = model<Column[]>([]);
  public readonly selectedCols = model<Column[]>([]);
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
        this.allCols.set(containerArr);
        this.selectedCols.set(previousContainerArr);
        this.selectedColsChange.emit(previousContainerArr);
      }
      if (container === 'selected') {
        this.allCols.set(previousContainerArr);
        this.selectedCols.set(containerArr);
        this.selectedColsChange.emit(containerArr);
      }
    }
  }

  protected moveAllToRight(): void {}

  protected moveFirstToRight(): void {}

  protected moveAllToLeft(): void {}

  protected moveFirstToLeft(): void {}
}
