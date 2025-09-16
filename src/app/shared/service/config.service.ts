import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { APP_BASE_HREF } from '@angular/common';
import { AppConfig, AppLayoutConfig, Locale } from '@app/app.models';
import { DefaultLayoutConfig } from '@shared/shared.constants';
import { SUPPRESS_HTTP_ERROR_INTERCEPTOR } from '@modules/error/error.constants';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private readonly http = inject(HttpClient);
  private readonly baseHref = inject(APP_BASE_HREF);

  public fetchConfig(): Observable<AppConfig> {
    return this.http.get<AppConfig>(`${this.baseHref}config/config.json?t=${new Date().getTime()}`, {
      responseType: 'json',
      context: new HttpContext().set(SUPPRESS_HTTP_ERROR_INTERCEPTOR, true),
    });
  }

  public fetchLayoutConfig(locale: Locale): Observable<AppLayoutConfig> {
    return this.http
      .get<AppLayoutConfig>(`${this.baseHref}config/layout-config.${locale}.json?t=${new Date().getTime()}`, {
        responseType: 'json',
        context: new HttpContext().set(SUPPRESS_HTTP_ERROR_INTERCEPTOR, true),
      })
      .pipe(catchError(() => of(DefaultLayoutConfig)));
  }
}
