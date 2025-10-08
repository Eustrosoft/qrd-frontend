import { ChangeDetectionStrategy, Component, computed, model, OnInit, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { Theme, ThemeContrast } from '@app/app.models';
import { createSelectMap, dispatch } from '@ngxs/store';
import { AppState } from '@app/state/app.state';
import { FormsModule } from '@angular/forms';
import { SetTheme } from '@app/state/app.actions';
import { ThemePickerOverlayLocalization } from '@shared/components/theme-picker-overlay/theme-picker-overlay.constants';
import { DictionaryRegistryState } from '@shared/state/dictionary-registry.state';
import { Option } from '@shared/shared.models';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { combineLatest, skip, tap } from 'rxjs';
import { UiFlexBlockComponent } from '@ui/ui-flex-block/ui-flex-block.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'theme-picker-overlay',
  imports: [MatIconButton, MatRadioGroup, MatRadioButton, FormsModule, UiFlexBlockComponent, MatIcon],
  templateUrl: './theme-picker-overlay.component.html',
  styleUrl: './theme-picker-overlay.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemePickerOverlayComponent implements OnInit {
  public readonly closeClick = output<void>();
  protected readonly selectors = createSelectMap({
    theme: AppState.getSlices.theme,
    contrast: AppState.getSlices.contrast,
    availableThemes: DictionaryRegistryState.getDictionary$<Option<string>>('themes'),
    availableContrast: DictionaryRegistryState.getDictionary$<Option<string>>('contrast'),
  });
  private readonly setTheme = dispatch(SetTheme);
  protected readonly ThemePickerOverlayLocalization = ThemePickerOverlayLocalization;

  protected readonly themeModel = model<Theme>(this.selectors.theme());
  protected readonly contrastModel = model<ThemeContrast>(this.selectors.contrast());
  protected readonly isSystemThemeSelected = computed<boolean>(() => this.themeModel() === 'system');

  protected readonly themeChange = combineLatest([
    toObservable(this.themeModel),
    toObservable(this.contrastModel),
  ]).pipe(
    skip(1),
    tap({
      next: ([theme, contrast]) => {
        this.setTheme(theme, `${this.isSystemThemeSelected() ? '' : contrast}`);
      },
    }),
    takeUntilDestroyed(),
  );

  public ngOnInit(): void {
    this.themeChange.subscribe();
  }
}
