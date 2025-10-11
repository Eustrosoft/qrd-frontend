import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, OnInit } from '@angular/core';
import { EllipsisDirective } from '@shared/directives/ellipsis.directive';
import { FallbackPipe } from '@shared/pipe/fallback.pipe';
import { MatButton } from '@angular/material/button';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ToolbarComponent } from '@shared/components/toolbar/toolbar.component';
import { UiSkeletonComponent } from '@ui/ui-skeleton/ui-skeleton.component';
import { UpperCasePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { createDispatchMap, createSelectMap } from '@ngxs/store';
import { TabLink } from '@shared/shared.models';
import { RouteTitles, SharedLocalization } from '@shared/shared.constants';
import { AppRoutes } from '@app/app.constants';
import { DeleteTemplates, FetchTemplate, FetchTemplateUsages } from '@app/pages/templates/state/templates.actions';
import { IS_SMALL_SCREEN, IS_XSMALL } from '@cdk/tokens/breakpoint.tokens';
import { ErrorsLocalization } from '@modules/error/error.constants';
import { Title } from '@angular/platform-browser';
import { MatMenuItem } from '@angular/material/menu';
import { MoreMenuComponent } from '@shared/components/more-menu/more-menu.component';
import { MatIcon } from '@angular/material/icon';
import { UiAlertComponent } from '@ui/ui-alert/ui-alert.component';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { TemplatesSelectors } from '@app/pages/templates/state/templates.selectors';

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
    UiSkeletonComponent,
    UpperCasePipe,
    RouterLink,
    MatIcon,
    MatMenuItem,
    MoreMenuComponent,
    UiAlertComponent,
    UiFlexBlockComponent,
  ],

  templateUrl: './template-view.component.html',
  styleUrl: './template-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateViewComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly title = inject(Title);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly isXSmall = inject(IS_XSMALL);
  protected readonly isSmallScreen = inject(IS_SMALL_SCREEN);
  protected readonly routeParams = toSignal(this.activatedRoute.params, { requireSync: true });

  protected readonly selectors = createSelectMap({
    isTemplateLoading: TemplatesSelectors.getSlices.isTemplateLoading,
    isTemplateLoadErr: TemplatesSelectors.getSlices.isTemplateLoadErr,
    template: TemplatesSelectors.getSlices.template,
    templateUsagesState: TemplatesSelectors.getTemplateUsagesState$,
    isDeleteInProgress: TemplatesSelectors.getSlices.isDeleteInProgress,
  });

  protected readonly actions = createDispatchMap({
    fetchTemplate: FetchTemplate,
    fetchTemplateUsages: FetchTemplateUsages,
    deleteTemplates: DeleteTemplates,
  });

  protected readonly titleEff = effect(() => {
    this.title.setTitle(
      `${SharedLocalization.defaultTitle} | ${RouteTitles.template} ${this.selectors.template()?.name ?? ''}`,
    );
  });

  protected readonly tabLinks: TabLink[] = [
    { link: AppRoutes.template, title: RouteTitles.template },
    { link: AppRoutes.usages, title: RouteTitles.usages },
  ];

  protected readonly AppRoutes = AppRoutes;
  protected readonly SharedLocalization = SharedLocalization;
  protected readonly ErrorsLocalization = ErrorsLocalization;

  public ngOnInit(): void {
    this.actions.fetchTemplate(this.routeParams()['id'], this.destroyRef);
    this.actions.fetchTemplateUsages(this.routeParams()['id'], this.destroyRef);
  }
}
