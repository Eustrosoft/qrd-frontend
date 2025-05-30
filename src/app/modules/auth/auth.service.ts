import { inject, Injectable } from '@angular/core';
import { AuthInfo, LoginPayload } from '@modules/auth/auth.models';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  public login(payload: LoginPayload): Observable<void> {
    return this.http.post<void>('/qrCodeDemo/v1/api/login', payload);
  }

  public logout(): Observable<void> {
    return this.http.post<void>('/qrCodeDemo/v1/api/secured/logout', {});
  }

  public getAuthInfo(): Observable<AuthInfo> {
    return this.http.get<AuthInfo>('/qrCodeDemo/v1/api/secured/participants/me');
  }
}
