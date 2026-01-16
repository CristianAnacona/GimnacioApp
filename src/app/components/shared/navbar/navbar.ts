import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  standalone: true,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  constructor(private router: Router) {}
 role: string = '';
  username: string = '';
   menuOpen = false;

     // Detectar clics fuera del menú
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInsideMenu = target.closest('.menu-container');
    const clickedMenuButton = target.closest('.menu-button');
    
    if (!clickedInsideMenu && !clickedMenuButton && this.menuOpen) {
      this.menuOpen = false;
    }
  }

   get menuLinks() {
    if (this.role === 'admin') {
      return [
        { icon: '📰', name: 'noticias', route: 'noticias' },
        { icon: '👥', name: 'socios', route: 'socios' },
        { icon: '💳', name: 'planes', route: 'planes' },
        { icon: '💰', name: 'pagos', route: 'pagos' },
        { icon: '🏋️', name: 'entrenadores', route: 'entrenadores' },
        { icon: '📋', name: 'rutinas', route: 'rutinas' }
      ];
    } else if (this.role === 'socio') {
      return [
        { icon: '📰', name: 'noticias', route: 'noticias' },
        { icon: '💪', name: 'mi rutina', route: 'mi-rutina' },
        { icon: '👤', name: 'perfil', route: 'perfil' },
        { icon: '💳', name: 'planes', route: 'planes' },
        { icon: '💰', name: 'pagos', route: 'pagos' }
      ];
    }
    return [];
  }

  ngOnInit() {
    // Recuperamos los datos que guardamos al hacer login
    this.role = localStorage.getItem('role') || 'admin';
    this.username = localStorage.getItem('nombre') || 'Usuario';
  }
   toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

 logout() {
  // 1. Borramos las credenciales
  localStorage.clear(); 

  // 2. Navegamos al login (necesitas tener el Router inyectado en el constructor)
  this.router.navigate(['/login']); 
}
}
