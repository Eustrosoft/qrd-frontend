import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Locale, LocaleJson } from '@app/app.models';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocaleLoaderService {
  private readonly http = inject(HttpClient);

  public getLocale(locale: Locale): Observable<LocaleJson> {
    return this.http
      .get<LocaleJson>(`/locale/messages.${locale}.json`, { responseType: 'json' })
      .pipe(catchError(() => of<LocaleJson>({ locale: 'en-US', translations: {} })));
  }
}
