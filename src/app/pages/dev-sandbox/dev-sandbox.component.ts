import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FlexBlockComponent } from '@shared/components/flex-block/flex-block.component';
import { MatAnchor, MatButton, MatFabButton, MatMiniFabButton } from '@angular/material/button';
import { dispatch } from '@ngxs/store';
import { SetTheme } from '@app/state/app.actions';

@Component({
  selector: 'dev-sandbox',
  imports: [FlexBlockComponent, MatAnchor, MatButton, MatFabButton, MatMiniFabButton],
  templateUrl: './dev-sandbox.component.html',
  styleUrl: './dev-sandbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevSandboxComponent {
  protected readonly setTheme = dispatch(SetTheme);
}
