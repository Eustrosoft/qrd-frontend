import { SharedLocalization } from '@shared/shared.constants';
import { ConfirmationDialogData } from '@shared/components/confirmation-dialog/confirmation-dialog.models';

export const ConfirmationDialogLocalization = {
  confirmation: $localize`:@@confirmDialog.confirmation:Confirmation`,
  warning: $localize`:@@confirmDialog.warning:Warning`,
  localeChange: $localize`:@@confirmDialog.localeChange:Change of language requires reload, proceed?`,
  deletion: $localize`:@@confirmDialog.deletion:Deletion`,
  areYouSure: $localize`:@@confirmDialog.areYouSure:Are you sure?`,
  saveBeforeExit: $localize`:@@confirmDialog.saveBeforeExit:Save data before exit?`,
};

export const DeletionDialogData: ConfirmationDialogData = {
  textContent: ConfirmationDialogLocalization.deletion,
  textSubContent: ConfirmationDialogLocalization.areYouSure,
  cancelButtonText: SharedLocalization.no,
  confirmButtonText: SharedLocalization.yes,
};

export const ChangeLocaleDialogData: ConfirmationDialogData = {
  textContent: ConfirmationDialogLocalization.confirmation,
  textSubContent: ConfirmationDialogLocalization.localeChange,
  cancelButtonText: SharedLocalization.no,
  confirmButtonText: SharedLocalization.yes,
};

export const UnsavedFormDialogData: ConfirmationDialogData = {
  textContent: ConfirmationDialogLocalization.warning,
  textSubContent: ConfirmationDialogLocalization.saveBeforeExit,
  cancelButtonText: SharedLocalization.no,
  confirmButtonText: SharedLocalization.yes,
};
