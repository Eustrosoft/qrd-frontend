import { inject, Injectable } from '@angular/core';
import { CUSTOM_ICON_MAP, CUSTOM_ICONS_NAMESPACE } from '@app/app.constants';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class IconLoaderService {
  private readonly matIconRegistry = inject(MatIconRegistry);
  private readonly domSanitizer = inject(DomSanitizer);

  public loadCustomIcons(): void {
    for (const [icon, url] of CUSTOM_ICON_MAP) {
      this.matIconRegistry.addSvgIconInNamespace(
        CUSTOM_ICONS_NAMESPACE,
        icon,
        this.domSanitizer.bypassSecurityTrustResourceUrl(url),
      );
    }
  }
}
