
import { Component, OnInit, inject } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
import { Observable, map, combineLatest, BehaviorSubject } from 'rxjs'; 
import { TaskService } from '../task-service';
import { Task, User } from '../../../common/models/task.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ReplaceHyphenPipe } from '../../../common/pipes/replaceHyphen.pipe';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.html', 
  styleUrls: ['./task-board.css'],
  standalone: true,
  imports: [CommonModule, DragDropModule, ReplaceHyphenPipe, FormsModule]
})
export class TaskBoard implements OnInit {
  
  private taskService = inject(TaskService);
  private router = inject(Router);

  availableUsers: User[] = [
    { id: 'usr-000', name: 'All Users' },
    { id: 'usr-001', name: 'Alice Johnson' },
    { id: 'usr-002', name: 'Bob Smith' },
    { id: 'usr-003', name: 'Charlie Day' }
  ];

  private selectedUserIdSubject = new BehaviorSubject<string>('usr-000');
  
  private _selectedUserId: string = 'usr-000';
  public get selectedUserId(): string { return this._selectedUserId; }
  public set selectedUserId(userId: string) { 
    this._selectedUserId = userId;
    this.selectedUserIdSubject.next(userId);
  }

  private filteredTasksByUser$: Observable<Task[]>;

  todoTasks$: Observable<Task[]>;
  inProgressTasks$: Observable<Task[]>;
  doneTasks$: Observable<Task[]>;

  columnIds: string[] = ['todo', 'in-progress', 'done'];

  constructor() {
    this.filteredTasksByUser$ = combineLatest([
      this.taskService.tasks$,
      this.selectedUserIdSubject.asObservable()
    ]).pipe(
      map(([tasks, userId]: [Task[], string]) => {
        if (userId === 'usr-000') {
          return tasks;
        }
        return tasks.filter(task => task.assignedUser.id === userId);
      })
    );

    this.todoTasks$ = this.filteredTasksByUser$.pipe(
      map(tasks => tasks.filter(task => task.status === 'todo'))
    );

    this.inProgressTasks$ = this.filteredTasksByUser$.pipe(
      map(tasks => tasks.filter(task => task.status === 'in-progress'))
    );

    this.doneTasks$ = this.filteredTasksByUser$.pipe(
      map(tasks => tasks.filter(task => task.status === 'done'))
    );
  }

ngOnInit(): void {}

drop(event: CdkDragDrop<Task[] | any>) { 
    if (!event.container.data || !event.previousContainer.data) {
        console.error("Drag drop event fired with null container data.");
        return; 
    }
    const previousData = event.previousContainer.data as Task[];
    const currentData = event.container.data as Task[];
    if (event.previousContainer === event.container) {
      moveItemInArray(currentData, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        previousData,
        currentData,
        event.previousIndex,
        event.currentIndex,
      );
      const movedTask = currentData[event.currentIndex];
      const newStatus = event.container.id as 'todo' | 'in-progress' | 'done';
      const updatedTask: Task = { ...movedTask, status: newStatus };
      this.taskService.updateTask(updatedTask); 
    }
  }

  getPriorityClass(priority: 'low' | 'medium' | 'high'): string {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
      default:
        return 'bg-green-100 text-green-800 border-green-300';
    }
  }

  editTask(task: Task): void {
      this.router.navigate(['/task-management/add-task'], { 
          queryParams: { id: task.id } 
      });
  }

  deleteTask(id: string): void {
      if (confirm('Are you sure you want to delete this task?')) {
          this.taskService.deleteTask(id);
      }
  }
}