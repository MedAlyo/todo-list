import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NotaPrivada {
  id: number;
  tarea_id: number;
  usuario_id: number;
  contenido: string;
  fecha_creacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotasPrivadasService {
  private apiUrl = 'http://localhost/api/notas_privadas.php';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
  }

  getNotas(tarea_id: number): Observable<NotaPrivada[]> {
    return this.http.get<NotaPrivada[]>(`${this.apiUrl}?tarea_id=${tarea_id}`, { headers: this.getAuthHeaders() });
  }

  createNota(nota: { tarea_id: number; contenido: string }): Observable<any> {
    return this.http.post(this.apiUrl, nota, { headers: this.getAuthHeaders() });
  }

  updateNota(nota: NotaPrivada): Observable<any> {
    const url = `${this.apiUrl}/${nota.id}`;
    return this.http.put(url, nota, { headers: this.getAuthHeaders() });
  }

  deleteNota(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url, { headers: this.getAuthHeaders() });
  }
}
