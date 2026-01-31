import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router';
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  usuario = {
    email: '',
    password: ''
  };

  // 1. Estado para el spinner
  cargando: boolean = false; 
  verPass: boolean = false;
  mensajeCarga: string = 'Iniciando sesión...'; // NUEVO
  intentos: number = 0; // NUEVO

  constructor(private router: Router, private authService: AuthService) {}

  iniciarSesion() {
    if (!this.usuario.email || !this.usuario.password) return;

    this.cargando = true; // Activa el estado visual de carga

    this.authService.login(this.usuario).subscribe({
      next: (res: any) => {
        // Limpiamos localStorage previo para evitar conflictos
        localStorage.clear();

        const role = res.usuario.role.toLowerCase().trim();
        
        // Guardamos la información esencial
        localStorage.setItem('userId', res.usuario._id);
        localStorage.setItem('usuario', JSON.stringify(res.usuario));
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', role);
        localStorage.setItem('nombre', res.usuario.nombre);

        if (role === 'admin') {
          this.router.navigate(['admin/noticias']);
        } else {
          this.router.navigate(['/socio']);
        }
        this.cargando = false;
      },
      error: (err) => {
        this.cargando = false; // Desactiva el spinner en caso de error
        console.error('Error en login:', err);
        
        // Mensaje amigable si el servidor está tardando
        if (err.status === 0 || err.status === 504) {
          alert('El servidor está despertando, por favor intenta de nuevo en unos segundos.');
        } else {
          alert('Credenciales incorrectas o usuario no encontrado.');
        }
      }
    });
  }
}