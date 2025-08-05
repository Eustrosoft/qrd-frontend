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
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { TemplatesState } from '@app/pages/templates/state/templates.state';
import { AppRoutes } from '@app/app.constants';
import { SharedLocalization } from '@shared/shared.constants';
import {
  DeleteTemplates,
  FetchTemplateList,
  SetTemplatesDataViewDisplayType,
} from '@app/pages/templates/state/templates.actions';

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
  ],
  templateUrl: './template-list.component.html',
  styleUrl: './template-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateListComponent implements OnInit {
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly selectors = createSelectMap({
    displayType: TemplatesState.getDisplayType$,
    isTemplateListLoading: TemplatesState.isTemplateListLoading$,
    templateListSkeletonLoaders: TemplatesState.getTemplateListSkeletonLoaders$,
    templateList: TemplatesState.getTemplateList$,
    selectedTemplateList: TemplatesState.getSelectedTemplateList$,
  });
  protected readonly actions = createDispatchMap({
    setDisplayType: SetTemplatesDataViewDisplayType,
    fetchTemplateList: FetchTemplateList,
    deleteTemplates: DeleteTemplates,
  });

  protected readonly selectionModel = new SelectionModel(true, this.selectors.selectedTemplateList());
  public readonly selectionChanged = outputFromObservable(
    this.selectionModel.changed.asObservable().pipe(map(() => this.selectionModel.selected)),
  );
  private readonly selectionEffect = effect(() => {
    const selectedValues = this.selectors.selectedTemplateList();
    this.selectionModel.select(...selectedValues);
    if (!selectedValues.length) {
      this.selectionModel.clear();
    }
  });

  protected readonly AppRoutes = AppRoutes;
  protected readonly SharedLocalization = SharedLocalization;

  public ngOnInit(): void {
    this.actions.fetchTemplateList();
  }

  protected fetchMore(): void {
    throw new Error('Not implemented');
  }
}
