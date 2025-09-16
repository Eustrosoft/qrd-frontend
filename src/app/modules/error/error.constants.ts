import { BackendError } from '@modules/error/error.models';
import { HttpContextToken } from '@angular/common/http';

export const ErrorsLocalization = {
  errOccurred: $localize`:@@errors.errOccurred:Error occurred`,
  unknownErr: $localize`:@@errors.unknownErr:Unknown error`,
  smthWentWrong: $localize`:@@errors.smthWentWrong:Something went wrong`,
  pageNotFound: $localize`:@@errors.notFound:Page not found`,
  // eslint-disable-next-line max-len
  pageNotFoundDescription: $localize`:@@errors.pageNotFoundDescription:We do not have the requested page. It may have been deleted or an incorrect address was specified in the request`,
  noConfig: $localize`:@@errors.noConfig:No config`,
  noConfigDescription: $localize`:@@errors.noConfigDescription:Can't load app. Config is missing`,
  unauthenticatedRoute: $localize`:@@errors.unauthenticatedRoute:Session expired`,
  unauthenticated: $localize`:@@errors.unauthenticated:Your session expired`,
  unauthenticatedAction: $localize`:@@errors.unauthenticatedAction:You will be redirected to login in 5 seconds`,
  errorCode: $localize`:@@errors.errorCode:Error code`,
  errorLoadingPreview: $localize`:@@errors.errorLoadingPreview:Error loading preview`,
  errorUploadingFile: $localize`:@@errors.errorUploadingFile:Error during uploading`,
  errorDownloadingFile: $localize`:@@errors.errorDownloadingFile:Error during downloading`,
  errorAddingFileUrl: $localize`:@@errors.errorAddingFileUrl:Error adding file URL`,
  errorFetchingFileList: $localize`:@@errors.errorFetchingFileList:Error while fetching file list`,
  errorFetchingFile: $localize`:@@errors.errorFetchingFile:Error while fetching file`,
  errorFetchingCard: $localize`:@@errors.errorFetchingCard:Error while fetching card`,
  errorFetchingTemplate: $localize`:@@errors.errorFetchingTemplate:Error while fetching template`,
  errorFetchingTemplateList: $localize`:@@errors.errorFetchingTemplateList:Error while fetching template list`,
  errorFetchingRangeList: $localize`:@@errors.errorFetchingRangeList:Error while fetching range list`,
  errorUpdatingFileMetadata: $localize`:@@errors.errorUpdatingFileMetadata:Error while updating file metadata`,
} as const;

export const NotificationSnackbarLocalization = {
  success: $localize`:@@notificationSnackbar.success:Success`,
  warning: $localize`:@@notificationSnackbar.warning:Warning`,
  danger: $localize`:@@notificationSnackbar.danger:Danger`,
  created: $localize`:@@notificationSnackbar.created:Created successfully`,
  uploaded: $localize`:@@notificationSnackbar.uploaded:Uploaded successfully`,
  saved: $localize`:@@notificationSnackbar.saved:Saved successfully`,
  deleted: $localize`:@@notificationSnackbar.deleted:Deleted successfully`,
  errOnFetch: $localize`:@@notificationSnackbar.errOnFetch:Error occurred while fetching record`,
  errOnFetchList: $localize`:@@notificationSnackbar.errOnFetchList:Error occurred while fetching record list`,
  errOnCreate: $localize`:@@notificationSnackbar.errOnCreate:Error occurred while creating record`,
  errOnSave: $localize`:@@notificationSnackbar.errOnSave:Error occurred while saving`,
  errOnDelete: $localize`:@@notificationSnackbar.errOnDelete:Error occurred while deleting`,
  errOnAddFile: $localize`:@@notificationSnackbar.errOnAddFile:Error occurred while adding file`,
};

export const UnknownBackendError: BackendError = {
  title: ErrorsLocalization.unknownErr,
  detail: ErrorsLocalization.smthWentWrong,
  code: 0,
  status: 0,
} as const;

export const SUPPRESS_HTTP_ERROR_INTERCEPTOR = new HttpContextToken<boolean>(() => true);
