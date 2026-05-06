import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CursoCreate, CursoResponse, CursoUpdate } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class CursoService {
  private readonly base = `${environment.apiUrl}/cursos`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<CursoResponse[]> {
    const params = new HttpParams().set('skip', 0).set('limit', 500);
    return this.http.get<CursoResponse[]>(`${this.base}/`, { params });
  }

  get(id: string): Observable<CursoResponse> {
    return this.http.get<CursoResponse>(`${this.base}/${id}`);
  }

  create(body: CursoCreate): Observable<CursoResponse> {
    return this.http.post<CursoResponse>(`${this.base}/`, body);
  }

  update(id: string, body: CursoUpdate): Observable<CursoResponse> {
    return this.http.put<CursoResponse>(`${this.base}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete(`${this.base}/${id}`, { observe: 'response' }).pipe(map(() => undefined));
  }
}