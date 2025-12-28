import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'inventory-management',
        pathMatch: 'full'
    },
    {
        path: 'inventory-management',
        loadChildren: () => import('../app/inventory-management/inventory-management-module').then(m => m.InventoryManagementModule)
    }
];
