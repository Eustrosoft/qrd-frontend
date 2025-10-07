import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  contentChild,
  contentChildren,
  effect,
  inject,
  input,
  output,
  untracked,
  viewChild,
} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { MatCheckbox } from '@angular/material/checkbox';
import { RangeSelectorService } from '@shared/service/range-selector.service';
import { map } from 'rxjs';
import { outputFromObservable, toSignal } from '@angular/core/rxjs-interop';
import { TABLE_CONTEXT, TableContext } from '@cdk/tokens/table.tokens';
import { MatProgressBar } from '@angular/material/progress-bar';
import { SharedLocalization } from '@shared/shared.constants';
import { MatButton } from '@angular/material/button';
import { UiAlertComponent } from '@ui/ui-alert/ui-alert.component';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { ErrorsLocalization } from '@modules/error/error.constants';

@Component({
  selector: 'table-container',
  imports: [
    MatHeaderCell,
    MatTable,
    MatHeaderCellDef,
    MatCheckbox,
    MatCellDef,
    MatCell,
    MatProgressBar,
    MatNoDataRow,
    MatColumnDef,
    MatButton,
    UiAlertComponent,
    UiFlexBlockComponent,
  ],
  providers: [RangeSelectorService],
  templateUrl: './table-container.component.html',
  styleUrl: './table-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableContainerComponent<T, S extends keyof T> implements AfterContentInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly rangeSelectorService = inject(RangeSelectorService);
  protected readonly ctx = inject<TableContext<T, S>>(TABLE_CONTEXT);

  protected readonly ErrorsLocalization = ErrorsLocalization;
  protected readonly SharedLocalization = SharedLocalization;

  private readonly headerRowDefs = contentChildren(MatHeaderRowDef);
  private readonly rowDefs = contentChildren(MatRowDef);
  private readonly columnDefs = contentChildren(MatColumnDef);
  private readonly noDataRow = contentChild(MatNoDataRow);
  private readonly table = viewChild.required(MatTable<T>);

  protected readonly selectionModelChanges$ = this.ctx.selectionModel.changed
    .asObservable()
    .pipe(map(() => this.ctx.selectionModel.selected));

  protected readonly selectionModelSelectedValues = toSignal(
    this.selectionModelChanges$.pipe(map((list) => list.length)),
  );

  protected readonly isAllSelected = computed<boolean>(() => {
    const numSelected = this.selectionModelSelectedValues();
    const numRows = this.ctx.dataSource.data.length;
    return numSelected === numRows;
  });

  protected readonly colEff = effect(() => {
    const addedCols = this.columnDefs().filter((def) => def.name === undefined);

    untracked(() => {
      addedCols.forEach((col) => {
        this.table().addColumnDef(col);
      });
      this.cdr.markForCheck();
    });
  });

  public readonly isLoading = input<boolean>(false);
  public readonly isLoadErr = input<boolean>(false);
  public readonly selectionChanged = outputFromObservable(this.selectionModelChanges$);
  public readonly refresh = output<void>();

  public ngAfterContentInit(): void {
    this.columnDefs().forEach((columnDef) => this.table().addColumnDef(columnDef));
    this.rowDefs().forEach((rowDef) => this.table().addRowDef(rowDef));
    this.headerRowDefs().forEach((headerRowDef) => this.table().addHeaderRowDef(headerRowDef));
    this.table().setNoDataRow(this.noDataRow() ?? null);
  }

  protected toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.ctx.selectionModel.clear();
      return;
    }

    this.ctx.selectionModel.select(...this.ctx.dataSource.data.map((item: T) => item[this.ctx.selectionKey]));
  }

  protected makeSelect(item: T): void {
    this.rangeSelectorService.selectItemOrRange(this.ctx.dataSource.data, this.ctx.selectionModel, item);
  }
}
