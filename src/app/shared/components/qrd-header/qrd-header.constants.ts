export const HeaderLocalization = {
  get qrForBusiness() {
    return $localize`:@@header.qrForBusiness:QR-коды для бизнеса`;
  },
  get cards() {
    return $localize`:@@header.cards:Карточки`;
  },
  get templates() {
    return $localize`:@@header.templates:Шаблоны`;
  },
  get files() {
    return $localize`:@@header.files:Файлы`;
  },
} as const;
