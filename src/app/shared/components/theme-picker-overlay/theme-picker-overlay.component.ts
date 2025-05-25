import { ChangeDetectionStrategy, Component, effect, model, output } from '@angular/core';
import { ThemePickerOverlayLocalization } from '@shared/shared.constants';
import { FlexBlockComponent } from '@shared/components/flex-block/flex-block.component';
import { MatIconButton } from '@angular/material/button';
import { UiIconComponent } from '@ui/ui-icon/ui-icon.component';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { Option } from '@shared/shared.models';
import { Theme } from '@app/app.models';
import { dispatch, select } from '@ngxs/store';
import { AppState } from '@app/state/app.state';
import { FormsModule } from '@angular/forms';
import { SetTheme } from '@app/state/app.actions';

@Component({
  selector: 'theme-picker-overlay',
  imports: [FlexBlockComponent, MatIconButton, UiIconComponent, MatRadioGroup, MatRadioButton, FormsModule],
  templateUrl: './theme-picker-overlay.component.html',
  styleUrl: './theme-picker-overlay.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemePickerOverlayComponent {
  private readonly theme = select(AppState.getTheme$);
  private readonly setTheme = dispatch(SetTheme);
  protected readonly ThemePickerOverlayLocalization = ThemePickerOverlayLocalization;
  protected readonly themeList = new Set<Option<Theme>>([
    {
      value: 'light',
      viewValue: ThemePickerOverlayLocalization.LIGHT,
    },
    {
      value: 'dark',
      viewValue: ThemePickerOverlayLocalization.DARK,
    },
    {
      value: 'system',
      viewValue: ThemePickerOverlayLocalization.SYSTEM,
    },
  ]);
  protected readonly contrastList = new Set<Option<string>>([
    {
      value: '',
      viewValue: ThemePickerOverlayLocalization.DEFAULT_CONTRAST,
    },
    {
      value: 'mc',
      viewValue: ThemePickerOverlayLocalization.MEDIUM_CONTRAST,
    },
    {
      value: 'hc',
      viewValue: ThemePickerOverlayLocalization.HIGH_CONTRAST,
    },
  ]);
  protected readonly themeModel = model<Theme>(this.theme());

  protected readonly themeChangeEffect = effect(() => {
    this.setTheme(this.themeModel());
  });

  public readonly closeClick = output<void>();
}
