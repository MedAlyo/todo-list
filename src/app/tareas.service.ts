import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  completed: boolean;
  categoria_id: number; // Ensure this is always a number (not optional)
  nivel_dificultad: string;
  es_publica: boolean;
  fecha_creacion: string; // Add this field
  fecha_actualizacion: string; // Add this field
}

@Injectable({
  providedIn: 'root'
})
export class TareasService {
  private apiUrl = 'http://localhost/api/tareas.php';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    let token = '';
    if (typeof window !== 'undefined' && window.localStorage) {
      token = localStorage.getItem('token') || '';
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
  }

  // Fetch all tasks (requires authentication)
  getTasks(): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  // Fetch public tasks (no authentication required)
  getPublicTasks(): Observable<Tarea[]> {
    const publicUrl = `${this.apiUrl}?public=true`;
    return this.http.get<Tarea[]>(publicUrl); // No headers needed for public tasks
  }

  createTask(task: { titulo: string; descripcion: string; categoria_id: number; nivel_dificultad?: string }): Observable<any> {
    return this.http.post(this.apiUrl, task, { headers: this.getAuthHeaders() });
  }

  updateTask(task: Tarea): Observable<any> {
    const url = `${this.apiUrl}/${task.id}`;
    return this.http.put(url, task, { headers: this.getAuthHeaders() });
  }

  deleteTask(taskId: number): Observable<any> {
    const url = `${this.apiUrl}/${taskId}`;
    return this.http.delete(url, { headers: this.getAuthHeaders() });
  }
}