export const ThemePickerOverlayLocalization = {
  get theme() {
    return $localize`:@@themePickerOverlay.theme:Оформление`;
  },
  get dark() {
    return $localize`:@@themePickerOverlay.dark:Темное`;
  },
  get light() {
    return $localize`:@@themePickerOverlay.light:Светлое`;
  },
  get system() {
    return $localize`:@@themePickerOverlay.system:Системное`;
  },
  get contrast() {
    return $localize`:@@themePickerOverlay.contrast:Контрастность`;
  },
  get defaultContrast() {
    return $localize`:@@themePickerOverlay.defaultContrast:Стандартная`;
  },
  get mediumContrast() {
    return $localize`:@@themePickerOverlay.mediumContrast:Средняя`;
  },
  get highContrast() {
    return $localize`:@@themePickerOverlay.highContrast:Высокая`;
  },
} as const;
