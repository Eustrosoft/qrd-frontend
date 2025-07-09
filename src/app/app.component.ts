import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { createDispatchMap, select } from '@ngxs/store';
import { SetTheme } from '@app/state/app.actions';
import { UiSidenavComponent } from '@ui/ui-sidenav/ui-sidenav.component';
import { QrdHeaderComponent } from '@shared/components/qrd-header/qrd-header.component';
import { QrdFooterComponent } from '@shared/components/qrd-footer/qrd-footer.component';
import { AppState } from '@app/state/app.state';
import { PREFERS_DARK_TOKEN } from '@cdk/tokens/prefers-dark.token';
import { HideNgVersionDirective } from '@shared/directives/hide-ng-version.directive';
import { UiSkeletonComponent } from '@ui/ui-skeleton/ui-skeleton.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UiSidenavComponent, QrdHeaderComponent, QrdFooterComponent, UiSkeletonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [HideNgVersionDirective],
})
export class AppComponent {
  private readonly prefersDark = inject(PREFERS_DARK_TOKEN);
  private readonly theme = select(AppState.getTheme$);
  private readonly actions = createDispatchMap({
    setTheme: SetTheme,
  });

  private readonly colorSchemeEffect = effect(() => {
    this.prefersDark();
    if (this.theme() !== 'system') {
      return;
    }
    this.actions.setTheme('system', '');
  });
}
