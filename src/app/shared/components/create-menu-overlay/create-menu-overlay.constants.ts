export const CreateMenuOverlayLocalization = {
  get createCard() {
    return $localize`:@@createMenuOverlay.createCard:Create card`;
  },
  get createTemplate() {
    return $localize`:@@createMenuOverlay.createTemplate:Create template`;
  },
  get uploadFile() {
    return $localize`:@@createMenuOverlay.uploadFile:Upload file`;
  },
  get createDoc() {
    return $localize`:@@createMenuOverlay.createDoc:Create doc`;
  },
} as const;
