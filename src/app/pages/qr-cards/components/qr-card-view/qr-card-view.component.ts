import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import { AppRoutes } from '@app/app.constants';
import { TabLink } from '@shared/shared.models';
import { UpperCasePipe } from '@angular/common';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { ViewToolbarComponent } from '@shared/components/view-toolbar/view-toolbar.component';
import { RouteTitles, SharedLocalization } from '@shared/shared.constants';
import { LinkWithIconComponent } from '@shared/components/link-with-icon/link-with-icon.component';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'qr-card-view',
  imports: [
    RouterOutlet,
    MatTabNav,
    MatTabLink,
    MatTabNavPanel,
    UpperCasePipe,
    UiFlexBlockComponent,
    ViewToolbarComponent,
    LinkWithIconComponent,
    MatButton,
    RouterLink,
  ],
  templateUrl: './qr-card-view.component.html',
  styleUrl: './qr-card-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrCardViewComponent {
  protected readonly tabLinks: TabLink[] = [
    { link: AppRoutes.card, title: RouteTitles.card },
    { link: AppRoutes.attrs, title: RouteTitles.attrs },
  ];
  protected activeLink = this.tabLinks[0].link;
  protected readonly SharedLocalization = SharedLocalization;
}
