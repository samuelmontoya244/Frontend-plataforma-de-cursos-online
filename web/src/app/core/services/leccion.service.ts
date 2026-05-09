import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LeccionCreate, LeccionResponse, LeccionUpdate } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class LeccionService {
  // CAMBIO AQUÍ: Se cambió 'leccion' por 'lecciones' (plural)
  // Muchos errores "Not Found" ocurren porque el backend usa plural y el frontend singular.
  private readonly base = `${environment.apiUrl}/lecciones`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<LeccionResponse[]> {
    const params = new HttpParams().set('skip', 0).set('limit', 500);
    // IMPORTANTE: Asegúrate de que no haya una "/" al final de this.base
    return this.http.get<LeccionResponse[]>(this.base, { params });
  }

  get(id: string): Observable<LeccionResponse> {
    return this.http.get<LeccionResponse>(`${this.base}/${id}`);
  }

  create(body: LeccionCreate): Observable<LeccionResponse> {
    // Si el backend sigue dando 404, prueba quitando o poniendo la "/" al final:
    // return this.http.post<LeccionResponse>(`${this.base}/`, body);
    return this.http.post<LeccionResponse>(this.base, body);
  }

  update(id: string, body: LeccionUpdate): Observable<LeccionResponse> {
    return this.http.put<LeccionResponse>(`${this.base}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete(`${this.base}/${id}`, { observe: 'response' }).pipe(
      map(() => undefined)
    );
  }
}