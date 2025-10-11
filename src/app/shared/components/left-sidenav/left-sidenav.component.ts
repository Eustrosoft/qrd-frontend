import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { QrdLogoComponent } from '@shared/components/qrd-logo/qrd-logo.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { MatIcon } from '@angular/material/icon';
import { UiSidenavService } from '@ui/ui-sidenav/ui-sidenav.service';
import { MatListItem, MatNavList } from '@angular/material/list';
import { createSelectMap } from '@ngxs/store';
import { AppSelectors } from '@app/state/app.selectors';
import { AuthSelectors } from '@modules/auth/state/auth.selectors';

@Component({
  selector: 'left-sidenav',
  imports: [
    MatIcon,
    MatIconButton,
    QrdLogoComponent,
    RouterLink,
    UiFlexBlockComponent,
    MatListItem,
    MatNavList,
    RouterLinkActive,
  ],
  templateUrl: './left-sidenav.component.html',
  styleUrl: './left-sidenav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeftSidenavComponent {
  private readonly uiSidenavService = inject(UiSidenavService);

  protected readonly selectors = createSelectMap({
    isAuthenticated: AuthSelectors.getSlices.isAuthenticated,
    layoutConfigState: AppSelectors.getLayoutConfigState$,
  });

  protected closeSidenavMenu(): void {
    this.uiSidenavService.close();
  }
}
