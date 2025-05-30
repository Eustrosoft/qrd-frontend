export const ProfileInfoOverlayLocalization = {
  get aboutService() {
    return $localize`:@@profileInfoOverlay.aboutService:О сервисе`;
  },
  get versionHistory() {
    return $localize`:@@profileInfoOverlay.versionHistory:История версий`;
  },
  get feedback() {
    return $localize`:@@profileInfoOverlay.feedback:Связаться с нами`;
  },
  get help() {
    return $localize`:@@profileInfoOverlay.help:Помощь`;
  },
} as const;
