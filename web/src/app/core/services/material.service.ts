import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MaterialCreate, MaterialResponse, MaterialUpdate } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class MaterialService {
  private readonly base = `${environment.apiUrl}/material`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<MaterialResponse[]> {
    const params = new HttpParams().set('skip', 0).set('limit', 500);
    return this.http.get<MaterialResponse[]>(this.base, { params });
  }

  get(id: string): Observable<MaterialResponse> {
    return this.http.get<MaterialResponse>(`${this.base}/${id}`);
  }

  create(body: MaterialCreate): Observable<MaterialResponse> {
    return this.http.post<MaterialResponse>(this.base, body);
  }

  update(id: string, body: MaterialUpdate): Observable<MaterialResponse> {
    return this.http.put<MaterialResponse>(`${this.base}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete(`${this.base}/${id}`, { observe: 'response' }).pipe(map(() => undefined));
  }
}