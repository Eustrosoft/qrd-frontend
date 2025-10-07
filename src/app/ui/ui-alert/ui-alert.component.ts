import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { AlertType } from '@ui/ui-alert/ui-alert.models';
import { MatIcon } from '@angular/material/icon';
import { UiGridBlockComponent } from '@ui/ui-grid-block/ui-grid-block.component';
import { MatIconButton } from '@angular/material/button';
import { PxToRemPipe } from '@shared/pipe/px-to-rem.pipe';

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
    '[style.border-radius]': 'borderRadius()',
  },
})
export class UiAlertComponent {
  private readonly pxToRemPipe = inject(PxToRemPipe);

  public readonly type = input<AlertType>('info');
  public readonly icon = input<string>('');
  public readonly title = input<string>('');
  public readonly isClosable = input<boolean>(true);
  public readonly borderRadius = input('0.75rem', { transform: (value: string) => this.pxToRemPipe.transform(value) });

  public readonly closed = output<void>();
}
