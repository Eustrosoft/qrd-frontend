import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, OnInit } from '@angular/core';
import { EllipsisDirective } from '@shared/directives/ellipsis.directive';
import { FallbackPipe } from '@shared/pipe/fallback.pipe';
import { MatMenuItem } from '@angular/material/menu';
import { UiSkeletonComponent } from '@ui/ui-skeleton/ui-skeleton.component';
import { ViewListItemComponent } from '@shared/components/view-list-item/view-list-item.component';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { createDispatchMap, createSelectMap } from '@ngxs/store';
import { SelectionModel } from '@angular/cdk/collections';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs';
import { AppRoutes } from '@app/app.constants';
import { SharedLocalization } from '@shared/shared.constants';
import { DeleteTemplates, FetchTemplateList, SetSelectedTemplates } from '@app/pages/templates/state/templates.actions';
import { RangeSelectorService } from '@shared/service/range-selector.service';
import { TemplateDto } from '@api/templates/templates-api.models';
import { MatButton } from '@angular/material/button';
import { UiAlertComponent } from '@ui/ui-alert/ui-alert.component';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { ErrorsLocalization } from '@modules/error/error.constants';
import { TemplatesSelectors } from '@app/pages/templates/state/templates.selectors';

@Component({
  selector: 'template-list',
  imports: [
    EllipsisDirective,
    FallbackPipe,
    MatIcon,
    MatMenuItem,
    UiSkeletonComponent,
    ViewListItemComponent,
    RouterLink,
    MatButton,
    UiAlertComponent,
    UiFlexBlockComponent,
  ],
  providers: [RangeSelectorService],
  templateUrl: './template-list.component.html',
  styleUrl: './template-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateListComponent implements OnInit {
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly rangeSelectorService = inject(RangeSelectorService);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly selectors = createSelectMap({
    isTemplateListLoading: TemplatesSelectors.getSlices.isTemplateListLoading,
    isTemplateListLoadErr: TemplatesSelectors.getSlices.isTemplateListLoadErr,
    templateListSkeletonLoaders: TemplatesSelectors.getTemplateListSkeletonLoaders$,
    templateList: TemplatesSelectors.getSlices.templateList,
    selectedTemplateList: TemplatesSelectors.getSlices.selectedTemplateList,
  });
  protected readonly actions = createDispatchMap({
    fetchTemplateList: FetchTemplateList,
    setSelectedTemplates: SetSelectedTemplates,
    deleteTemplates: DeleteTemplates,
  });

  protected readonly selectionModel = new SelectionModel(true, this.selectors.selectedTemplateList());
  public readonly selectionChanged = toSignal(
    this.selectionModel.changed.asObservable().pipe(
      map(() => this.selectionModel.selected),
      startWith<number[]>([]),
    ),
    { requireSync: true },
  );

  private readonly selChangeEff = effect(() => {
    const selection = this.selectionChanged();
    this.actions.setSelectedTemplates(selection);
  });

  private readonly selEff = effect(() => {
    const selectedValues = this.selectors.selectedTemplateList();
    this.selectionModel.select(...selectedValues);
    this.rangeSelectorService.updateLastSelectedId(this.selectionModel);
    if (!selectedValues.length) {
      this.selectionModel.clear();
    }
  });

  protected readonly AppRoutes = AppRoutes;
  protected readonly ErrorsLocalization = ErrorsLocalization;
  protected readonly SharedLocalization = SharedLocalization;

  public ngOnInit(): void {
    this.actions.fetchTemplateList(this.destroyRef);
  }

  protected makeSelect(item: TemplateDto): void {
    this.rangeSelectorService.selectItemOrRange(this.selectors.templateList(), this.selectionModel, item);
  }

  protected fetchMore(): void {
    throw new Error('Not implemented');
  }
}
