import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Locale, LocaleJson } from '@app/app.models';
import { catchError, Observable, of } from 'rxjs';
import { DEFAULT_LOCALE } from '@app/app.constants';
import { APP_BASE_HREF } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class LocaleLoaderService {
  private readonly http = inject(HttpClient);
  private readonly baseHref = inject(APP_BASE_HREF);

  public fetchLocale(locale: Locale): Observable<LocaleJson> {
    return this.http
      .get<LocaleJson>(`${this.baseHref}locale/messages.${locale}.json?t=${new Date().getTime()}`, {
        responseType: 'json',
      })
      .pipe(catchError(() => of<LocaleJson>({ locale: DEFAULT_LOCALE, translations: {} })));
  }
}
