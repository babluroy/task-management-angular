import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; 

@Component({
  selector: 'app-layout',
  templateUrl: './layout.html',
  styleUrls: ['./layout.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class LayoutComponent {
  
  private router = inject(Router);

  sidebarOpen: boolean = false;

  menuItems = [
    { path: '/task-management', icon: '📝', name: 'Task Board' },
    { path: '/task-management/list-tasks', icon: '📋', name: 'Task List' },
    { path: '/task-management/add-task', icon: '➕', name: 'New Task' }
  ];

  isActive(path: string): boolean {
    return this.router.url.startsWith(path);
  }
  
  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}