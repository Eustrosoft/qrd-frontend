import { ChangeDetectionStrategy, Component, computed, effect, model, output } from '@angular/core';
import { FlexBlockComponent } from '@shared/components/flex-block/flex-block.component';
import { MatIconButton } from '@angular/material/button';
import { UiIconComponent } from '@ui/ui-icon/ui-icon.component';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { Theme } from '@app/app.models';
import { createSelectMap, dispatch } from '@ngxs/store';
import { AppState } from '@app/state/app.state';
import { FormsModule } from '@angular/forms';
import { SetTheme } from '@app/state/app.actions';
import { ThemePickerOverlayLocalization } from '@shared/components/theme-picker-overlay/theme-picker-overlay.constants';
import { DictionaryRegistryState } from '@shared/state/dictionary-registry.state';
import { Option } from '@shared/shared.models';

@Component({
  selector: 'theme-picker-overlay',
  imports: [FlexBlockComponent, MatIconButton, UiIconComponent, MatRadioGroup, MatRadioButton, FormsModule],
  templateUrl: './theme-picker-overlay.component.html',
  styleUrl: './theme-picker-overlay.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemePickerOverlayComponent {
  protected readonly selectors = createSelectMap({
    theme: AppState.getTheme$,
    availableThemes: DictionaryRegistryState.getDictionary$<Option<string>>('themes'),
    availableContrast: DictionaryRegistryState.getDictionary$<Option<string>>('contrast'),
  });
  private readonly setTheme = dispatch(SetTheme);
  protected readonly ThemePickerOverlayLocalization = ThemePickerOverlayLocalization;

  protected readonly themeModel = model<Theme>(this.selectors.theme());
  protected readonly contrastModel = model<string>('');
  protected readonly isSystemThemeSelected = computed<boolean>(() => this.themeModel() === 'system');
  protected readonly themeChangeEffect = effect(() => {
    this.setTheme(<Theme>`${this.themeModel()}${this.isSystemThemeSelected() ? '' : this.contrastModel()}`);
  });

  public readonly closeClick = output<void>();
}
