import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTableDataSource,
} from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { TemplateDto } from '@api/templates/templates-api.models';
import { createDispatchMap, createSelectMap } from '@ngxs/store';
import { DeleteTemplates, FetchTemplateList, SetSelectedTemplates } from '@app/pages/templates/state/templates.actions';
import { MoreMenuComponent } from '@shared/components/more-menu/more-menu.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SharedLocalization } from '@shared/shared.constants';
import { MatIcon } from '@angular/material/icon';
import { AppRoutes } from '@app/app.constants';
import { MatMenuItem } from '@angular/material/menu';
import { TableContainerComponent } from '@shared/components/table-container/table-container.component';
import { TABLE_CONTEXT, TableContext } from '@cdk/tokens/table.tokens';
import { DatePipe } from '@angular/common';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatButton } from '@angular/material/button';
import { TemplatesSelectors } from '@app/pages/templates/state/templates.selectors';

@Component({
  selector: 'template-table',
  imports: [
    MatHeaderCell,
    MatColumnDef,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MoreMenuComponent,
    RouterLink,
    MatIcon,
    MatMenuItem,
    TableContainerComponent,
    DatePipe,
    MatSort,
    MatSortHeader,
    MatButton,
  ],
  providers: [
    {
      provide: TABLE_CONTEXT,
      useFactory: (cmp: TemplateTableComponent): TableContext<TemplateDto, 'id'> => ({
        dataSource: cmp.dataSource,
        selectionModel: cmp.selectionModel,
        selectionKey: 'id',
        columns: cmp.displayedColumns,
      }),
      deps: [TemplateTableComponent],
    },
  ],
  templateUrl: './template-table.component.html',
  styleUrl: './template-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateTableComponent implements OnInit, AfterViewInit {
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly activatedRoute = inject(ActivatedRoute);

  protected readonly SharedLocalization = SharedLocalization;
  protected readonly AppRoutes = AppRoutes;

  protected readonly selectors = createSelectMap({
    isTemplateListLoading: TemplatesSelectors.getSlices.isTemplateListLoading,
    isTemplateListLoadErr: TemplatesSelectors.getSlices.isTemplateListLoadErr,
    templateList: TemplatesSelectors.getSlices.templateList,
    selectedTemplateList: TemplatesSelectors.getSlices.selectedTemplateList,
  });
  protected readonly actions = createDispatchMap({
    fetchTemplateList: FetchTemplateList,
    setSelectedTemplates: SetSelectedTemplates,
    deleteTemplates: DeleteTemplates,
  });

  protected readonly sort = viewChild.required('sort', { read: MatSort });

  protected readonly displayedColumns = signal(['select', 'name', 'description', 'created', 'updated', 'actions']);
  protected readonly dataSource = new MatTableDataSource<TemplateDto>(this.selectors.templateList());
  protected readonly dataSourceEff = effect(() => {
    this.dataSource.data = this.selectors.templateList();
    this.dataSource.sort = this.sort();
  });

  protected readonly selectionModel = new SelectionModel<number>(true, this.selectors.selectedTemplateList());
  public readonly selectionChanged = output<number[]>();
  private readonly selEff = effect(() => {
    const selectedValues = this.selectors.selectedTemplateList();
    this.selectionModel.select(...selectedValues);
    if (!selectedValues.length) {
      this.selectionModel.clear();
    }
  });

  public ngOnInit(): void {
    this.actions.fetchTemplateList(this.destroyRef);
  }

  public ngAfterViewInit(): void {
    this.dataSource.sort = this.sort();
  }
}
