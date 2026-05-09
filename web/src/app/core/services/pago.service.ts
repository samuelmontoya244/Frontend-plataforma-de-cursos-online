import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagoCreate, PagoResponse, PagoUpdate } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class PagoService {
  private readonly base = `${environment.apiUrl}/pago`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<PagoResponse[]> {
    const params = new HttpParams().set('skip', 0).set('limit', 500);
    return this.http.get<PagoResponse[]>(this.base, { params });
  }

  get(id: string): Observable<PagoResponse> {
    return this.http.get<PagoResponse>(`${this.base}/${id}`);
  }

  create(body: PagoCreate): Observable<PagoResponse> {
    return this.http.post<PagoResponse>(this.base, body);
  }

  update(id: string, body: PagoUpdate): Observable<PagoResponse> {
    return this.http.put<PagoResponse>(`${this.base}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete(`${this.base}/${id}`, { observe: 'response' }).pipe(map(() => undefined));
  }
}