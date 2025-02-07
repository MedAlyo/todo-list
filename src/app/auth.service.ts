import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost/api/usuarios.php';

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: any) {}

  register(nombre_usuario: string, correo_electronico: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}?action=register`, {
      nombre_usuario,
      correo_electronico,
      password,
    });
  }

  login(correo_electronico: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}?action=login`, {
      correo_electronico,
      password,
    });
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      return !!token; // Return true if a token exists
    }
    return false; // Default to false on the server
  }
}
