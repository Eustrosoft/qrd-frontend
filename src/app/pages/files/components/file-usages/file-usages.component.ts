import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouteTitles, SharedLocalization } from '@shared/shared.constants';
import { CardContainerComponent } from '@shared/components/card-container/card-container.component';
import { UiGridBlockComponent } from '@ui/ui-grid-block/ui-grid-block.component';
import { createSelectMap } from '@ngxs/store';
import { FilesState } from '@app/pages/files/state/files.state';
import { UiBadgeComponent } from '@ui/ui-badge/ui-badge.component';
import { RouterLink } from '@angular/router';
import { AppRoutes } from '@app/app.constants';

@Component({
  selector: 'file-usages',
  imports: [CardContainerComponent, UiGridBlockComponent, UiBadgeComponent, RouterLink],
  templateUrl: './file-usages.component.html',
  styleUrl: './file-usages.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUsagesComponent {
  protected readonly AppRoutes = AppRoutes;
  protected readonly RouteTitles = RouteTitles;
  protected readonly SharedLocalization = SharedLocalization;

  protected readonly selectors = createSelectMap({
    fileUsagesState: FilesState.getFileUsagesState$,
  });
}
