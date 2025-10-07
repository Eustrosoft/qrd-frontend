import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { BytesToSizePipe } from '@shared/pipe/bytes-to-size.pipe';
import { CardContainerComponent } from '@shared/components/card-container/card-container.component';
import { CardFieldComponent } from '@shared/components/card-field/card-field.component';
import { DatePipe } from '@angular/common';
import { FallbackPipe } from '@shared/pipe/fallback.pipe';
import { FileListItemComponent } from '@shared/components/file-list-item/file-list-item.component';
import { UiGridBlockComponent } from '@ui/ui-grid-block/ui-grid-block.component';
import { IS_SMALL_SCREEN, IS_XSMALL } from '@cdk/tokens/breakpoint.tokens';
import { createSelectMap } from '@ngxs/store';
import { RouteTitles, SharedLocalization } from '@shared/shared.constants';
import { TemplatesState } from '@app/pages/templates/state/templates.state';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { AttrListItemComponent } from '@shared/components/attr-list-item/attr-list-item.component';
import { CollapsibleContainerComponent } from '@shared/components/collapsible-container/collapsible-container.component';
import { CollapsibleListDirective } from '@shared/directives/collapsible-list.directive';
import { CollapsibleListItemDirective } from '@shared/directives/collapsible-list-item.directive';

@Component({
  selector: 'template-main',
  imports: [
    BytesToSizePipe,
    CardContainerComponent,
    CardFieldComponent,
    DatePipe,
    FallbackPipe,
    FileListItemComponent,
    UiGridBlockComponent,
    UiFlexBlockComponent,
    AttrListItemComponent,
    CollapsibleContainerComponent,
    CollapsibleListDirective,
    CollapsibleListItemDirective,
  ],
  templateUrl: './template-main.component.html',
  styleUrl: './template-main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateMainComponent {
  protected readonly isXSmall = inject(IS_XSMALL);
  protected readonly isSmallScreen = inject(IS_SMALL_SCREEN);
  protected readonly selectors = createSelectMap({
    template: TemplatesState.getTemplate$,
  });

  protected readonly SharedLocalization = SharedLocalization;
  protected readonly RouteTitles = RouteTitles;

  protected readonly infoGridTemplateColumns = computed<string>(() => {
    if (this.isSmallScreen()) {
      return 'repeat(1, 1fr)';
    }
    return 'repeat(2, 1fr)';
  });
}
