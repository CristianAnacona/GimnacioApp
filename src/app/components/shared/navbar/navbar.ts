import { Component, OnInit } from '@angular/core';
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
