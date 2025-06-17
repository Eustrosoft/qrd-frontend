import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Locale, LocaleJson } from '@app/app.models';
import { catchError, Observable, of } from 'rxjs';
import { DEFAULT_LOCALE } from '@app/app.constants';

@Injectable({
  providedIn: 'root',
})
export class LocaleLoaderService {
  private readonly http = inject(HttpClient);

  public fetchLocale(locale: Locale): Observable<LocaleJson> {
    return this.http
      .get<LocaleJson>(`/locale/messages.${locale}.json`, { responseType: 'json' })
      .pipe(catchError(() => of<LocaleJson>({ locale: DEFAULT_LOCALE, translations: {} })));
  }
}
