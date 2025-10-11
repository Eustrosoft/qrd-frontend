import { AfterViewInit, ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { dispatch, select } from '@ngxs/store';
import { SetTheme } from '@app/state/app.actions';
import { UiSidenavComponent } from '@ui/ui-sidenav/ui-sidenav.component';
import { QrdHeaderComponent } from '@shared/components/qrd-header/qrd-header.component';
import { QrdFooterComponent } from '@shared/components/qrd-footer/qrd-footer.component';
import { PREFERS_DARK_TOKEN } from '@cdk/tokens/prefers-dark.token';
import { HideNgVersionDirective } from '@shared/directives/hide-ng-version.directive';
import { UiSkeletonComponent } from '@ui/ui-skeleton/ui-skeleton.component';
import { UiBottomMenuComponent } from '@ui/ui-bottom-menu/ui-bottom-menu.component';
import { UiBottomMenuService } from '@ui/ui-bottom-menu/ui-bottom-menu.service';
import { UpdateService } from '@shared/service/update.service';
import { NetworkStatusBannerComponent } from '@shared/components/network-status-banner/network-status-banner.component';
import { IS_OFFLINE } from '@cdk/tokens/is-offline.token';
import { AnimatedIfDirective } from '@shared/directives/animated-if.directive';
import { AppSelectors } from '@app/state/app.selectors';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    UiSidenavComponent,
    QrdHeaderComponent,
    QrdFooterComponent,
    UiSkeletonComponent,
    UiBottomMenuComponent,
    NetworkStatusBannerComponent,
    AnimatedIfDirective,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [HideNgVersionDirective],
  host: {
    '[class.is-offline]': 'isOffline()',
  },
})
export class AppComponent implements AfterViewInit {
  constructor(private readonly updateService: UpdateService) {}

  protected readonly isOffline = inject(IS_OFFLINE);

  private readonly prefersDark = inject(PREFERS_DARK_TOKEN);
  private readonly uiBottomMenuService = inject(UiBottomMenuService);

  private readonly theme = select(AppSelectors.getSlices.theme);
  private readonly setTheme = dispatch(SetTheme);

  private readonly colorSchemeEffect = effect(() => {
    this.prefersDark();
    if (this.theme() !== 'system') {
      return;
    }
    this.setTheme('system', '');
  });

  public ngAfterViewInit(): void {
    this.uiBottomMenuService.renderDefaultCmp();
  }
}
