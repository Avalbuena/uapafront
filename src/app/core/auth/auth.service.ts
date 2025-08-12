import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, tap } from 'rxjs';

export interface LoginRequest { username: string; password: string; }
export interface LoginResponse { access_token: string; token_type: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = `${environment.apiBaseUrl}/autorizacion`;

  constructor(private http: HttpClient) {}

  login(body: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.base}/login`, body).pipe(
      tap(resp => {
        localStorage.setItem('token', resp.access_token);
        localStorage.setItem('token_type', resp.token_type || 'Bearer');
      })
    );
  }

  get token(): string | null { return localStorage.getItem('token'); }
  get authHeader(): string | null {
    const t = this.token; if (!t) return null;
    const type = localStorage.getItem('token_type') || 'Bearer';
    return `${type} ${t}`;
  }
  logout() { localStorage.removeItem('token'); localStorage.removeItem('token_type'); }
}
