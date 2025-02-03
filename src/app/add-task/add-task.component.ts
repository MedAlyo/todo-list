import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../data.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css'
})
export class AddTaskComponent implements OnInit{

  tasks: { id: number,  title: string, description: string, completed: boolean }[] = [];
  newTask = {  id: 0, title: '', description: '', completed: false };
  isCollapsed: { [key: number]: boolean } = {};

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.loadTasks(); // Load tasks on initialization
  }

  loadTasks(): void {
    this.tasks = this.dataService.getTasks();
  }

  // Handle the form submission
  onSubmit(): void {        
    
    this.newTask.id = this.tasks.length > 0 ? this.tasks[this.tasks.length - 1].id + 1 : 1;// Assign an ID before adding

    this.addTask(this.newTask); // Add new task if in add mode
    
    this.newTask = { id: 0, title: '', description: '', completed: false }; // Reset newTask after submission
    
    this.router.navigate(['/Home']);// Navigate to Home page
  }

  addTask(task: { id: number; title: string; description: string; completed: boolean }): void {
    this.tasks.push(task);
    this.dataService.saveToLocalStorage();
  }

}