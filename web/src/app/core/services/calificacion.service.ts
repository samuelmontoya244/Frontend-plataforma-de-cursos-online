import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CalificacionCreate,
  CalificacionUpdate,
  CalificacionResponse,
} from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class CalificacionService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/Calificaciones`;

  list(): Observable<CalificacionResponse[]> {
    return this.http.get<CalificacionResponse[]>(this.base);
  }

  getById(idPk: string): Observable<CalificacionResponse> {
    return this.http.get<CalificacionResponse>(`${this.base}/${idPk}`);
  }

  create(payload: CalificacionCreate): Observable<CalificacionResponse> {
    return this.http.post<CalificacionResponse>(this.base, payload);
  }

  update(idPk: string, payload: CalificacionUpdate): Observable<CalificacionResponse> {
    return this.http.put<CalificacionResponse>(`${this.base}/${idPk}`, payload);
  }

  delete(idPk: string): Observable<{ mensaje: string; exito: boolean }> {
    return this.http.delete<{ mensaje: string; exito: boolean }>(`${this.base}/${idPk}`);
  }
}