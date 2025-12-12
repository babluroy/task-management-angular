import { Injectable, PLATFORM_ID, Inject } from '@angular/core'; 
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task, User } from "../../common/models/task.model"

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly STORAGE_KEY = 'angularTasks';
  
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadTasks();
    }
  }


  private loadTasks(): void {
    const data = localStorage.getItem(this.STORAGE_KEY);
    try {
      const tasks = data ? JSON.parse(data) : [];
      this.tasksSubject.next(tasks);
    } catch (e) {
      this.tasksSubject.next([]);
    }
  }

  private saveTasks(tasks: Task[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    this.tasksSubject.next(tasks);
  }


  public addTask(newTask: Task): void {
    if (isPlatformBrowser(this.platformId)) {
        const currentTasks = this.tasksSubject.value;
        const updatedTasks = [...currentTasks, newTask];    
        this.saveTasks(updatedTasks);
    }
  }

  public updateTask(updatedTask: Task): void {
    if (isPlatformBrowser(this.platformId)) {
        const currentTasks = this.tasksSubject.value;
        const index = currentTasks.findIndex(t => t.id === updatedTask.id);
        if (index > -1) {
        const updatedTasks = [
            ...currentTasks.slice(0, index),
            updatedTask,
            ...currentTasks.slice(index + 1)
        ];
        this.saveTasks(updatedTasks);
        }
    }
  }

  public deleteTask(taskId: string): void {
    if (isPlatformBrowser(this.platformId)) {
        const currentTasks = this.tasksSubject.value;
        const updatedTasks = currentTasks.filter(t => t.id !== taskId);
        this.saveTasks(updatedTasks);
    }
  }
}