import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CategoriaCreate, CategoriaUpdate, CategoriaResponse,
} from '../../models/api.models';
 
@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/categorias`;
 
  list(): Observable<CategoriaResponse[]> {
    return this.http.get<CategoriaResponse[]>(this.base);
  }
  getById(id: string): Observable<CategoriaResponse> {
    return this.http.get<CategoriaResponse>(`${this.base}/${id}`);
  }
  create(payload: CategoriaCreate): Observable<CategoriaResponse> {
    return this.http.post<CategoriaResponse>(this.base, payload);
  }
  update(id: string, payload: CategoriaUpdate): Observable<CategoriaResponse> {
    return this.http.put<CategoriaResponse>(`${this.base}/${id}`, payload);
  }
  delete(id: string): Observable<{ mensaje: string; exito: boolean }> {
    return this.http.delete<{ mensaje: string; exito: boolean }>(`${this.base}/${id}`);
  }
}