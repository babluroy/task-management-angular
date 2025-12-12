import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskBoard } from './task-board/task-board';
import { RouterModule } from '@angular/router';
import { AddTask } from './add-task/add-task';
import { TaskList } from './task-list/task-list';

const routes = [
  {
    path: '',
    component: TaskBoard
  },
  {
    path: 'add-task',
    component: AddTask
  },
  {
    path: 'list-tasks',
    component: TaskList
  }
]


@NgModule({
  declarations: [],
  imports: [
    [RouterModule.forChild(routes)],
    CommonModule
  ]
})
export class TaskManagementModule { }
