import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import {
  EvaluacionCreate,
  EvaluacionResponse,
  EvaluacionUpdate,
} from '../../models/api.models';

@Injectable({
  providedIn: 'root',
})
export class EvaluacionService {

  private readonly base =
    `${environment.apiUrl}/evaluaciones`;

  constructor(
    private readonly http: HttpClient
  ) {}

  list(): Observable<EvaluacionResponse[]> {

    const params = new HttpParams()
      .set('skip', 0)
      .set('limit', 500);

    return this.http.get<EvaluacionResponse[]>(
      this.base,
      { params }
    );
  }

  get(
    id: string
  ): Observable<EvaluacionResponse> {

    return this.http.get<EvaluacionResponse>(
      `${this.base}/${id}`
    );
  }

  create(
    body: EvaluacionCreate
  ): Observable<EvaluacionResponse> {

    return this.http.post<EvaluacionResponse>(
      this.base,
      body
    );
  }

  update(
    id: string,
    body: EvaluacionUpdate
  ): Observable<EvaluacionResponse> {

    return this.http.put<EvaluacionResponse>(
      `${this.base}/${id}`,
      body
    );
  }

  delete(
    id: string
  ): Observable<any> {

    return this.http.delete(
      `${this.base}/${id}`
    );
  }
}