import { SharedLocalization } from '@shared/shared.constants';
import { ConfirmationDialogData } from '@shared/components/confirmation-dialog/confirmation-dialog.models';

export const ConfirmationDialogLocalization = {
  confirmation: $localize`:@@confirmDialog.confirmation:Confirmation`,
  confirmationRequired: $localize`:@@confirmDialog.confirmationRequired:Confirmation required`,
  warning: $localize`:@@confirmDialog.warning:Warning`,
  templateChange: $localize`:@@confirmDialog.templateChange:Changing the template will change all fields and data, proceed?`,
  localeChange: $localize`:@@confirmDialog.localeChange:Change of language requires reload, proceed?`,
  deletion: $localize`:@@confirmDialog.deletion:Deletion`,
  areYouSure: $localize`:@@confirmDialog.areYouSure:Are you sure?`,
  sure: $localize`:@@confirmDialog.sure:Yes, I am sure`,
  saveBeforeExit: $localize`:@@confirmDialog.saveBeforeExit:Looks like form contains unsaved changes. Save data before exit?`,
  md5HasChanged: $localize`:@@confirmDialog.md5HasChanged:It looks like the MD5 hash has changed. Are you sure you want to proceed?`,
};

export const ChangeTemplateDialogData: ConfirmationDialogData = {
  textContent: ConfirmationDialogLocalization.confirmation,
  textSubContent: ConfirmationDialogLocalization.templateChange,
  cancelButtonText: SharedLocalization.no,
  confirmButtonText: SharedLocalization.yes,
};

export const DeletionDialogData: ConfirmationDialogData = {
  textContent: ConfirmationDialogLocalization.deletion,
  textSubContent: ConfirmationDialogLocalization.areYouSure,
  cancelButtonText: SharedLocalization.cancel,
  confirmButtonText: SharedLocalization.delete,
  showConfirmationCheckbox: true,
  confirmationCheckboxText: ConfirmationDialogLocalization.sure,
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

export const NotifyAboutMD5ChangesDialogData: ConfirmationDialogData = {
  textContent: ConfirmationDialogLocalization.confirmation,
  textSubContent: ConfirmationDialogLocalization.md5HasChanged,
  cancelButtonText: SharedLocalization.cancel,
  confirmButtonText: SharedLocalization.continue,
};
