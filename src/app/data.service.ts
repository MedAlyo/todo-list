import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private storageKey = "tasks";

  constructor() {
    if (this.isLocalStorageAvailable()) {
      const savedTasks = localStorage.getItem(this.storageKey);
      if (savedTasks) {
        this.tasks = JSON.parse(savedTasks);
      } else {
        this.saveToLocalStorage(); // Save initial state if localStorage is empty
      }
    }
  }

  tasks = [
    { id: 0, title: 'Task 1', description: 'Make the app work', completed: false },
    { id: 1, title: 'Task 2', description: 'Data stuff', completed: false },
    { id: 2, title: 'Task 3', description: 'Data stuff', completed: false },
    { id: 3, title: 'Task 4', description: 'Data stuff', completed: false },
  ];
  
  
  // Get all tasks
  getTasks(){
    return this.tasks;
  }

  // Add a new task and save it to localStorage
  addTask(task: {id: number; title: string, description: string, completed: boolean}){
    this.tasks.push(task);
    this.saveToLocalStorage(); // Automatically save to storage
  }

  // Delete a task and save it to localStorage
  deleteTask(index: number){
    this.tasks.splice(index, 1);
    this.saveToLocalStorage(); // Automatically save to storage
  }

  // Toggle task completion status and save it to localStorage
  toggleTask(task: any) {
    task.completed = !task.completed;
    this.saveToLocalStorage();  // Automatically save to storage
  }

  // Save tasks to localStorage
  public saveToLocalStorage(){
    localStorage.setItem(this.storageKey, JSON.stringify(this.tasks));
  }

  // Check if localStorage is available
  private isLocalStorageAvailable(): boolean{
    try{
      return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
    }catch(e){
      return false;
    }
  }
}