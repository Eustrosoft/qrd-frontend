import { InjectionToken, Signal } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

export interface TableContext<T, S extends keyof T> {
  dataSource: MatTableDataSource<T>;
  selectionModel: SelectionModel<T[S]>;
  selectionKey: S;
  columns: Signal<string[]>;
}

export const TABLE_CONTEXT = new InjectionToken<TableContext<never, never>>('TABLE_CONTEXT');
