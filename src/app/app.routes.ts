import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'task-management',
        pathMatch: 'full'
    },
    {
        path: 'task-management',
         loadChildren: () => import('../app/task-management/task-management-module').then(m => m.TaskManagementModule)
    },
];
