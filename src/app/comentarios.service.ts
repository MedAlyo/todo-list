import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

export interface Comentario {
  id: number;
  tarea_id: number;
  usuario_id: number;
  contenido: string;
  fecha_creacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class ComentariosService {
  private apiUrl = 'http://localhost/api/comentarios.php';

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  private getAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders({ 
      'Content-Type': 'application/json' 
    });

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      } 
    } 
    
    return headers;
  }

  getComentarios(tarea_id: number): Observable<Comentario[]> {
    if (!tarea_id || isNaN(tarea_id)) {
      console.error('Invalid tarea_id:', tarea_id);
      return throwError(() => new Error('Invalid tarea_id'));
    }
  
    const url = `${this.apiUrl}?tarea_id=${tarea_id}`;
    return this.http.get(url, { headers: this.getAuthHeaders(),
      responseType: 'text'
     }).pipe(
      map(response => {
        try {
          return JSON.parse(response);
        } catch (e) {
          throw new Error('Invalid JSON data');
        }
    }),
      catchError((error) => {
        console.error('Error loading comments:', error);
        return throwError(() => new Error('Failed to load comments'));
      })
    );
  }
  

  createComentario(comentario: { tarea_id: number; contenido: string }): Observable<any> {
    return this.http.post(this.apiUrl, comentario, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        console.error('Error creating comment:', error);
        return throwError(() => new Error('Failed to create comment'));
      })
    );
  }

  updateComentario(comentario: Comentario): Observable<any> {
    const url = `${this.apiUrl}/${comentario.id}`;
    return this.http.put(url, comentario, { headers: this.getAuthHeaders() });
  }

  deleteComentario(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`; // Ensure the comment ID is appended to the URL
    const headers = this.getAuthHeaders(); // Include the Authorization header
    return this.http.delete(url, { headers }).pipe(
        catchError((error) => {
            console.error('Error deleting comment:', error);
            return throwError(() => new Error('Failed to delete comment'));
        })
    );
}
  
}
