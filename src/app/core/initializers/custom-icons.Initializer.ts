import { inject } from '@angular/core';
import { IconLoaderService } from '@shared/service/icon-loader.service';

export const customIconsInitializer = (): void => inject(IconLoaderService).loadCustomIcons();
