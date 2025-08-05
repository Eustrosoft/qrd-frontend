import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { SettingsDto } from '@api/settings/settings-api.models';
import { IS_SMALL_SCREEN } from '@cdk/tokens/breakpoint.tokens';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly http = inject(HttpClient);
  private readonly isSmallScreen = inject(IS_SMALL_SCREEN);

  public getSettings(): Observable<SettingsDto['settings']> {
    return this.http
      .get<SettingsDto>('/qrCodeDemo/v1/api/secured/participants/settings')
      .pipe(map((res: SettingsDto) => res.settings));
  }

  public patchSettings(payload: Partial<SettingsDto['settings']>): Observable<SettingsDto['settings']> {
    return this.http
      .patch<SettingsDto>('/qrCodeDemo/v1/api/secured/participants/settings', { settings: payload })
      .pipe(map((res: SettingsDto) => res.settings));
  }
}
