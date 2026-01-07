
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router,RouterModule } from '@angular/router';

import { Navbar } from '../../shared/navbar/navbar';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-socios',
  imports: [CommonModule, RouterModule],
  standalone: true,
  templateUrl: './socios.html',
  styleUrl: './socios.css',
})
export class Socios implements OnInit {
 role: string = '';
  username = '';
  usuarios: any[] = [];

  loadingId: string | null = null; // Para saber qué usuario se está procesando

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
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0); // Reseteamos la hora para comparar solo fechas
  const vencimiento = new Date(fecha);
  return vencimiento < hoy;
}
// En socios.ts
renovar(id: string, dias: number, nombre: string = 'usuario') { // <--- Agregamos 'nombre'
  if (!confirm(`¿Sumar ${dias} días a ${nombre}?`)) return;
  
  this.loadingId = id;
  this.authService.renovarMembresia(id, dias).subscribe({
    next: () => {
      this.cargarUsuarios();
      this.loadingId = null; 
    },
    error: () => {
      this.loadingId = null;
      alert('Error en la renovación');
    }
  });
}
// Añade esto a tu clase Socios
limpiarMembresia(id: string, nombre: string) {
  const confirmar = confirm(`¿Estás seguro de eliminar la membresía de ${nombre}? Esto corregirá errores de asignación.`);
  
  if (confirmar) {
    this.loadingId = id;
    this.authService.limpiarMembresia(id).subscribe({
      next: () => {
        this.cargarUsuarios();
        this.loadingId = null;
      },
      error: () => {
        this.loadingId = null;
        alert('Error al limpiar la membresía');
      }
    });
  }
}
}
