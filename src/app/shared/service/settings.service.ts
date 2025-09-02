import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Column, SettingsDto } from '@api/settings/settings-api.models';
import { FieldDto } from '@api/qr-cards/qrs-api.models';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly http = inject(HttpClient);

  public getSettings(): Observable<SettingsDto['settings']> {
    return this.http
      .get<SettingsDto>('/qrCodeDemo/v1/api/secured/participants/settings')
      .pipe(map((res: SettingsDto) => res.settings));
  }

  public patchSettings(payload: SettingsDto['settings']): Observable<SettingsDto['settings']> {
    return this.http
      .patch<SettingsDto>('/qrCodeDemo/v1/api/secured/participants/settings', { settings: payload })
      .pipe(map((res: SettingsDto) => res.settings));
  }

  public getFields(): Observable<Column[]> {
    return this.http.get<FieldDto[]>('/qrCodeDemo/v1/api/secured/forms/fields').pipe(
      map((res) =>
        res.map((field) => ({
          type: field.fieldType,
          fieldName: field.name,
          name: field.caption,
          enable: false,
        })),
      ),
    );
  }
}
