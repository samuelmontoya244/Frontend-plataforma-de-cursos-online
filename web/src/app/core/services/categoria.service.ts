import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
<<<<<<< HEAD
<<<<<<< HEAD
  CategoriaCreate, CategoriaUpdate, CategoriaResponse,
} from '../../models/api.models';
 
=======
=======
>>>>>>> origin/dev
  CategoriaCreate,
  CategoriaUpdate,
  CategoriaRead, // ✅ corregido
} from '../../models/api.models';

<<<<<<< HEAD
>>>>>>> origin/prod
=======
>>>>>>> origin/dev
@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/categorias`;
<<<<<<< HEAD
<<<<<<< HEAD
 
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
=======
=======
>>>>>>> origin/dev

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

<<<<<<< HEAD
>>>>>>> origin/prod
=======
>>>>>>> origin/dev
  delete(id: string): Observable<{ mensaje: string; exito: boolean }> {
    return this.http.delete<{ mensaje: string; exito: boolean }>(`${this.base}/${id}`);
  }
}