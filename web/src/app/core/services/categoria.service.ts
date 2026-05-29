import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  CategoriaCreate,
  CategoriaUpdate,
  CategoriaRead,
} from '../../models/api.models';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private http = inject(HttpClient);
  private base = '/api/categorias';

  list(): Observable<CategoriaRead[]> {
    return this.http.get<CategoriaRead[]>(this.base);
  }

  getById(id: string): Observable<CategoriaRead> {
    return this.http.get<CategoriaRead>(`${this.base}/${id}`);
  }

  create(payload: CategoriaCreate): Observable<CategoriaRead> {
    return this.http.post<CategoriaRead>(this.base, payload);
  }

  update(id: string, payload: CategoriaUpdate): Observable<CategoriaRead> {
    return this.http.put<CategoriaRead>(`${this.base}/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}