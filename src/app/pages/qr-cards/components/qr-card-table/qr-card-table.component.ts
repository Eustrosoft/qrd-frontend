import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
  output,
  viewChild,
} from '@angular/core';
import { TABLE_CONTEXT, TableContext } from '@cdk/tokens/table.tokens';
import { QRDto } from '@api/qr-cards/qrs-api.models';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { createDispatchMap, createSelectMap } from '@ngxs/store';
import { MatSort, MatSortHeader } from '@angular/material/sort';
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
import { SharedLocalization } from '@shared/shared.constants';
import { AppRoutes } from '@app/app.constants';
import { QrCardsState } from '@app/pages/qr-cards/state/qr-cards.state';
import { DeleteQrCards, FetchQrCardList, SetSelectedQrCards } from '@app/pages/qr-cards/state/qr-cards.actions';
import { DatePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatMenuItem } from '@angular/material/menu';
import { TableContainerComponent } from '@shared/components/table-container/table-container.component';
import { MoreMenuComponent } from '@shared/components/more-menu/more-menu.component';
import { MatIcon } from '@angular/material/icon';
import { ToHexPipe } from '@shared/pipe/to-hex.pipe';
import { ImgLoadStateDirective } from '@shared/directives/img-load-state.directive';
import { UiSkeletonComponent } from '@ui/ui-skeleton/ui-skeleton.component';
import { QrCardsLocalization } from '@app/pages/qr-cards/qr-cards.constants';
import { QrCardsService } from '@app/pages/qr-cards/services/qr-cards.service';
import { AppState } from '@app/state/app.state';

@Component({
  selector: 'qr-card-table',
  imports: [
    DatePipe,
    MatButton,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatMenuItem,
    TableContainerComponent,
    MatSort,
    MatHeaderCellDef,
    MatSortHeader,
    RouterLink,
    MatRowDef,
    MoreMenuComponent,
    MatRow,
    ToHexPipe,
    ImgLoadStateDirective,
    UiSkeletonComponent,
  ],
  providers: [
    {
      provide: TABLE_CONTEXT,
      useFactory: (cmp: QrCardTableComponent): TableContext<QRDto> => ({
        dataSource: cmp.dataSource,
        selectionModel: cmp.selectionModel,
        selectionKey: 'id',
        columns: cmp.displayedColumns,
      }),
      deps: [QrCardTableComponent],
    },
  ],
  templateUrl: './qr-card-table.component.html',
  styleUrl: './qr-card-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrCardTableComponent implements OnInit, AfterViewInit {
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly qrCardsService = inject(QrCardsService);

  protected readonly QrCardsLocalization = QrCardsLocalization;
  protected readonly SharedLocalization = SharedLocalization;
  protected readonly AppRoutes = AppRoutes;

  protected readonly selectors = createSelectMap({
    isQrCardListLoading: QrCardsState.isQrCardListLoading$,
    qrCardList: QrCardsState.getQrCardList$,
    selectedQrCardList: QrCardsState.getSelectedQrCardList$,
    enabledQrTableColumns: AppState.getEnabledQrTableColumns$,
  });
  protected readonly actions = createDispatchMap({
    fetchQrCardList: FetchQrCardList,
    setSelectedQrCards: SetSelectedQrCards,
    deleteQrCards: DeleteQrCards,
  });

  protected readonly sort = viewChild.required('sort', { read: MatSort });
  protected readonly displayedColumns = computed(() => {
    // ['select', 'code', 'qr-picture', 'name', 'description', 'actions'];
    return ['select', ...this.selectors.enabledQrTableColumns(), 'actions'];
  });
  protected readonly dataSource = new MatTableDataSource<QRDto>(this.selectors.qrCardList());
  protected readonly dataSourceEff = effect(() => {
    this.dataSource.data = this.selectors.qrCardList();
    this.dataSource.sort = this.sort();
  });

  protected readonly selectionModel = new SelectionModel<number>(true, this.selectors.selectedQrCardList());
  public readonly selectionChanged = output<number[]>();
  private readonly selEff = effect(() => {
    const selectedValues = this.selectors.selectedQrCardList();
    this.selectionModel.select(...selectedValues);
    if (!selectedValues.length) {
      this.selectionModel.clear();
    }
  });

  public ngOnInit(): void {
    this.actions.fetchQrCardList(this.destroyRef);
  }

  public ngAfterViewInit(): void {
    this.dataSource.sort = this.sort();
  }
}
