import { InjectionToken } from '@angular/core';
import { DuplicateErrorHandler } from '@app/pages/files/files.models';

export const DUPLICATE_ERROR_HANDLER_CMP = new InjectionToken<DuplicateErrorHandler>('DuplicateErrorHandler');
