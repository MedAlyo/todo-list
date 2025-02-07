import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TareasService } from '../tareas.service';
import { Router } from '@angular/router';
import { Categoria } from '../categoria.interface';
import { CategoriasService } from '../categorias.service';


@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css'
})
export class AddTaskComponent implements OnInit{

  newTask = { 
    titulo: '', 
    descripcion: '', 
    categoria_id: 1, 
    nivel_dificultad: 'medio',
    es_publica: false
  };

  categorias: Categoria[] = [];

  constructor(private tareasService: TareasService, 
    private router: Router,
    private categoriasService: CategoriasService) {}

  ngOnInit(): void {
    this.fetchCategorias();
  }

  // Load available categories for selection
  fetchCategorias(): void {
    this.categoriasService.getCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  // Handle the form submission
  onSubmit(): void {
    this.tareasService.createTask(this.newTask).subscribe({
      next: (response) => {
        console.log('Task created successfully:', response);
        // Navigate to Home page or tasks list
        this.router.navigate(['/Home']);
      },
      error: (error) => {
        console.error('Error adding task:', error);
        // Optionally, display an error message to the user
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/Home']);
  }
}