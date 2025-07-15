import { SharedLocalization } from '@shared/shared.constants';
import { ConfirmationDialogData } from '@shared/components/confirmation-dialog/confirmation-dialog.models';

export const CONFIRMATION_DIALOG_LOCALIZATION = {
  confirmation: $localize`:@@confirmDialog.confirmation:Confirmation`,
  warning: $localize`:@@confirmDialog.warning:Warning`,
  localeChange: $localize`:@@confirmDialog.localeChange:Change of language requires reload, proceed?`,
  deletion: $localize`:@@confirmDialog.deletion:Deletion`,
  areYouSure: $localize`:@@confirmDialog.areYouSure:Are you sure?`,
  saveBeforeExit: $localize`:@@confirmDialog.saveBeforeExit:Save data before exit?`,
};

export const DELETION_DIALOG_DATA: ConfirmationDialogData = {
  textContent: CONFIRMATION_DIALOG_LOCALIZATION.deletion,
  textSubContent: CONFIRMATION_DIALOG_LOCALIZATION.areYouSure,
  cancelButtonText: SharedLocalization.no,
  confirmButtonText: SharedLocalization.yes,
};

export const CHANGE_LOCALE_DIALOG_DATA: ConfirmationDialogData = {
  textContent: CONFIRMATION_DIALOG_LOCALIZATION.confirmation,
  textSubContent: CONFIRMATION_DIALOG_LOCALIZATION.localeChange,
  cancelButtonText: SharedLocalization.no,
  confirmButtonText: SharedLocalization.yes,
};

export const UNSAVED_FORM_DIALOG_DATA: ConfirmationDialogData = {
  textContent: CONFIRMATION_DIALOG_LOCALIZATION.warning,
  textSubContent: CONFIRMATION_DIALOG_LOCALIZATION.saveBeforeExit,
  cancelButtonText: SharedLocalization.no,
  confirmButtonText: SharedLocalization.yes,
};
