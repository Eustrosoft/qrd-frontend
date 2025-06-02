import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { dispatch, select } from '@ngxs/store';
import { SetTheme } from '@app/state/app.actions';
import { UiSidenavComponent } from '@ui/ui-sidenav/ui-sidenav.component';
import { QrdHeaderComponent } from '@shared/components/qrd-header/qrd-header.component';
import { QrdFooterComponent } from '@shared/components/qrd-footer/qrd-footer.component';
import { AppState } from '@app/state/app.state';
import { PREFERS_DARK_TOKEN } from '@cdk/tokens/prefers-dark.token';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UiSidenavComponent, QrdHeaderComponent, QrdFooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly prefersDark = inject(PREFERS_DARK_TOKEN);
  private readonly theme = select(AppState.getTheme$);
  private readonly setTheme = dispatch(SetTheme);

  private readonly colorSchemeEffect = effect(() => {
    this.prefersDark();
    if (this.theme() !== 'system') {
      return;
    }
    this.setTheme('system', '');
  });
  /**
   * TODO
   *  locale change + guard integration (guard should prevent}
   */
}
