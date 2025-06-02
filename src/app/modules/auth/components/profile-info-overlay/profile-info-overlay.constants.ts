export const ProfileInfoOverlayLocalization = {
  get aboutService() {
    return $localize`:@@profileInfoOverlay.aboutService:About service`;
  },
  get versionHistory() {
    return $localize`:@@profileInfoOverlay.versionHistory:Version history`;
  },
  get feedback() {
    return $localize`:@@profileInfoOverlay.feedback:Feedback`;
  },
  get help() {
    return $localize`:@@profileInfoOverlay.help:Help`;
  },
  get oldApp() {
    return $localize`:@@profileInfoOverlay.oldApp:Old app`;
  },
} as const;
