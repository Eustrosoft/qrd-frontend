import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { select } from '@ngxs/store';
import { AppState } from '@app/state/app.state';

@Component({
  selector: 'qrd-logo',
  imports: [UiFlexBlockComponent],
  templateUrl: './qrd-logo.component.html',
  styleUrl: './qrd-logo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrdLogoComponent {
  protected readonly layoutConfigState = select(AppState.getLayoutConfigState$);
}
