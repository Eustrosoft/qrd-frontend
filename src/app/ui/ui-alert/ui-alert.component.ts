import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AlertType } from '@ui/ui-alert/ui-alert.models';
import { MatIcon } from '@angular/material/icon';
import { UiGridBlockComponent } from '@ui/ui-grid-block/ui-grid-block.component';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'ui-alert',
  imports: [MatIcon, UiGridBlockComponent, MatIconButton],
  templateUrl: './ui-alert.component.html',
  styleUrl: './ui-alert.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.alert-success]': 'type() === "success"',
    '[class.alert-warning]': 'type() === "warning"',
    '[class.alert-info]': 'type() === "info"',
    '[class.alert-danger]': 'type() === "danger"',
  },
})
export class UiAlertComponent {
  public readonly type = input<AlertType>('info');
  public readonly icon = input<string>('');
  public readonly title = input<string>('');
  public readonly isClosable = input<boolean>(true);

  public readonly closed = output<void>();
}
