import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private api = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  login(data: { nombre_usuario: string; contrasena: string }): Observable<any> {
    return this.http.post(`${this.api}/usuarios/login`, data);
  }
  
  logout(): void {
    localStorage.removeItem('token');
  }
}

  