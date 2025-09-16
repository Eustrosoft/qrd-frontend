import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, EMPTY, Observable } from 'rxjs';
import { APP_BASE_HREF } from '@angular/common';
import { AppConfig, AppLayoutConfig, Locale } from '@app/app.models';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private readonly http = inject(HttpClient);
  private readonly baseHref = inject(APP_BASE_HREF);

  public fetchConfig(): Observable<AppConfig> {
    return this.http.get<AppConfig>(`${this.baseHref}config/config.json?t=${new Date().getTime()}`, {
      responseType: 'json',
    });
  }

  public fetchLayoutConfig(locale: Locale): Observable<AppLayoutConfig> {
    return this.http
      .get<AppLayoutConfig>(`${this.baseHref}config/layout-config.${locale}.json?t=${new Date().getTime()}`, {
        responseType: 'json',
      })
      .pipe(catchError(() => EMPTY));
  }
}
