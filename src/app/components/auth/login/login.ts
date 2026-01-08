import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth';

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
      
      const role = res.usuario.role.toLowerCase().trim();
      console.log('Rol procesado:', role); // Verifica que imprima "admin"

      localStorage.setItem('usuario', JSON.stringify(res.usuario));
      localStorage.setItem('token', res.token);
      localStorage.setItem('role', role);
      localStorage.setItem('nombre', res.usuario.nombre);

      if (role === 'admin') {
        this.router.navigate(['admin/socios']);
      } else {
        console.log('Navegando a socio...');
        this.router.navigate(['/socio']);
      }
    },
    error: (err) => {
      console.error('Error en login:', err);
      alert('Credenciales incorrectas');
    }
  });
}
}
