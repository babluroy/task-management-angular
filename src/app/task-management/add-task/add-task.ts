import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TaskService } from '../task-service';
import { Task } from "../../../common/models/task.model"
import { User } from "../../../common/models/task.model"
import { Subscription } from 'rxjs'
import { filter, take, map } from 'rxjs/operators'; 

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.html',
  styleUrls: ['./add-task.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class AddTask implements OnInit, OnDestroy { 
  taskForm!: FormGroup;
  taskId: string | null = null;
  isEditMode: boolean = false; 
  private subscription: Subscription = new Subscription(); 

  availableUsers: User[] = [
    { id: 'usr-001', name: 'Rohan' },
    { id: 'usr-002', name: 'Shruti' },
    { id: 'usr-003', name: 'John' }
  ];

  priorityOptions = ['low', 'medium', 'high'];
  statusOptions = ['todo', 'in-progress', 'done'];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute 
  ) { }

  ngOnInit(): void {
    this.initForm();
    
    this.subscription.add(
      this.route.queryParams.subscribe(params => {
        this.taskId = params['id'];
        this.isEditMode = !!this.taskId;
        if (this.isEditMode) {
          this.loadTaskData(this.taskId!);
        }
      })
    );
  }
  
  initForm(): void {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      status: [this.statusOptions[0], Validators.required],
      priority: [this.priorityOptions[1], Validators.required],
      assignedUser: [null, Validators.required] 
    });
  }

 loadTaskData(id: string): void {
  this.subscription.add(
    this.taskService.tasks$.pipe(
      map((tasks: Task[]) => tasks.find(t => t.id === id)),
      take(1)
    ).subscribe(task => {
      if (task) {
        // update task
        const matchedUser = this.availableUsers.find(
          u => u.id === task.assignedUser?.id
        );
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          assignedUser: matchedUser || null 
        });
      } else {
        // add task
        this.isEditMode = false;
        this.router.navigate(['/task-management/add-task']);
      }
    })
  );
}


  get f() { return this.taskForm.controls; }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const taskPayload: Task = {
      id: this.isEditMode ? this.taskId! : Date.now().toString(),
      ...this.taskForm.value
    };

    if (this.isEditMode) {
      this.taskService.updateTask(taskPayload);
    } else {
      this.taskService.addTask(taskPayload);
    }
    
    this.router.navigate(['/task-management']);
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}