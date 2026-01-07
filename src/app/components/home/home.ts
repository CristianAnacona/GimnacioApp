import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Para redirigir si no está autenticado
import { Navbar } from '../shared/navbar/navbar';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  standalone: true,
  imports: [CommonModule, Navbar]
})
export class HomeComponent implements OnInit {
  // Array de usuarios (solo visible para admin)
  usuarios: any[] = [];
  // Rol del usuario autenticado (admin o socio)
  role: string = '';
  // Nombre del usuario autenticado
  username: string = '';

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    // Obtener datos del usuario desde localStorage
    this.username = localStorage.getItem('nombre') || 'Usuario';
    this.role = (localStorage.getItem('role') || 'socio').trim().toLowerCase();

    // Si es admin, cargar la lista de usuarios
    if (this.role === 'admin') {
      this.cargarUsuarios();
    }

    // Opcional: Verificar autenticación
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
    }
  }

  // Cargar lista de usuarios desde el backend
cargarUsuarios() {
    this.authService.getUsuarios().subscribe({
      next: (res: any) => {
        this.usuarios = res;
        this.cdr.detectChanges(); // 3. Forzar la detección de cambios
        console.log('Tabla actualizada con:', this.usuarios.length, 'usuarios');
      },
      error: (err) => console.error(err)
    });
  }
  // Verificar si una membresía está vencida
  esVencido(fecha: any): boolean {
    if (!fecha) return true;
    return new Date(fecha) < new Date();
  }

  // Renovar membresía de un usuario por X días
  renovar(id: string, dias: number) {
    this.authService.renovarMembresia(id, dias).subscribe({
      next: () => {
        // Recargar tabla después de renovar
        this.cargarUsuarios();
        console.log(`Membresía renovada por ${dias} días`);
      },
      error: (err) => alert('Error al renovar: ' + (err.error.mensaje || 'Intenta de nuevo'))
    });
  }


}