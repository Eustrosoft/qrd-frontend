import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { EllipsisDirective } from '@shared/directives/ellipsis.directive';
import { FallbackPipe } from '@shared/pipe/fallback.pipe';
import { MatButton } from '@angular/material/button';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { UiSkeletonComponent } from '@ui/ui-skeleton/ui-skeleton.component';
import { UpperCasePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { createDispatchMap, createSelectMap } from '@ngxs/store';
import { TabLink } from '@shared/shared.models';
import { RouteTitles, SharedLocalization } from '@shared/shared.constants';
import { AppRoutes } from '@app/app.constants';
import { DeleteTemplates, FetchTemplate } from '@app/pages/templates/state/templates.actions';
import { TemplatesState } from '@app/pages/templates/state/templates.state';

@Component({
  selector: 'template-view',
  imports: [
    EllipsisDirective,
    FallbackPipe,
    MatButton,
    MatTabLink,
    MatTabNav,
    MatTabNavPanel,
    RouterLinkActive,
    RouterOutlet,
    ToolbarComponent,
    UiFlexBlockComponent,
    UiSkeletonComponent,
    UpperCasePipe,
    RouterLink,
  ],
  templateUrl: './template-view.component.html',
  styleUrl: './template-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateViewComponent implements OnInit {
  protected readonly destroyRef = inject(DestroyRef);
  private readonly activatedRoute = inject(ActivatedRoute);
  protected readonly routeParams = toSignal(this.activatedRoute.params, { requireSync: true });
  protected readonly selectors = createSelectMap({
    isTemplateLoading: TemplatesState.isTemplateLoading$,
    template: TemplatesState.getTemplate$,
    isDeleteInProgress: TemplatesState.isDeleteInProgress$,
  });
  protected readonly actions = createDispatchMap({
    fetchTemplate: FetchTemplate,
    deleteTemplates: DeleteTemplates,
  });
  protected readonly tabLinks: TabLink[] = [
    { link: AppRoutes.template, title: RouteTitles.template },
    { link: AppRoutes.attrs, title: RouteTitles.attrs },
    { link: AppRoutes.usages, title: RouteTitles.usages },
  ];
  protected readonly AppRoutes = AppRoutes;
  protected readonly SharedLocalization = SharedLocalization;

  public ngOnInit(): void {
    this.actions.fetchTemplate(this.routeParams()['id'], this.destroyRef);
  }
}
