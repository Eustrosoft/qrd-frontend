import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import { AppRoutes, RouteTitles } from '@app/app.constants';
import { TabLink } from '@shared/shared.models';
import { UpperCasePipe } from '@angular/common';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';

@Component({
  selector: 'qr-card-view',
  imports: [RouterOutlet, MatTabNav, MatTabLink, MatTabNavPanel, UpperCasePipe, UiFlexBlockComponent],
  templateUrl: './qr-card-view.component.html',
  styleUrl: './qr-card-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrCardViewComponent {
  protected readonly tabLinks: TabLink[] = [
    { link: AppRoutes.card, title: RouteTitles.card },
    { link: AppRoutes.attrs, title: RouteTitles.attrs },
  ];
  protected activeLink = this.tabLinks[0];
}
