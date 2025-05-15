import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected readonly hello = $localize`Привет`;
  protected readonly title = $localize`qrd-frontend`;
  protected readonly welcomingText = $localize`Congratulations! Your app is running.`;
}
