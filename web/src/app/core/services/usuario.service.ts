import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { UsuarioCreate, UsuarioResponse, UsuarioUpdate } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly base = `${environment.apiUrl}/usuarios`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<UsuarioResponse[]> {
    const params = new HttpParams().set('skip', 0).set('limit', 500);
    // ✅ CORREGIDO: sin slash al final para evitar redirect 307 que pierde el body
    return this.http.get<UsuarioResponse[]>(this.base, { params });
  }

  get(id: string): Observable<UsuarioResponse> {
    return this.http.get<UsuarioResponse>(`${this.base}/${id}`);
  }

  create(body: UsuarioCreate): Observable<UsuarioResponse> {
    // ✅ CORREGIDO: sin slash al final
    return this.http.post<UsuarioResponse>(this.base, body);
  }

  update(id: string, body: UsuarioUpdate): Observable<UsuarioResponse> {
    return this.http.put<UsuarioResponse>(`${this.base}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete(`${this.base}/${id}`, { observe: 'response' }).pipe(map(() => undefined));
  }
}