import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PREFERS_DARK_TOKEN } from '@cdk/tokens/prefers-dark.token';
import { PREFERS_CONTRAST_TOKEN } from '@cdk/tokens/prefers-contrast.token';
import { dispatch } from '@ngxs/store';
import { SetTheme } from '@app/state/app.actions';
import { UiSidenavComponent } from '@ui/ui-sidenav/ui-sidenav.component';
import { QrdHeaderComponent } from '@shared/components/qrd-header/qrd-header.component';
import { QrdFooterComponent } from '@shared/components/qrd-footer/qrd-footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UiSidenavComponent, QrdHeaderComponent, QrdFooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly prefersDark = inject(PREFERS_DARK_TOKEN);
  private readonly prefersContrast = inject(PREFERS_CONTRAST_TOKEN);
  private readonly setTheme = dispatch(SetTheme);

  private readonly colorSchemeEffect = effect(() => {
    const prefersDark: boolean = this.prefersDark();
    const prefersContrast: boolean = this.prefersContrast();

    if (prefersContrast) {
      this.setTheme(prefersDark ? 'dark-hc' : 'light-hc');
    } else {
      this.setTheme(prefersDark ? 'dark' : 'light');
    }
  });
  /**
   * TODO
   *  not found page with errorConfig
   *  switch button
   *  login page
   *  header
   *  footer
   *  locale change + guard integration (guard should prevent}
   *  inline link with icon component
   *  chips
   */
}
