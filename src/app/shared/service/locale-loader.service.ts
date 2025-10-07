import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Locale, LocaleJson } from '@app/app.models';
import { catchError, Observable, of } from 'rxjs';
import { DEFAULT_LOCALE } from '@app/app.constants';
import { APP_BASE_HREF } from '@angular/common';
import { WINDOW } from '@cdk/tokens/window.token';

@Injectable({
  providedIn: 'root',
})
export class LocaleLoaderService {
  private readonly http = inject(HttpClient);
  private readonly baseHref = inject(APP_BASE_HREF);
  private readonly window = inject(WINDOW);

  public fetchLocale(locale: Locale): Observable<LocaleJson> {
    return this.http
      .get<LocaleJson>(`${this.baseHref}locale/messages.${locale}.json?t=${new Date().getTime()}`, {
        responseType: 'json',
      })
      .pipe(catchError(() => of<LocaleJson>({ locale: DEFAULT_LOCALE, translations: {} })));
  }

  public getBrowserLang(): Locale {
    const browserLang = this.window.navigator.language;
    const supportedLanguages: Locale[] = ['en-US', 'ru-RU', 'bg-BG'];
    let closestCode: Locale | undefined = undefined;
    let maxMatches = 0;
    for (const lang of supportedLanguages) {
      const matches: number = lang.startsWith(browserLang) ? lang.split('-').length : 0;
      if (matches > maxMatches) {
        closestCode = lang;
        maxMatches = matches;
      }
    }
    if (closestCode !== undefined) {
      return closestCode;
    }
    return DEFAULT_LOCALE;
  }
}
