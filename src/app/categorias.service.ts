import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from './categoria.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoriasService {
  private apiUrl = 'http://localhost/api/categorias.php'; // API endpoint for categories

  constructor(private http: HttpClient) {}

  // Fetch all categories from the API
  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

  // Get a single category by ID
  getCategoriaById(id: number): Observable<Categoria> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Categoria>(url);
  }
}