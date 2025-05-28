import { ChangeDetectionStrategy, Component, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { dispatch, select } from '@ngxs/store';
import { SetTheme } from '@app/state/app.actions';
import { UiSidenavComponent } from '@ui/ui-sidenav/ui-sidenav.component';
import { QrdHeaderComponent } from '@shared/components/qrd-header/qrd-header.component';
import { QrdFooterComponent } from '@shared/components/qrd-footer/qrd-footer.component';
import { AppState } from '@app/state/app.state';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UiSidenavComponent, QrdHeaderComponent, QrdFooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly theme = select(AppState.getTheme$);
  private readonly setTheme = dispatch(SetTheme);

  private readonly colorSchemeEffect = effect(() => {
    if (this.theme() !== 'system') {
      return;
    }
    this.setTheme('system', '');
  });
  /**
   * TODO
   *  locale change + guard integration (guard should prevent}
   *  inline link with icon component
   *  chips
   */
}
