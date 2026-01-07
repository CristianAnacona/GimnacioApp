import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router,RouterModule } from '@angular/router';

import { Navbar } from '../../shared/navbar/navbar';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, Navbar, RouterModule],
  templateUrl: './dashboardAdmin.html',
  styleUrl: './dashboardAdmin.css',
})
export class AdminDashboard implements OnInit {
role: string = '';
  username = '';
  usuarios: any[] = [];

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    // El guard ya validó que es admin
    this.role = localStorage.getItem('role') || 'admin';
    this.username = localStorage.getItem('nombre') || 'Admin';
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.authService.getUsuarios().subscribe({
      next: (res: any) => {
        this.usuarios = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  esVencido(fecha: any): boolean {
    if (!fecha) return true;
    return new Date(fecha) < new Date();
  }

  renovar(id: string, dias: number) {
    this.authService.renovarMembresia(id, dias).subscribe({
      next: () => this.cargarUsuarios(),
      error: (err) =>
        alert('Error al renovar: ' + (err.error?.mensaje || 'Intenta de nuevo'))
    });
  }
}
