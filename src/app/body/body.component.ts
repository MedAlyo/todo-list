// body.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TareasService, Tarea } from '../tareas.service';
import { ComentariosService, Comentario } from '../comentarios.service';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from '@angular/router';
import { LoginStatusService } from '../loginstatus.service';
import { Subscription } from 'rxjs';
import { CategoriasService } from '../categorias.service';
import { Categoria } from '../categoria.interface';
@Component({
  selector: 'app-body',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormsModule, RouterLink],
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css'] 
})
export class BodyComponent implements OnInit, OnDestroy {
  faTimes = faTimes;
  tasks: Tarea[] = []; 
  categorias: Categoria[] = [];
  comentarios: { [key: number]: Comentario[] } = {}; // Store comments per task ID
  isLoggedIn = false; // Track login status
  currentTask: Tarea = { 
    id: 0, 
    titulo: '', 
    descripcion: '', 
    completed: false, 
    categoria_id: 1, 
    nivel_dificultad: 'medio', 
    es_publica: false, 
    fecha_creacion: new Date().toISOString(), 
    fecha_actualizacion: new Date().toISOString() 
  };

  // Comments modal properties
  isCommentsModalVisible: boolean = false;
  selectedTaskForComments: Tarea | null = null;
  taskComments: Comentario[] = [];
  newComment: string = '';

  isModalVisible: boolean = false;
  currentModal: 'edit' | 'add' | null = null;
  isCollapsed: { [key: number]: boolean } = {};
  private loginStatusSubscription!: Subscription;

  constructor(private tareaService: TareasService, 
    private loginStatusService: LoginStatusService,
    private categoriasService: CategoriasService,
    private comentariosService: ComentariosService) {}

  ngOnInit(): void {
    this.fetchTasks();
    this.fetchCategorias();

    this.loginStatusSubscription = this.loginStatusService.currentLoginStatus$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      this.fetchTasks(); // Refresh tasks when login status changes
    });
  }

  ngOnDestroy(): void {
    if (this.loginStatusSubscription) {
      this.loginStatusSubscription.unsubscribe();
    }
  }

  // Fetch tasks from the API and update the local tasks array
  public fetchTasks(): void {
    if (this.loginStatusService.currentLoginStatus$.value) {
      this.tareaService.getTasks().subscribe({
        next: (tasks) => {
          this.tasks = tasks.map(task => ({
            ...task,
            categoria_id: task.categoria_id || 1, // Default to category ID 1 if undefined
            fecha_creacion: task.fecha_creacion || new Date().toISOString(), // Default to current date if undefined
            fecha_actualizacion: task.fecha_actualizacion || new Date().toISOString(), // Default to current date if undefined
          }));
          this.initCollapseState();
          this.loadCommentsForTasks(); // Load comments for all tasks
          this.initCollapseState();
        },
        error: (error) => {
          console.error('Error fetching tasks:', error);
        }
      });
    } else {
      this.tareaService.getPublicTasks().subscribe({
        next: (tasks) => {
          this.tasks = tasks.map(task => ({
            ...task,
            categoria_id: task.categoria_id || 1, // Default to category ID 1 if undefined
            fecha_creacion: task.fecha_creacion || new Date().toISOString(), // Default to current date if undefined
            fecha_actualizacion: task.fecha_actualizacion || new Date().toISOString(), // Default to current date if undefined
          }));
          this.loadCommentsForTasks();
          this.initCollapseState();
        },
        error: (error) => {
          console.error('Error fetching public tasks:', error);
        }
      });
    }
  }

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

  initCollapseState(): void {
    this.isCollapsed = {};
    this.tasks.forEach((_, index) => {
      this.isCollapsed[index] = true; // Collapse all descriptions by default
    });
  }

  toggleDescription(index: number): void {
    this.isCollapsed[index] = !this.isCollapsed[index];
  }

  truncateDescription(description: string): string {
    return description.length > 100 ? description.substring(0, 100) + '...' : description;
  }

  categoriaById(id: number | undefined): string {
    if (id === undefined) {
      return 'Unknown'; // Default category name if id is undefined
    }
    const categoria = this.categorias.find(cat => cat.id === id);
    return categoria ? categoria.nombre : 'Unknown';
  }

  // Toggle the task's completion status by updating it via the API
  toggleTask(task: Tarea): void {
    const updatedTask: Tarea = { ...task, completed: !task.completed };
    this.tareaService.updateTask(updatedTask).subscribe({
      next: () => {
        task.completed = updatedTask.completed;
      },
      error: (error) => {
        console.error('Error toggling task:', error);
      }
    });
  }

  editTask(taskId: number): void {
    const taskToEdit = this.tasks.find(task => task.id === taskId);
    if (taskToEdit) {
      this.toggleModal('edit', taskToEdit); // Open the modal in edit mode
    } else {
      console.error('Task not found for editing:', taskId);
    }
  }

  // Delete a task via the API and refresh the tasks list
  deleteTask(taskId: number): void {
    this.tareaService.deleteTask(taskId).subscribe({
      next: () => {
        this.fetchTasks();
      },
      error: (error) => {
        console.error('Error deleting task:', error);
      }
    });
  }

  // Handle form submission from the modal (for editing and adding tasks)
  onSubmit(): void {
    if (this.currentModal === 'edit') {
      this.currentTask.es_publica = !!this.currentTask.es_publica;
      this.saveEditTask();
    }
    // Optionally, add logic for creating a task if currentModal === 'add'
    this.resetModal();
  }

  // Reset modal state and clear editTask data
  resetModal(): void {
    this.isModalVisible = false;
    this.currentModal = null;
    this.currentTask = { 
    id: 0, 
    titulo: '', 
    descripcion: '', 
    completed: false, 
    categoria_id: 1, 
    nivel_dificultad: 'medio', 
    es_publica: false, 
    fecha_creacion: new Date().toISOString(), 
    fecha_actualizacion: new Date().toISOString() 
  };
  }

  toggleModal(modalType: 'edit' | 'add' | null, task?: Tarea): void {
    this.isModalVisible = modalType !== null;
    this.currentModal = modalType;

    if (modalType === 'edit' && task) {
      this.currentTask = { ...task }; // Populate the currentTask object
    } else if (modalType === 'add') {
      this.currentTask = {
        id: 0,
        titulo: '',
        descripcion: '',
        completed: false,
        categoria_id: 1,
        nivel_dificultad: 'medio',
        es_publica: false,
        fecha_creacion: new Date().toISOString(),
        fecha_actualizacion: new Date().toISOString()
      }; // Reset for new task
    }
  }
  saveEditTask(): void {
    this.tareaService.updateTask(this.currentTask).subscribe({
      next: (response) => {
        this.fetchTasks(); // Refresh tasks after successful update
      },
      error: (error) => {
        console.error('Error updating task:', error);
      }
    });
  }

  // === Comments Modal Methods ===

  openCommentsModal(task: Tarea): void {
    this.selectedTaskForComments = task;
    // Directly set comments if already loaded
  if (this.comentarios[task.id]) { 
    this.taskComments = this.comentarios[task.id];
  } else {
    this.taskComments = []; // Reset while loading
  }
  
  // Always fetch fresh comments
  this.loadComments(task.id); 
  this.isCommentsModalVisible = true;
  }

  loadComments(taskId: number): void {
    this.comentariosService.getComentarios(taskId).subscribe({
      next: (comments) => {
        this.comentarios[taskId] = comments;
        if (this.selectedTaskForComments?.id === taskId) {
          this.taskComments = comments;
        }
      },
      error: (error) => {
        console.error('Error loading comments:', error);
      }
    });
  }

  // Add a new comment for the selected task
  addComment(): void {
    /*if (!this.isLoggedIn) {
      alert('You must be logged in to add a comment.');
      return;
    }*/

    if (!this.newComment.trim() || !this.selectedTaskForComments) {
      alert('Comment cannot be empty.');
      return;
    }

    const commentData = {
      tarea_id: this.selectedTaskForComments.id,
      contenido: this.newComment
    };

    this.comentariosService.createComentario(commentData).subscribe({
      next: (response) => {
        this.newComment = ''; // Clear input field
        this.loadComments(this.selectedTaskForComments!.id); // Reload comments
      },
      error: (error) => {
        console.error('Error adding comment:', error);
        alert('Failed to add comment.');
      }
    });
  }

  closeCommentsModal(): void {
    this.isCommentsModalVisible = false;
    this.selectedTaskForComments = null;
    this.newComment = ''; // Clear new comment input
  }

   // Load comments for all tasks
   loadCommentsForTasks(): void {
    this.comentarios = {}; // Clear previous comments
    this.tasks.forEach(task => {
      if (this.isLoggedIn || task.es_publica) {
        this.loadComments(task.id); // Load comments for visible tasks
      }
    });
  }

  deleteComment(commentId: number): void {
    if (!this.isLoggedIn) {
      alert('You must be logged in to delete comments.');
      return;
    }
    
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }
  
    this.comentariosService.deleteComentario(commentId).subscribe({
      next: (response) => {
        if (this.selectedTaskForComments) {
          this.loadComments(this.selectedTaskForComments.id);
        }
      },
      error: (error) => {
        console.error('Error deleting comment:', error);
        alert('Failed to delete comment.');
      }
    });
  }
  
  
}