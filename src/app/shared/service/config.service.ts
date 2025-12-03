import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { APP_BASE_HREF } from '@angular/common';
import { AppConfig, AppLayoutConfig, Locale } from '@app/app.models';
import { DefaultConfig, DefaultLayoutConfig } from '@shared/shared.constants';
import { SUPPRESS_HTTP_ERROR_INTERCEPTOR } from '@modules/error/error.constants';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private readonly http = inject(HttpClient);
  private readonly baseHref = inject(APP_BASE_HREF);

  public fetchConfig(): Observable<Partial<AppConfig>> {
    return this.http
      .get<Partial<AppConfig>>(`${this.baseHref}config/config.json?t=${new Date().getTime()}`, {
        responseType: 'json',
        context: new HttpContext().set(SUPPRESS_HTTP_ERROR_INTERCEPTOR, true),
      })
      .pipe(catchError(() => of(DefaultConfig)));
  }

  public fetchLayoutConfig(locale: Locale): Observable<Partial<AppLayoutConfig>> {
    return this.http
      .get<Partial<AppLayoutConfig>>(`${this.baseHref}config/layout-config.${locale}.json?t=${new Date().getTime()}`, {
        responseType: 'json',
        context: new HttpContext().set(SUPPRESS_HTTP_ERROR_INTERCEPTOR, true),
      })
      .pipe(catchError(() => of(DefaultLayoutConfig)));
  }
}
