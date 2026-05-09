import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CategoriaCreate,
  CategoriaUpdate,
  CategoriaRead, // ✅ corregido
} from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/categorias`;

  list(): Observable<CategoriaRead[]> { // ✅ corregido
    return this.http.get<CategoriaRead[]>(this.base);
  }

  getById(id: string): Observable<CategoriaRead> { // ✅ corregido
    return this.http.get<CategoriaRead>(`${this.base}/${id}`);
  }

  create(payload: CategoriaCreate): Observable<CategoriaRead> { // ✅ corregido
    return this.http.post<CategoriaRead>(this.base, payload);
  }

  update(id: string, payload: CategoriaUpdate): Observable<CategoriaRead> { // ✅ corregido
    return this.http.put<CategoriaRead>(`${this.base}/${id}`, payload);
  }

  delete(id: string): Observable<{ mensaje: string; exito: boolean }> {
    return this.http.delete<{ mensaje: string; exito: boolean }>(`${this.base}/${id}`);
  }
}