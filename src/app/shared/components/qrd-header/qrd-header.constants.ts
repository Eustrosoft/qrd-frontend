export const HeaderLocalization = {
  get qrForBusiness() {
    return $localize`:@@header.qrForBusiness:QR for business`;
  },
  get cards() {
    return $localize`:@@header.cards:Cards`;
  },
  get templates() {
    return $localize`:@@header.templates:Templates`;
  },
  get files() {
    return $localize`:@@header.files:Files`;
  },
  get docs() {
    return $localize`:@@header.docs:Docs`;
  },
} as const;
