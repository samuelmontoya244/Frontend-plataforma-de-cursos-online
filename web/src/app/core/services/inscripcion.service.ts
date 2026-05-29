import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { InscripcionCreate, InscripcionResponse, InscripcionUpdate } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class InscripcionService {
  private readonly base = `${environment.apiUrl}/inscripciones`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<InscripcionResponse[]> {
    const params = new HttpParams().set('skip', 0).set('limit', 500);
    // ✅ CORREGIDO: sin slash al final
    return this.http.get<InscripcionResponse[]>(this.base, { params });
  }

  get(id: string): Observable<InscripcionResponse> {
    return this.http.get<InscripcionResponse>(`${this.base}/${id}`);
  }

  create(body: InscripcionCreate): Observable<InscripcionResponse> {
    // ✅ CORREGIDO: sin slash al final
    return this.http.post<InscripcionResponse>(this.base, body);
  }

  update(id: string, body: InscripcionUpdate): Observable<InscripcionResponse> {
    return this.http.put<InscripcionResponse>(`${this.base}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete(`${this.base}/${id}`, { observe: 'response' }).pipe(map(() => undefined));
  }
}