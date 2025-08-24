import { InjectionToken, Signal } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

export interface TableContext<T, S = number> {
  dataSource: MatTableDataSource<T>;
  selectionModel: SelectionModel<S>;
  selectionKey: keyof T;
  columns: Signal<string[]>;
}

export const TABLE_CONTEXT = new InjectionToken<TableContext<unknown>>('TABLE_CONTEXT');
