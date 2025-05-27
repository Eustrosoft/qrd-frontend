export const FooterLocalization = {
  get qrForAll() {
    return $localize`:@@footer.qrForAll:QR-коды для всех`;
  },
  get trainingVideo() {
    return $localize`:@@footer.trainingVideo:Обучающее видео`;
  },
  get loginPage() {
    return $localize`:@@footer.loginPage:Вход`;
  },
  get services() {
    return $localize`:@@footer.services:Сервисы`;
  },
  get contacts() {
    return $localize`:@@footer.contacts:Контакты`;
  },
} as const;
