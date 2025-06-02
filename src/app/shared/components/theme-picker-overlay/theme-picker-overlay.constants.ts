export const ThemePickerOverlayLocalization = {
  get theme() {
    return $localize`:@@themePickerOverlay.theme:Theme`;
  },
  get dark() {
    return $localize`:@@themePickerOverlay.dark:Dark`;
  },
  get light() {
    return $localize`:@@themePickerOverlay.light:Light`;
  },
  get system() {
    return $localize`:@@themePickerOverlay.system:System`;
  },
  get contrast() {
    return $localize`:@@themePickerOverlay.contrast:Contrast`;
  },
  get defaultContrast() {
    return $localize`:@@themePickerOverlay.defaultContrast:Standard`;
  },
  get mediumContrast() {
    return $localize`:@@themePickerOverlay.mediumContrast:Medium`;
  },
  get highContrast() {
    return $localize`:@@themePickerOverlay.highContrast:High`;
  },
} as const;
