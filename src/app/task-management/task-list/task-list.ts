
import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Task, User } from '../../../common/models/task.model';
import { Router } from '@angular/router';
import { TaskService } from '../task-service';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.html',
  styleUrls: ['./task-list.css'],
  imports:[FormsModule, NgClass, CommonModule]
})
export class TaskList implements OnInit {
  
  availableUsers: User[] = [
    { id: 'usr-000', name: 'All Users' }, 
    { id: 'usr-001', name: 'Alice Johnson' },
    { id: 'usr-002', name: 'Bob Smith' },
    { id: 'usr-003', name: 'Charlie Day' }
  ];

  private selectedUserIdSubject = new BehaviorSubject<string>('usr-000');
  
  filteredTasks$: Observable<Task[]>;

  selectedUserId: string = 'usr-000';

  constructor(
    private taskService: TaskService, 
    private router: Router
  ) {
    this.filteredTasks$ = combineLatest([
      this.taskService.tasks$,
      this.selectedUserIdSubject.asObservable()
    ]).pipe(
      map(([tasks, userId]) => {
        if (userId === 'usr-000') {
          return tasks;
        }
        return tasks.filter(task => task.assignedUser.id === userId);
      })
    );
  }

  ngOnInit(): void {
    this.filteredTasks$ = combineLatest([
      this.taskService.tasks$,
      this.selectedUserIdSubject.asObservable()
    ]).pipe(
      map(([tasks, userId]) => {
        if (userId === 'usr-000') {
          return tasks; 
        }
        return tasks.filter(task => task.assignedUser.id === userId);
      })
    );
  }

onUserFilterChange(userId: string): void {
  this.selectedUserId = userId;            
  this.selectedUserIdSubject.next(userId); 
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