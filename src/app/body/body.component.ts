import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DataService } from '../data.service';

import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-body',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormsModule, RouterLink],
  templateUrl: './body.component.html',
  styleUrl: './body.component.css'
})
export class BodyComponent implements OnInit {
  faTimes = faTimes;
  tasks: { id: number,  title: string, description: string, completed: boolean }[] = [];
  
  editTask = { id: 0, title: '', description: '', completed: false };
  
  constructor(private dataService: DataService) {
    
  }

  isModalVisible: boolean = false;
  currentModal: 'edit' | 'add' | null = null;

  ngOnInit(): void {
    this.tasks = this.dataService.getTasks();
    this.isCollapsed = {};
    this.tasks.forEach((_, index) => this.isCollapsed[index] = true);
  }

  toggleTask(task: { id: number, title: string, description: string, completed: boolean }) {
    this.dataService.toggleTask(task);
  }

  deleteTask(index: number) {
    this.dataService.deleteTask(index);
  }

  // Handle the form submission
  onSubmit(): void {
    if (this.currentModal === 'edit') {
        this.saveEditTask(); // Call the save method if editing
    }

    // Close the modal and reset state
    this.resetModal(); // Hide the modal
  }

  resetModal(): void {
    this.isModalVisible = false; // Close the modal
    this.currentModal = null; // Reset modal type
    this.editTask = { id: 0,  title: '', description: '', completed: false }; // Clear the edit task
  }


  addTask(task: { id: number; title: string; description: string; completed: boolean }): void {
    task.id = this.tasks.length > 0 ? this.tasks[this.tasks.length - 1].id + 1 : 1;
    this.tasks.push(task);
    this.isCollapsed[this.tasks.length - 1] = true;
    this.dataService.saveToLocalStorage();
  }


  // Open modal for editing
  toggleModal(modalType: 'edit' | 'add' | null, task?: any): void {
    this.isModalVisible = modalType !== null; // Show the modal only if modalType is not null
    this.currentModal = modalType;

    if (modalType === 'edit' && task) {
        this.editTask = { ...task }; // Create a shallow copy of the task for editing
    }
  }


  // Save the changes to the edited task
  saveEditTask(): void {

    const taskIndex = this.tasks.findIndex(t => t.id === this.editTask.id);
    
    if (taskIndex !== -1) {
      this.tasks[taskIndex] = { ...this.editTask};
      this.dataService.saveToLocalStorage(); // Save changes to local storage
    }
    this.resetModal();
  }

  // Track the expanded/collapsed state for each task
  isCollapsed: { [key: number]: boolean } = {};

  toggleDescription(index: number): void {
    this.isCollapsed[index] = !this.isCollapsed[index]; // Toggle the specific task's state
  }
}