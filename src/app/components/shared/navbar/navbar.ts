import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
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
    localStorage.clear();
    window.location.reload();
  }
}
