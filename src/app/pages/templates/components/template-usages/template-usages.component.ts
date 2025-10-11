import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouteTitles, SharedLocalization } from '@shared/shared.constants';
import { CardContainerComponent } from '@shared/components/card-container/card-container.component';
import { UiBadgeComponent } from '@ui/ui-badge/ui-badge.component';
import { UiGridBlockComponent } from '@ui/ui-grid-block/ui-grid-block.component';
import { AppRoutes } from '@app/app.constants';
import { createSelectMap } from '@ngxs/store';
import { EllipsisDirective } from '@shared/directives/ellipsis.directive';
import { FallbackPipe } from '@shared/pipe/fallback.pipe';
import { RouterLink } from '@angular/router';
import { TemplatesSelectors } from '@app/pages/templates/state/templates.selectors';

@Component({
  selector: 'template-usages',
  imports: [
    CardContainerComponent,
    UiBadgeComponent,
    UiGridBlockComponent,
    EllipsisDirective,
    FallbackPipe,
    RouterLink,
  ],
  templateUrl: './template-usages.component.html',
  styleUrl: './template-usages.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateUsagesComponent {
  protected readonly AppRoutes = AppRoutes;
  protected readonly RouteTitles = RouteTitles;
  protected readonly SharedLocalization = SharedLocalization;

  protected readonly selectors = createSelectMap({
    templateUsagesState: TemplatesSelectors.getTemplateUsagesState$,
  });
}
