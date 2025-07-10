import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AttrListItemComponent } from '@shared/components/attr-list-item/attr-list-item.component';
import { CardContainerComponent } from '@shared/components/card-container/card-container.component';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { IS_SMALL_SCREEN } from '@cdk/tokens/breakpoint.tokens';
import { createSelectMap } from '@ngxs/store';
import { SharedLocalization } from '@shared/shared.constants';
import { TemplatesState } from '@app/pages/templates/state/templates.state';
import { FallbackPipe } from '@shared/pipe/fallback.pipe';

@Component({
  selector: 'template-attrs',
  imports: [AttrListItemComponent, CardContainerComponent, UiFlexBlockComponent, FallbackPipe],
  templateUrl: './template-attrs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateAttrsComponent {
  protected readonly isSmallScreen = inject(IS_SMALL_SCREEN);
  protected readonly selectors = createSelectMap({
    template: TemplatesState.getTemplate$,
  });
  protected readonly SharedLocalization = SharedLocalization;
}
