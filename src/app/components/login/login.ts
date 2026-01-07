import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

import { Router } from '@angular/router';


import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule,  RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
// Objeto para capturar las credenciales del usuario
  usuario = {
    email: '',
    password: ''
  };

  constructor
  (private router: Router, private authService: AuthService) {}

iniciarSesion() {
    this.authService.login(this.usuario).subscribe({
      next: (res: any) => {
        console.log('Login exitoso:', res);
        
        // 1. GUARDA EL TOKEN (Indispensable para el AuthGuard)
        localStorage.setItem('token', res.token);
        
        // 2. GUARDA EL ROL (Para saber si es admin o socio después)
        // Usamos 'role' porque es lo que definimos que enviaría el Backend
        localStorage.setItem('role', res.usuario.role);
        localStorage.setItem('nombre', res.usuario.nombre);

        // 3. AHORA SÍ, NAVEGA
        this.router.navigate(['/home']);
      },
      error: (err: any) => {
        alert('❌ Error: Usuario o contraseña incorrectos.');
        console.error(err);
      }
    });
  }
}
