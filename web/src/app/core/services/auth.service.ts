import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // ✅ CORREGIDO: usa environment.apiUrl en vez de URL hardcodeada
  private readonly base = `${environment.apiUrl}/usuarios`;

  constructor(private readonly http: HttpClient) {}

  login(data: { nombre_usuario: string; contrasena: string }): Observable<{ access_token: string; token_type: string }> {
    // ✅ CORREGIDO: sin slash al final en /login
    return this.http.post<{ access_token: string; token_type: string }>(
      `${this.base}/login`,
      data
    );
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}

  