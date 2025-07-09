import { SharedLocalization } from '@shared/shared.constants';
import { ConfirmationDialogData } from '@shared/components/confirmation-dialog/confirmation-dialog.models';

export const CONFIRMATION_DIALOG_LOCALIZATION = {
  deletion: $localize`:@@confirmation.deletion:Deletion`,
  areYouSure: $localize`:@@confirmation.areYouSure:Are you sure?`,
};

export const DELETION_DIALOG_DATA: ConfirmationDialogData = {
  textContent: CONFIRMATION_DIALOG_LOCALIZATION.deletion,
  textSubContent: CONFIRMATION_DIALOG_LOCALIZATION.areYouSure,
  cancelButtonText: SharedLocalization.no,
  confirmButtonText: SharedLocalization.yes,
};
