import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FlexBlockComponent } from '@shared/components/flex-block/flex-block.component';
import { MatAnchor, MatButton, MatFabButton, MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { dispatch } from '@ngxs/store';
import { SetTheme } from '@app/state/app.actions';
import { UiIconComponent } from '@ui/ui-icon/ui-icon.component';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { PaletteAnimationDirective } from '@core/directives/palette-animation.directive';

@Component({
  selector: 'dev-sandbox',
  imports: [
    FlexBlockComponent,
    MatAnchor,
    MatButton,
    MatFabButton,
    MatMiniFabButton,
    UiIconComponent,
    MatFormField,
    MatInput,
    MatLabel,
    MatFormField,
    MatIconButton,
    PaletteAnimationDirective,
  ],
  templateUrl: './dev-sandbox.component.html',
  styleUrl: './dev-sandbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevSandboxComponent {
  protected readonly setTheme = dispatch(SetTheme);
}
