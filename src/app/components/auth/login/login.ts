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
    // 1. Validar campos y evitar doble clic si ya está cargando
    if (!this.usuario.email || !this.usuario.password || this.cargando) return;

    this.cargando = true; 
    this.mensajeCarga = 'Despertando Guerreros...';

    this.authService.login(this.usuario).subscribe({
      next: (res: any) => {
        // Limpiamos sesión antigua
        localStorage.clear();

        const role = res.usuario.role.toLowerCase().trim();
        
        // Guardamos info del Guerrero
        localStorage.setItem('userId', res.usuario._id);
        localStorage.setItem('usuario', JSON.stringify(res.usuario));
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', role);
        localStorage.setItem('nombre', res.usuario.nombre);

        // Navegación según el rango
        if (role === 'admin') {
          this.router.navigate(['admin/noticias']);
        } else {
          this.router.navigate(['/socio']);
        }
        
        this.cargando = false;
      },
      error: (err) => {
        this.cargando = false; // ¡Importante! Liberamos el botón si falla
        
        // Manejo inteligente de errores para no ensuciar la consola
        if (err.status === 400 || err.status === 401) {
          alert('❌ Credenciales incorrectas. Revisa tu email y contraseña.');
        } else if (err.status === 0 || err.status === 504) {
          alert('⏳ El servidor Drakkar está despertando. Espera 10 segundos e intenta de nuevo.');
        } else {
          console.error('Error no controlado:', err);
          alert('🔥 Hubo un problema en el Valhalla. Inténtalo más tarde.');
        }
      }
    });
  } 
}