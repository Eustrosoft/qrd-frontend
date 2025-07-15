import { Provider } from '@angular/core';
import { provideMatConfigValue } from '@cdk/factories/mat-config-provider.factory';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { MAT_SELECT_CONFIG } from '@angular/material/select';
import { MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS } from '@angular/material/slide-toggle';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { DEFAULT_SNACKBAR_DURATION } from '@core/core.constants';

export function provideMaterialConfig(): Provider[] {
  return [
    provideMatConfigValue(MAT_FORM_FIELD_DEFAULT_OPTIONS, {
      appearance: 'outline',
      subscriptSizing: 'dynamic',
      hideRequiredMarker: true,
    }),
    provideMatConfigValue(MAT_TOOLTIP_DEFAULT_OPTIONS, {
      hideDelay: 50,
      showDelay: 0,
      touchendHideDelay: 0,
      tooltipClass: 'tooltip-pre-line',
    }),
    provideMatConfigValue(MAT_SELECT_CONFIG, {
      typeaheadDebounceInterval: 150,
      panelWidth: null,
    }),
    provideMatConfigValue(MAT_CHECKBOX_DEFAULT_OPTIONS, { disabledInteractive: false }),
    provideMatConfigValue(MAT_SNACK_BAR_DEFAULT_OPTIONS, {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: DEFAULT_SNACKBAR_DURATION,
      panelClass: 'snackbar-panel',
    }),
    provideMatConfigValue(MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS, { hideIcon: true }),
    provideMatConfigValue(MAT_ICON_DEFAULT_OPTIONS, {
      fontSet: 'material-symbols-outlined',
    }),
  ];
}
