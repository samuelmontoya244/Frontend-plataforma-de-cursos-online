import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CertificadoCreate,
  CertificadoUpdate,
  CertificadoResponse,
} from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class CertificadoService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/certificados`;

  list(): Observable<CertificadoResponse[]> {
    return this.http.get<CertificadoResponse[]>(this.base);
  }

  getById(id: string): Observable<CertificadoResponse> {
    return this.http.get<CertificadoResponse>(`${this.base}/${id}`);
  }

  create(payload: CertificadoCreate): Observable<CertificadoResponse> {
    return this.http.post<CertificadoResponse>(this.base, payload);
  }

  update(id: string, payload: CertificadoUpdate): Observable<CertificadoResponse> {
    return this.http.put<CertificadoResponse>(`${this.base}/${id}`, payload);
  }

  delete(id: string): Observable<{ mensaje: string; exito: boolean }> {
    return this.http.delete<{ mensaje: string; exito: boolean }>(`${this.base}/${id}`);
  }
}
