import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../../services/auth';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  usuario = { email: '', password: '' };
  cargando = false;
  verPass = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toast: ToastService
  ) {}

  iniciarSesion() {
    if (!this.usuario.email || !this.usuario.password || this.cargando) return;

    this.cargando = true;

    this.authService.login(this.usuario).subscribe({
      next: (res: any) => {
        localStorage.clear();

        const role = res.usuario.role.toLowerCase().trim();

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
        this.cargando = false;
        if (err.status === 400 || err.status === 401) {
          this.toast.error('Credenciales incorrectas. Revisa tu email y contraseña.');
        } else {
          this.toast.error('Error del servidor. Inténtalo más tarde.');
        }
      }
    });
  }
}
