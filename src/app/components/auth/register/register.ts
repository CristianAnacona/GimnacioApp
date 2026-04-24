import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../../services/auth';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  nuevoUsuario = { nombre: '', email: '', password: '', confirmPassword: '', role: 'socio' };
  verPass = false;
  verConfirmPass = false;

  constructor(
    private authService: AuthService,
    private toast: ToastService,
    private router: Router
  ) {}

  esFormularioValido(): boolean {
    return (
      this.nuevoUsuario.nombre.length > 2 &&
      this.nuevoUsuario.email.includes('@') &&
      this.nuevoUsuario.password.length >= 8 &&
      this.nuevoUsuario.password === this.nuevoUsuario.confirmPassword
    );
  }

  contrasenasCoinciden(): boolean {
    return this.nuevoUsuario.password === this.nuevoUsuario.confirmPassword;
  }

  registrar() {
    if (!this.esFormularioValido()) return;

    const usuarioAEnviar = { ...this.nuevoUsuario, role: 'socio' };

    this.authService.registrar(usuarioAEnviar).subscribe({
      next: () => {
        this.toast.success('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        const msg = err.error?.mensaje || 'El correo ya está registrado o hubo un problema con el servidor.';
        this.toast.error(msg);
      }
    });
  }
}
