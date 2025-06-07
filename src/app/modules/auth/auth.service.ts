import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SUPPRESS_HTTP_ERROR_INTERCEPTOR } from '@modules/error/error.constants';
import { ParticipantDto, UserLoginDto } from '@api/api.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  public login(payload: UserLoginDto): Observable<void> {
    return this.http.post<void>('/qrCodeDemo/v1/api/login', payload);
  }

  public logout(): Observable<void> {
    return this.http.post<void>(
      '/qrCodeDemo/v1/api/secured/logout',
      {},
      { context: new HttpContext().set(SUPPRESS_HTTP_ERROR_INTERCEPTOR, true) },
    );
  }

  public getAuthInfo(): Observable<ParticipantDto> {
    return this.http.get<ParticipantDto>('/qrCodeDemo/v1/api/secured/participants/me');
  }
}
